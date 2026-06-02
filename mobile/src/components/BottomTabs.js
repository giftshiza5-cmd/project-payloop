import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";

export function BottomTabs({ active, navigation }) {
  const items = [
    ["Home", "H", "Dashboard"],
    ["Groups", "G", "Groups"],
    ["Contribute", "+", "Contribute"],
    ["Loans", "L", "LoanRequest"],
    ["Profile", "P", "Profile"],
  ];

  return (
    <View style={styles.bottomTabs}>
      {items.map(([label, icon, route]) => (
        <TouchableOpacity 
          key={label} 
          style={styles.tabItem} 
          onPress={() => navigation.navigate(route)}
          activeOpacity={0.7}
        >
          <View style={label === "Contribute" ? styles.fabTab : styles.regularTabIconContainer}>
            <Text style={label === active ? styles.tabIconActive : label === "Contribute" ? styles.fabText : styles.tabIcon}>
              {icon}
            </Text>
          </View>
          <Text style={label === active ? styles.tabLabelActive : styles.tabLabel}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomTabs: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1.5,
    bottom: 18,
    flexDirection: "row",
    justifyContent: "space-around",
    left: 18,
    minHeight: 68,
    position: "absolute",
    right: 18,
    shadowColor: "#0b1f16",
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  tabItem: {
    alignItems: "center",
    flex: 1,
    gap: 3,
    justifyContent: "center",
  },
  regularTabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 28,
  },
  tabIcon: {
    color: colors.muted,
    fontSize: 17,
    fontWeight: "900",
  },
  tabIconActive: {
    color: colors.green,
    fontSize: 18,
    fontWeight: "900",
  },
  tabLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "800",
  },
  tabLabelActive: {
    color: colors.green,
    fontSize: 10,
    fontWeight: "900",
  },
  fabTab: {
    alignItems: "center",
    backgroundColor: colors.green,
    borderRadius: 999,
    height: 48,
    justifyContent: "center",
    marginTop: -28,
    width: 48,
    shadowColor: colors.greenDark,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    borderColor: "#ffffff",
    borderWidth: 2,
  },
  fabText: {
    color: "#ffffff",
    fontSize: 26,
    lineHeight: 28,
  },
});
