import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export function ScoreLine({ label, value }) {
  return (
    <View style={styles.scoreLine}>
      <Text style={styles.mutedCopy}>{label}</Text>
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
    color: colors.muted,
    fontSize: 14,
  },
  scoreLineValue: {
    color: colors.green,
    fontWeight: "900",
  },
});
