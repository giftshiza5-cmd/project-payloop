import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";
import { Screen } from "../components/Screen";
import { Logo3D } from "../components/Logo3D";

function IntroPeople() {
  return (
    <View style={styles.peopleScene}>
      <View style={[styles.person, styles.personOne]}>
        <View style={[styles.head, { backgroundColor: "#8b4b2e" }]} />
        <View style={[styles.body, { backgroundColor: colors.greenDark }]} />
      </View>
      <View style={[styles.person, styles.personTwo]}>
        <View style={[styles.head, { backgroundColor: "#5b3527" }]} />
        <View style={[styles.body, { backgroundColor: "#f7b84b" }]} />
      </View>
      <View style={[styles.person, styles.personThree]}>
        <View style={[styles.head, { backgroundColor: "#6b3c27" }]} />
        <View style={[styles.body, { backgroundColor: "#1f8a52" }]} />
      </View>
      <View style={[styles.person, styles.personFour]}>
        <View style={[styles.head, { backgroundColor: "#3d241b" }]} />
        <View style={[styles.body, { backgroundColor: "#f5cf65" }]} />
      </View>
      <View style={styles.phoneMini}>
        <Text style={styles.phoneMiniText}>KES</Text>
      </View>
    </View>
  );
}

export function OverviewScreen({ navigation }) {
  return (
    <Screen>
      <View style={styles.centerHero}>
        <Logo3D />
        <Text style={styles.brandTitle}>PayLoop</Text>
        <Text style={styles.heroCopy}>Decentralized group savings for smarter communities.</Text>
      </View>
      
      <IntroPeople />
      
      <View style={styles.buttonStack}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.secondaryButtonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.registerLink}>
          <Text style={styles.smallCenterText}>
            New here? <Text style={styles.greenText}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerHero: {
    alignItems: "center",
    gap: 12,
    marginTop: 64,
  },
  brandTitle: {
    color: colors.ink,
    fontSize: 33,
    fontWeight: "900",
  },
  heroCopy: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 265,
    textAlign: "center",
  },
  peopleScene: {
    alignItems: "center",
    height: 178,
    justifyContent: "flex-end",
    marginTop: 20,
  },
  person: {
    alignItems: "center",
    bottom: 10,
    position: "absolute",
  },
  personOne: {
    left: 38,
    transform: [{ scale: 0.9 }],
  },
  personTwo: {
    left: 82,
  },
  personThree: {
    transform: [{ scale: 1.08 }],
  },
  personFour: {
    right: 54,
  },
  head: {
    borderRadius: 20,
    height: 42,
    width: 42,
  },
  body: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: 72,
    marginTop: -2,
    width: 70,
  },
  phoneMini: {
    alignItems: "center",
    backgroundColor: colors.ink,
    borderRadius: 7,
    bottom: 6,
    height: 42,
    justifyContent: "center",
    position: "absolute",
    width: 34,
  },
  phoneMiniText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "900",
  },
  buttonStack: {
    gap: 14,
    marginTop: 18,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.green,
    borderRadius: 12,
    minHeight: 54,
    justifyContent: "center",
    shadowColor: colors.greenDark,
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1.5,
    minHeight: 52,
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: colors.green,
    fontWeight: "900",
  },
  registerLink: {
    marginTop: 6,
  },
  smallCenterText: {
    color: colors.ink,
    fontSize: 13,
    textAlign: "center",
  },
  greenText: {
    color: colors.green,
    fontWeight: "900",
  },
});
