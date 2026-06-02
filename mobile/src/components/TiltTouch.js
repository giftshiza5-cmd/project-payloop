import React, { useRef } from "react";
import { Animated, PanResponder } from "react-native";

export function TiltTouch({ children, style, onPress, maxTilt = 8, scaleOnPress = 0.96 }) {
  const rotateX = useRef(new Animated.Value(0)).current;
  const rotateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const shadowOpacity = useRef(new Animated.Value(0.15)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        Animated.parallel([
          Animated.spring(scale, { toValue: scaleOnPress, useNativeDriver: true }),
          Animated.spring(shadowOpacity, { toValue: 0.28, useNativeDriver: true }),
        ]).start();
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        // Approximate sizing relative to touch. Assume center is at roughly 160, 70
        const xVal = Math.max(-1, Math.min(1, (locationX - 160) / 160));
        const yVal = Math.max(-1, Math.min(1, (locationY - 70) / 70));

        Animated.parallel([
          Animated.spring(rotateY, { toValue: xVal * maxTilt, useNativeDriver: true }),
          Animated.spring(rotateX, { toValue: -yVal * maxTilt, useNativeDriver: true }),
        ]).start();
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
          Animated.spring(shadowOpacity, { toValue: 0.15, useNativeDriver: true }),
          Animated.spring(rotateX, { toValue: 0, useNativeDriver: true }),
          Animated.spring(rotateY, { toValue: 0, useNativeDriver: true }),
        ]).start();

        if (onPress) {
          onPress();
        }
      },
      onPanResponderTerminate: () => {
        Animated.parallel([
          Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
          Animated.spring(shadowOpacity, { toValue: 0.15, useNativeDriver: true }),
          Animated.spring(rotateX, { toValue: 0, useNativeDriver: true }),
          Animated.spring(rotateY, { toValue: 0, useNativeDriver: true }),
        ]).start();
      },
    })
  ).current;

  const interpolatedRotateX = rotateX.interpolate({
    inputRange: [-maxTilt, maxTilt],
    outputRange: [`-${maxTilt}deg`, `${maxTilt}deg`],
  });

  const interpolatedRotateY = rotateY.interpolate({
    inputRange: [-maxTilt, maxTilt],
    outputRange: [`-${maxTilt}deg`, `${maxTilt}deg`],
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        style,
        {
          transform: [
            { perspective: 900 },
            { scale: scale },
            { rotateX: interpolatedRotateX },
            { rotateY: interpolatedRotateY },
          ],
          shadowOpacity: shadowOpacity,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
