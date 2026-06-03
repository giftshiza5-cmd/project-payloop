import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";
import { usePayLoopApp } from "../context/PayLoopContext";

export function AppHeader({ title, left = "<", right, onLeft, onRight }) {
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
  const iconColor = isDark ? "#a78bfa" : "#6d3df2";
  const iconBg = isDark ? "rgba(139, 92, 246, 0.18)" : "rgba(109, 61, 242, 0.08)";
  const textColor = isDark ? "#ffffff" : colors.ink;

  return (
    <View style={styles.appHeader}>
      <TouchableOpacity 
        style={[styles.headerIcon, { backgroundColor: iconBg }]} 
        onPress={onLeft}
      >
        <Text style={[styles.headerIconText, { color: iconColor }]}>{left}</Text>
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: textColor }]}>{title}</Text>
      {right ? (
        <TouchableOpacity 
          style={[styles.headerIcon, { backgroundColor: iconBg }]} 
          onPress={onRight}
        >
          <Text style={[styles.headerIconText, { color: iconColor }]}>{right}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.headerIconPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  appHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    marginBottom: 8,
  },
  headerIcon: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 40,
    borderRadius: 20,
  },
  headerIconPlaceholder: {
    width: 40,
  },
  headerIconText: {
    fontSize: 20,
    fontWeight: "900",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
  },
});
