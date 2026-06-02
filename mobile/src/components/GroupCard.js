import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { TiltTouch } from "./TiltTouch";

export function GroupCard({ group, onPress }) {
  return (
    <TiltTouch maxTilt={5} scaleOnPress={0.97} style={styles.groupCard} onPress={onPress}>
      <View style={styles.groupHeader}>
        <View style={styles.roundIcon}>
          <Text style={styles.roundIconText}>{(group.name || "G").slice(0, 1)}</Text>
        </View>
        <View style={styles.flex}>
          <Text style={styles.cardTitle}>{group.name}</Text>
          <Text style={styles.mutedSmall}>{group.members}</Text>
        </View>
        <View style={styles.activePill}><Text style={styles.activePillText}>Active</Text></View>
      </View>
      <View style={styles.cardSplit}>
        <View>
          <Text style={styles.mutedSmall}>Total Balance</Text>
          <Text style={styles.boldValue}>{group.balance}</Text>
        </View>
        <View>
          <Text style={styles.mutedSmall}>My Contribution</Text>
          <Text style={styles.boldValue}>{group.contribution}</Text>
        </View>
      </View>
    </TiltTouch>
  );
}

const styles = StyleSheet.create({
  groupCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    gap: 18,
    padding: 16,
    shadowColor: "#0b1f16",
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 4,
  },
  groupHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  roundIcon: {
    alignItems: "center",
    backgroundColor: colors.greenLight,
    borderRadius: 999,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  roundIconText: {
    color: colors.greenDark,
    fontWeight: "900",
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
  activePill: {
    backgroundColor: "#dcfce7",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  activePillText: {
    color: colors.greenDark,
    fontSize: 11,
    fontWeight: "900",
  },
  cardSplit: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  boldValue: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "900",
    marginTop: 4,
  },
});
