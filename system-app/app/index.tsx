import React, { useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useSystem } from "@/context/SystemContext";
import { GlassCard } from "@/components/GlassCard";
import { GlowText } from "@/components/GlowText";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, workout, completedToday, complete, loading } = useSystem();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (!completedToday) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.04,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [completedToday, pulseAnim]);

  const handleComplete = async () => {
    if (completedToday) return;

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.93,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    await complete();
  };

  if (loading || !state || !workout) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, justifyContent: "center" },
        ]}
      >
        <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
          INITIALIZING
        </Text>
      </View>
    );
  }

  const topPad =
    Platform.OS === "web" ? 67 : insets.top;
  const bottomPad =
    Platform.OS === "web" ? 34 : insets.bottom + 16;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: topPad + 16,
          paddingBottom: bottomPad,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.push("/settings")}
          style={styles.settingsBtn}
          hitSlop={10}
        >
          <Feather name="settings" size={20} color={colors.mutedForeground} />
        </Pressable>
        <GlowText
          text="SYSTEM"
          style={styles.systemTitle}
          glowRadius={20}
        />
        <Text style={[styles.playerName, { color: colors.mutedForeground }]}>
          PLAYER: {state.playerName}
        </Text>
      </View>

      {/* Day + Streak row */}
      <View style={styles.statsRow}>
        <GlassCard style={styles.statCard} accentColor={colors.cyan} glowBorder>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            CURRENT DAY
          </Text>
          <GlowText
            text={String(state.currentDay)}
            color={colors.cyan}
            style={styles.statValue}
            glowRadius={10}
          />
        </GlassCard>
        <GlassCard style={styles.statCard} accentColor={colors.purple} glowBorder>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            STREAK
          </Text>
          <GlowText
            text={String(state.streak)}
            color={colors.purple}
            style={styles.statValue}
            glowRadius={10}
          />
        </GlassCard>
      </View>

      {/* Workout Card */}
      <GlassCard
        style={styles.workoutCard}
        accentColor={workout.isRest ? colors.cyan : colors.purple}
        glowBorder
      >
        <View style={styles.workoutHeader}>
          <Text
            style={[styles.workoutLabel, { color: colors.mutedForeground }]}
          >
            {workout.label}
          </Text>
          <GlowText
            text={workout.type}
            color={workout.isRest ? colors.cyan : colors.purple}
            style={styles.workoutType}
            glowRadius={14}
          />
        </View>

        {workout.isRest ? (
          <Text
            style={[styles.restMessage, { color: colors.mutedForeground }]}
          >
            {workout.restMessage}
          </Text>
        ) : (
          <View style={styles.exerciseList}>
            {workout.exercises.map((ex, i) => (
              <View key={i} style={styles.exerciseRow}>
                <View
                  style={[styles.dot, { backgroundColor: colors.purple }]}
                />
                <Text
                  style={[styles.exerciseName, { color: colors.foreground }]}
                >
                  {ex.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </GlassCard>

      {/* Complete Button */}
      <View style={styles.buttonContainer}>
        {completedToday ? (
          <View
            style={[
              styles.completedContainer,
              {
                backgroundColor: colors.surface,
                borderColor: colors.cyan,
                borderWidth: 1,
                borderRadius: 20,
              },
            ]}
          >
            <GlowText
              text="MISSION COMPLETED"
              color={colors.cyan}
              style={styles.completedTitle}
              glowRadius={12}
            />
            <Text
              style={[
                styles.completedSub,
                { color: colors.mutedForeground },
              ]}
            >
              Come back tomorrow.
            </Text>
          </View>
        ) : (
          <Animated.View
            style={{ transform: [{ scale: scaleAnim }, { scale: pulseAnim }] }}
          >
            <Pressable
              onPress={handleComplete}
              style={[
                styles.completeButton,
                {
                  backgroundColor: "transparent",
                  borderColor: colors.purple,
                  shadowColor: colors.purple,
                },
              ]}
            >
              <Text
                style={[
                  styles.completeButtonText,
                  {
                    color: colors.purple,
                  },
                ]}
              >
                COMPLETE
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 13,
    letterSpacing: 4,
    textAlign: "center",
    fontFamily: "Inter_500Medium",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    gap: 6,
  },
  settingsBtn: {
    position: "absolute",
    right: 0,
    top: 4,
    padding: 4,
  },
  systemTitle: {
    fontSize: 48,
    fontFamily: "Inter_700Bold",
    letterSpacing: 12,
  },
  playerName: {
    fontSize: 12,
    letterSpacing: 4,
    fontFamily: "Inter_400Regular",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
  },
  statLabel: {
    fontSize: 10,
    letterSpacing: 3,
    fontFamily: "Inter_500Medium",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    letterSpacing: 2,
  },
  workoutCard: {
    marginBottom: 32,
    paddingVertical: 24,
  },
  workoutHeader: {
    marginBottom: 20,
  },
  workoutLabel: {
    fontSize: 10,
    letterSpacing: 4,
    fontFamily: "Inter_500Medium",
    marginBottom: 6,
  },
  workoutType: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    letterSpacing: 8,
  },
  restMessage: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    letterSpacing: 1,
    lineHeight: 22,
  },
  exerciseList: {
    gap: 14,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  exerciseName: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
  },
  buttonContainer: {
    alignItems: "center",
  },
  completeButton: {
    borderWidth: 1.5,
    borderRadius: 60,
    paddingVertical: 20,
    paddingHorizontal: 64,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  completeButtonText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    letterSpacing: 6,
  },
  completedContainer: {
    alignItems: "center",
    padding: 28,
    width: "100%",
    gap: 8,
  },
  completedTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    letterSpacing: 4,
  },
  completedSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
  },
});
