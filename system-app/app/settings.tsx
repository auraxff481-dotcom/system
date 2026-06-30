import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useSystem } from "@/context/SystemContext";
import { GlassCard } from "@/components/GlassCard";
import { GlowText } from "@/components/GlowText";

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, updatePlayerName, updateNotificationTime, reset } =
    useSystem();

  const [playerName, setPlayerName] = useState(state?.playerName ?? "INFINITE");
  const [hour, setHour] = useState(
    String(state?.notificationHour ?? 19).padStart(2, "0")
  );
  const [minute, setMinute] = useState(
    String(state?.notificationMinute ?? 0).padStart(2, "0")
  );

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 16;

  const handleSaveName = async () => {
    const trimmed = playerName.trim().toUpperCase();
    if (!trimmed) return;
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await updatePlayerName(trimmed);
  };

  const handleSaveTime = async () => {
    const h = parseInt(hour);
    const m = parseInt(minute);
    if (isNaN(h) || h < 0 || h > 23 || isNaN(m) || m < 0 || m > 59) {
      Alert.alert("Invalid time", "Enter a valid time (0-23 for hour, 0-59 for minute).");
      return;
    }
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await updateNotificationTime(h, m);
  };

  const handleReset = () => {
    Alert.alert(
      "RESET PROGRESS",
      "This will reset your current day, streak, and workout status. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "RESET",
          style: "destructive",
          onPress: async () => {
            if (Platform.OS !== "web") {
              await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning
              );
            }
            await reset();
            setPlayerName(state?.playerName ?? "INFINITE");
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingTop: topPad + 16,
        paddingBottom: bottomPad,
        paddingHorizontal: 24,
        gap: 20,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <View style={styles.titleRow}>
        <GlowText
          text="SETTINGS"
          style={styles.pageTitle}
          color={colors.purple}
          glowRadius={12}
        />
      </View>

      {/* Player Name */}
      <GlassCard accentColor={colors.purple} glowBorder>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          PLAYER NAME
        </Text>
        <TextInput
          value={playerName}
          onChangeText={(v) => setPlayerName(v.toUpperCase())}
          style={[
            styles.input,
            {
              color: colors.foreground,
              borderColor: colors.border,
              backgroundColor: colors.muted,
              fontFamily: "Inter_600SemiBold",
            },
          ]}
          placeholderTextColor={colors.mutedForeground}
          autoCapitalize="characters"
          maxLength={20}
          returnKeyType="done"
          onSubmitEditing={handleSaveName}
        />
        <Pressable
          onPress={handleSaveName}
          style={[styles.saveButton, { borderColor: colors.purple }]}
        >
          <Text
            style={[
              styles.saveButtonText,
              {
                color: colors.purple,
              },
            ]}
          >
            SAVE
          </Text>
        </Pressable>
      </GlassCard>

      {/* Notification Time */}
      <GlassCard accentColor={colors.cyan} glowBorder>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          NOTIFICATION TIME
        </Text>
        <View style={styles.timeRow}>
          <TextInput
            value={hour}
            onChangeText={(v) => setHour(v.replace(/[^0-9]/g, "").slice(0, 2))}
            style={[
              styles.timeInput,
              {
                color: colors.foreground,
                borderColor: colors.border,
                backgroundColor: colors.muted,
                fontFamily: "Inter_700Bold",
              },
            ]}
            keyboardType="number-pad"
            maxLength={2}
            placeholderTextColor={colors.mutedForeground}
            placeholder="19"
          />
          <Text style={[styles.timeSep, { color: colors.mutedForeground }]}>
            :
          </Text>
          <TextInput
            value={minute}
            onChangeText={(v) =>
              setMinute(v.replace(/[^0-9]/g, "").slice(0, 2))
            }
            style={[
              styles.timeInput,
              {
                color: colors.foreground,
                borderColor: colors.border,
                backgroundColor: colors.muted,
                fontFamily: "Inter_700Bold",
              },
            ]}
            keyboardType="number-pad"
            maxLength={2}
            placeholderTextColor={colors.mutedForeground}
            placeholder="00"
          />
        </View>
        <Text style={[styles.timeNote, { color: colors.mutedForeground }]}>
          Default: 19:00 (7:00 PM)
        </Text>
        <Pressable
          onPress={handleSaveTime}
          style={[styles.saveButton, { borderColor: colors.cyan }]}
        >
          <Text
            style={[
              styles.saveButtonText,
              {
                color: colors.cyan,
              },
            ]}
          >
            SAVE
          </Text>
        </Pressable>
      </GlassCard>

      {/* Reset */}
      <GlassCard accentColor={colors.destructive} glowBorder>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          RESET PROGRESS
        </Text>
        <Text style={[styles.resetNote, { color: colors.mutedForeground }]}>
          Resets day, workout cycle, and streak. Cannot be undone.
        </Text>
        <Pressable
          onPress={handleReset}
          style={[
            styles.saveButton,
            { borderColor: colors.destructive, marginTop: 16 },
          ]}
        >
          <Text
            style={[
              styles.saveButtonText,
              {
                color: colors.destructive,
              },
            ]}
          >
            RESET
          </Text>
        </Pressable>
      </GlassCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleRow: {
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: 8,
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 3,
    fontFamily: "Inter_500Medium",
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    letterSpacing: 2,
    marginBottom: 14,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  timeInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 28,
    letterSpacing: 2,
    textAlign: "center",
    width: 80,
  },
  timeSep: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
  },
  timeNote: {
    fontSize: 11,
    letterSpacing: 1,
    fontFamily: "Inter_400Regular",
    marginBottom: 14,
  },
  saveButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    letterSpacing: 4,
  },
  resetNote: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.5,
    lineHeight: 20,
  },
});
