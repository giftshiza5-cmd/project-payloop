import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { usePayLoopApp } from "../context/PayLoopContext";

export function ScoreLine({ label, value }) {
  let theme = "light";
  try {
    const context = usePayLoopApp();
    if (context && context.theme) {
      theme = context.theme;
    }
  } catch {
    // Context fallback
  }

  const isDark = theme === "dark";
  const labelColor = isDark ? "#94a3b8" : colors.muted;

  return (
    <View style={styles.scoreLine}>
      <Text style={[styles.mutedCopy, { color: labelColor }]}>{label}</Text>
      <Text style={styles.scoreLineValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scoreLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  mutedCopy: {
    fontSize: 14,
  },
  scoreLineValue: {
    color: colors.green,
    fontWeight: "900",
  },
});
