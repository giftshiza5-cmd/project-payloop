import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export function HistoryRow({ month, date, amount }) {
  return (
    <View style={styles.historyRow}>
      <View style={styles.transactionIcon}>
        <Text style={styles.transactionIconText}>$</Text>
      </View>
      <View style={styles.flex}>
        <Text style={styles.cardTitle}>{month}</Text>
        <Text style={styles.paidText}>Paid</Text>
      </View>
      <View style={styles.rightText}>
        <Text style={styles.boldValue}>{amount}</Text>
        <Text style={styles.mutedSmall}>{date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  historyRow: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 13,
    shadowColor: "#0b1f16",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  transactionIcon: {
    alignItems: "center",
    backgroundColor: "#dcfce7",
    borderRadius: 999,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  transactionIconText: {
    color: colors.green,
    fontSize: 18,
    fontWeight: "900",
  },
  flex: {
    flex: 1,
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "900",
  },
  paidText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: "900",
    marginTop: 2,
  },
  rightText: {
    alignItems: "flex-end",
  },
  boldValue: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "900",
  },
  mutedSmall: {
    color: colors.muted,
    fontSize: 12,
  },
});
