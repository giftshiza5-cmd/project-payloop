import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";
import { usePayLoopApp } from "../context/PayLoopContext";
import { upsertPayLoopUser } from "../lib/firebase";
import { registerForReminders } from "../utils/notifications";
import { Screen } from "../components/Screen";
import { AppHeader } from "../components/AppHeader";
import { AuthInput } from "../components/AuthInput";

export function RegisterScreen({ navigation }) {
  const { wallet, displayName, setDisplayName } = usePayLoopApp();
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  async function handleRegister() {
    if (!displayName || !lastName || !phoneNumber || !email) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      Alert.alert("Error", "You must agree to the Terms & Conditions.");
      return;
    }

    try {
      const address = await wallet.connect(displayName);
      await upsertPayLoopUser({
        walletAddress: address,
        displayName: `${displayName} ${lastName}`.trim(),
        email,
        phoneNumber,
        role: "Member",
      });
      await registerForReminders(address);
      navigation.replace("Dashboard");
    } catch (error) {
      Alert.alert("Registration failed", error.message);
    }
  }

  return (
    <Screen>
      <AppHeader title="Register" onLeft={() => navigation.goBack()} />
      
      <AuthInput icon="U" placeholder="First Name" value={displayName} onChangeText={setDisplayName} />
      <AuthInput icon="U" placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <AuthInput icon="T" placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
      <AuthInput icon="@" placeholder="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <AuthInput icon="#" placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <AuthInput icon="#" placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
      
      <TouchableOpacity 
        style={styles.termsRow} 
        onPress={() => setAgreeTerms(!agreeTerms)}
        activeOpacity={0.8}
      >
        <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
          {agreeTerms && <Text style={styles.checkboxText}>✓</Text>}
        </View>
        <Text style={styles.termsText}>
          I agree to the <Text style={styles.greenText}>Terms & Conditions</Text> and <Text style={styles.greenText}>Privacy Policy</Text>
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
        <Text style={styles.primaryButtonText}>{wallet.isConnecting ? "Connecting..." : "Register"}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.loginLink}>
        <Text style={styles.smallCenterText}>
          Already have an account? <Text style={styles.greenText}>Login</Text>
        </Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  termsRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
    paddingHorizontal: 2,
  },
  checkbox: {
    alignItems: "center",
    borderColor: colors.green,
    borderRadius: 6,
    borderWidth: 1.5,
    height: 22,
    justifyContent: "center",
    width: 22,
    backgroundColor: "#ffffff",
  },
  checkboxActive: {
    backgroundColor: colors.green,
  },
  checkboxText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 12,
  },
  termsText: {
    color: colors.ink,
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  greenText: {
    color: colors.green,
    fontWeight: "900",
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
    marginTop: 14,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
  },
  loginLink: {
    marginTop: 6,
    alignSelf: "center",
  },
  smallCenterText: {
    color: colors.ink,
    fontSize: 13,
    textAlign: "center",
  },
});
