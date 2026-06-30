import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useColors } from "@/hooks/useColors";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  accentColor?: string;
  glowBorder?: boolean;
}

export function GlassCard({
  children,
  style,
  accentColor,
  glowBorder = false,
}: GlassCardProps) {
  const colors = useColors();
  const borderColor = accentColor ?? colors.border;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: glowBorder ? borderColor : colors.border,
          shadowColor: glowBorder ? borderColor : "#000",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
});
