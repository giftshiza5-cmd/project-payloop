import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";
import { usePayLoopApp } from "../context/PayLoopContext";
import { registerForReminders } from "../utils/notifications";
import { Screen } from "../components/Screen";
import { AppHeader } from "../components/AppHeader";
import { AuthInput } from "../components/AuthInput";
import { Logo3D } from "../components/Logo3D";

export function LoginScreen({ navigation }) {
  const { wallet, displayName, setDisplayName } = usePayLoopApp();
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const address = await wallet.connect(displayName);
      await registerForReminders(address);
      navigation.replace("Dashboard");
    } catch (error) {
      Alert.alert("Login failed", error.message);
    }
  }

  return (
    <Screen>
      <AppHeader title="Login" onLeft={() => navigation.goBack()} />
      
      <View style={styles.loginHero}>
        <Logo3D size={70} />
        <Text style={styles.loginTitle}>Welcome Back!</Text>
        <Text style={styles.loginCopy}>Login to continue to PayLoop</Text>
      </View>
      
      <AuthInput icon="@" placeholder="Email Address" value={displayName} onChangeText={setDisplayName} />
      <AuthInput icon="#" placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      
      <TouchableOpacity style={styles.forgotButton}>
        <Text style={styles.greenLink}>Forgot Password?</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
        <Text style={styles.primaryButtonText}>{wallet.isConnecting ? "Connecting..." : "Login"}</Text>
      </TouchableOpacity>
      
      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.divider} />
      </View>
      
      <TouchableOpacity style={styles.walletButton} onPress={handleLogin}>
        <Text style={styles.walletButtonText}>Login with MetaMask</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.registerLink}>
        <Text style={styles.smallCenterText}>
          Don't have an account? <Text style={styles.greenText}>Register</Text>
        </Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loginHero: {
    alignItems: "center",
    gap: 9,
    marginBottom: 12,
    marginTop: 12,
  },
  loginTitle: {
    color: colors.ink,
    fontSize: 21,
    fontWeight: "900",
  },
  loginCopy: {
    color: colors.muted,
    fontSize: 13,
  },
  forgotButton: {
    alignItems: "flex-end",
    marginTop: -4,
    paddingHorizontal: 2,
  },
  greenLink: {
    color: colors.green,
    fontSize: 13,
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
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
  },
  dividerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginVertical: 4,
  },
  divider: {
    backgroundColor: colors.border,
    flex: 1,
    height: 1.5,
  },
  dividerText: {
    color: colors.muted,
    fontSize: 12,
  },
  walletButton: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1.5,
    minHeight: 52,
    justifyContent: "center",
    shadowColor: "#0b1f16",
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  walletButtonText: {
    color: colors.ink,
    fontWeight: "900",
  },
  registerLink: {
    marginTop: 6,
    alignSelf: "center",
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
