import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export function ParallaxBackdrop({ scrollY }) {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 5200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 5200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [drift]);

  // Combine drift and scrollY. The backdrop elements translate at different ratios (0.3 vs 0.15) relative to the scroll offset.
  const washTranslateY = Animated.add(
    drift.interpolate({ inputRange: [0, 1], outputRange: [-18, 18] }),
    scrollY.interpolate({ inputRange: [-500, 500], outputRange: [150, -150], extrapolate: "clamp" })
  );

  const washTranslateX = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 10],
  });

  const planeTranslateY = Animated.add(
    drift.interpolate({ inputRange: [0, 1], outputRange: [12, -14] }),
    scrollY.interpolate({ inputRange: [-500, 500], outputRange: [75, -75], extrapolate: "clamp" })
  );

  const planeRotateZ = drift.interpolate({
    inputRange: [0, 1],
    outputRange: ["-7deg", "4deg"],
  });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          styles.backdropWash,
          {
            transform: [
              { translateY: washTranslateY },
              { translateX: washTranslateX },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.backdropPlane,
          {
            transform: [
              { perspective: 700 },
              { rotateZ: planeRotateZ },
              { translateY: planeTranslateY },
            ],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backdropWash: {
    backgroundColor: "#dcfce7",
    borderBottomLeftRadius: 96,
    borderBottomRightRadius: 96,
    height: 230,
    left: -60,
    opacity: 0.64,
    position: "absolute",
    right: -60,
    top: -60,
  },
  backdropPlane: {
    backgroundColor: "#eefcf3",
    borderColor: "#d6f4df",
    borderRadius: 8,
    borderWidth: 1,
    height: 220,
    opacity: 0.72,
    position: "absolute",
    right: -90,
    top: 120,
    width: 210,
  },
});
