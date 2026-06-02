import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../theme/colors";

export function AuthInput({ icon, ...inputProps }) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.inputShell, focused && styles.inputShellFocused]}>
      {icon ? <Text style={[styles.inputIcon, focused && styles.inputIconFocused]}>{icon}</Text> : null}
      <TextInput
        style={styles.input}
        placeholderTextColor="#84968b"
        autoCapitalize="none"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputShell: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 52,
    paddingHorizontal: 14,
  },
  inputShellFocused: {
    borderColor: colors.green,
    shadowColor: colors.green,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    color: colors.muted,
    fontSize: 16,
    marginRight: 12,
    width: 18,
  },
  inputIconFocused: {
    color: colors.green,
  },
  input: {
    color: colors.ink,
    flex: 1,
    fontSize: 14,
    minHeight: 50,
  },
});
