import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { useColors } from "@/hooks/useColors";

interface GlowTextProps {
  text: string;
  color?: string;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  glowRadius?: number;
}

export function GlowText({
  text,
  color,
  style,
  containerStyle,
  glowRadius = 12,
}: GlowTextProps) {
  const colors = useColors();
  const glowColor = color ?? colors.purple;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text
        style={[
          styles.text,
          {
            color: glowColor,
          },
          style,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  text: {
    textShadowOffset: { width: 0, height: 0 },
  },
});
