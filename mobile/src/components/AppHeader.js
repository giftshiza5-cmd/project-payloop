import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";

export function AppHeader({ title, left = "<", right, onLeft, onRight }) {
  return (
    <View style={styles.appHeader}>
      <TouchableOpacity style={styles.headerIcon} onPress={onLeft}>
        <Text style={styles.headerIconText}>{left}</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      {right ? (
        <TouchableOpacity style={styles.headerIcon} onPress={onRight}>
          <Text style={styles.headerIconText}>{right}</Text>
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
    backgroundColor: "rgba(22, 163, 74, 0.08)",
    borderRadius: 20,
  },
  headerIconPlaceholder: {
    width: 40,
  },
  headerIconText: {
    color: colors.green,
    fontSize: 20,
    fontWeight: "900",
  },
  headerTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900",
  },
});
