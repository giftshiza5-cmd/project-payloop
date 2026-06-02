import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { TiltTouch } from "./TiltTouch";

export function StatCard({ icon, label, value, status, tone, onPress }) {
  return (
    <TiltTouch maxTilt={6} scaleOnPress={0.97} style={styles.statCard} onPress={onPress}>
      <View style={[styles.statIcon, { backgroundColor: `${tone}18` }]}>
        <Text style={[styles.statIconText, { color: tone }]}>{icon}</Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={[styles.statStatus, { color: tone }]}>{status}</Text>
    </TiltTouch>
  );
}

const styles = StyleSheet.create({
  statCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 104,
    padding: 14,
    width: "47.8%",
    shadowColor: "#0b1f16",
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statIcon: {
    alignItems: "center",
    borderRadius: 999,
    height: 32,
    justifyContent: "center",
    marginBottom: 8,
    width: 32,
  },
  statIconText: {
    fontWeight: "900",
  },
  statLabel: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "800",
  },
  statValue: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 4,
  },
  statStatus: {
    fontSize: 11,
    fontWeight: "900",
    marginTop: 2,
  },
});
