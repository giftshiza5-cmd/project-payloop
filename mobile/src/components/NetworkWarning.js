import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";

export function NetworkWarning({ wallet }) {
  async function switchNetwork() {
    try {
      await wallet.switchToPolygon();
    } catch (error) {
      Alert.alert("Network switch failed", error.message);
    }
  }

  return (
    <View style={styles.warning}>
      <Text style={styles.warningText}>You are not connected to Polygon.</Text>
      <TouchableOpacity style={styles.secondaryButton} onPress={switchNetwork}>
        <Text style={styles.secondaryButtonText}>Switch to Polygon</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  warning: {
    backgroundColor: "#fff7ed",
    borderColor: "#fed7aa",
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 14,
  },
  warningText: {
    color: "#c2410c",
    fontWeight: "900",
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 40,
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: colors.green,
    fontWeight: "900",
  },
});
