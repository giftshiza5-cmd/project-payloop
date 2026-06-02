import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export function Logo3D({ size = 76 }) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 6200,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    ).start();
  }, [spin]);

  const rotateY = spin.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["-16deg", "18deg", "-16deg"],
  });

  const rotateX = spin.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["10deg", "-8deg", "10deg"],
  });

  return (
    <Animated.View
      style={[
        styles.logo3D,
        {
          height: size,
          width: size,
          transform: [
            { perspective: 700 },
            { rotateY },
            { rotateX },
          ],
        },
      ]}
    >
      <View style={styles.logoInset}>
        <Text style={[styles.logoMark, { fontSize: size * 0.42 }]}>P</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  logo3D: {
    alignItems: "center",
    backgroundColor: colors.green,
    borderColor: "#6ee7b7",
    borderRadius: 22,
    borderWidth: 2,
    elevation: 10,
    justifyContent: "center",
    shadowColor: colors.greenDark,
    shadowOffset: { height: 14, width: 0 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
  },
  logoInset: {
    alignItems: "center",
    borderColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 4,
    height: "62%",
    justifyContent: "center",
    width: "62%",
    shadowColor: "#000",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoMark: {
    color: "#ffffff",
    fontWeight: "900",
    lineHeight: 40,
  },
});
