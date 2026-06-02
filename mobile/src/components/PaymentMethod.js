import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";

export function PaymentMethod({ label, icon, selected, onPress }) {
  return (
    <TouchableOpacity 
      style={[styles.paymentMethod, selected && styles.paymentMethodSelected]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.methodIcon, selected && styles.methodIconSelected]}>
        <Text style={[styles.methodIconText, selected && styles.methodIconTextSelected]}>{icon}</Text>
      </View>
      <Text style={styles.paymentLabel}>{label}</Text>
      <Text style={styles.chevronDark}>{selected ? "●" : ">"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  paymentMethod: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 58,
    paddingHorizontal: 14,
    shadowColor: "#0b1f16",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  paymentMethodSelected: {
    borderColor: colors.green,
    backgroundColor: colors.cardSoft,
  },
  methodIcon: {
    alignItems: "center",
    backgroundColor: "#dcfce7",
    borderRadius: 8,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  methodIconSelected: {
    backgroundColor: colors.green,
  },
  methodIconText: {
    color: colors.green,
    fontWeight: "900",
  },
  methodIconTextSelected: {
    color: "#ffffff",
  },
  paymentLabel: {
    color: colors.ink,
    flex: 1,
    fontSize: 14,
    fontWeight: "900",
  },
  chevronDark: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "800",
  },
});
