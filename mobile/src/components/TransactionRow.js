import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export function TransactionRow({ item }) {
  return (
    <View style={styles.transactionRow}>
      <View style={[styles.transactionIcon, { backgroundColor: `${item.tone}1f` }]}>
        <Text style={[styles.transactionIconText, { color: item.tone }]}>{item.icon}</Text>
      </View>
      <View style={styles.flex}>
        <Text style={styles.cardTitle}>{item.type}</Text>
        <Text style={styles.mutedSmall}>{item.group}</Text>
      </View>
      <View style={styles.rightText}>
        <Text style={[styles.boldValue, { color: item.amount.startsWith("+") ? colors.green : colors.ink }]}>
          {item.amount}
        </Text>
        <Text style={styles.mutedSmall}>{item.date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionRow: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 14,
    shadowColor: "#0b1f16",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  transactionIcon: {
    alignItems: "center",
    borderRadius: 999,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  transactionIconText: {
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
  mutedSmall: {
    color: colors.muted,
    fontSize: 12,
  },
  rightText: {
    alignItems: "flex-end",
  },
  boldValue: {
    fontSize: 13,
    fontWeight: "900",
  },
});
