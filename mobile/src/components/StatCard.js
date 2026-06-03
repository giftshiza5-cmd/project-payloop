import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { TiltTouch } from "./TiltTouch";
import { usePayLoopApp } from "../context/PayLoopContext";

export function StatCard({ icon, label, value, status, tone, onPress }) {
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
  const cardBg = isDark ? "#0f172a" : colors.card;
  const borderColor = isDark ? "#1e293b" : colors.border;
  const textColor = isDark ? "#f8fafc" : colors.ink;

  return (
    <TiltTouch 
      maxTilt={6} 
      scaleOnPress={0.97} 
      style={[
        styles.statCard, 
        { backgroundColor: cardBg, borderColor: borderColor }
      ]} 
      onPress={onPress}
    >
      <View style={[styles.statIcon, { backgroundColor: `${tone}18` }]}>
        <Text style={[styles.statIconText, { color: tone }]}>{icon}</Text>
      </View>
      <Text style={[styles.statLabel, { color: isDark ? "#94a3b8" : colors.ink }]}>{label}</Text>
      <Text style={[styles.statValue, { color: textColor }]}>{value}</Text>
      <Text style={[styles.statStatus, { color: tone }]}>{status}</Text>
    </TiltTouch>
  );
}

const styles = StyleSheet.create({
  statCard: {
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 104,
    padding: 14,
    width: "47.8%",
    shadowColor: "#000000",
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
    fontSize: 12,
    fontWeight: "800",
  },
  statValue: {
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
