import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export function SelectBox({ value }) {
  return (
    <View style={styles.selectBox}>
      <Text style={styles.selectText}>{value}</Text>
      <Text style={styles.chevronDark}>v</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  selectBox: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 52,
    paddingHorizontal: 14,
  },
  selectText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "800",
  },
  chevronDark: {
    color: colors.ink,
    fontSize: 20,
  },
});
