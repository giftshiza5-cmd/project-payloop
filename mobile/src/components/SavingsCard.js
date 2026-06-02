import React, { useEffect, useRef } from "react";
import { Animated, Easing, PanResponder, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export function SavingsCard({ balance, onPress }) {
  // Automated floating animation
  const lift = useRef(new Animated.Value(0)).current;
  
  // Touch tilt/gesture animations
  const tiltX = useRef(new Animated.Value(0)).current;
  const tiltY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const walletFlapOpen = useRef(new Animated.Value(0)).current; // 0 to 1

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(lift, { toValue: 1, duration: 3500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(lift, { toValue: 0, duration: 3500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    ).start();
  }, [lift]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Animated.parallel([
          Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }),
          Animated.spring(walletFlapOpen, { toValue: 1, useNativeDriver: true }),
        ]).start();
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        // Assume center is 160, 60
        const xVal = Math.max(-1, Math.min(1, (locationX - 160) / 160));
        const yVal = Math.max(-1, Math.min(1, (locationY - 60) / 60));

        Animated.parallel([
          Animated.spring(tiltY, { toValue: xVal * 8, useNativeDriver: true }),
          Animated.spring(tiltX, { toValue: -yVal * 8, useNativeDriver: true }),
        ]).start();
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
          Animated.spring(tiltX, { toValue: 0, useNativeDriver: true }),
          Animated.spring(tiltY, { toValue: 0, useNativeDriver: true }),
          Animated.spring(walletFlapOpen, { toValue: 0, useNativeDriver: true }),
        ]).start();

        if (onPress) {
          onPress();
        }
      },
      onPanResponderTerminate: () => {
        Animated.parallel([
          Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
          Animated.spring(tiltX, { toValue: 0, useNativeDriver: true }),
          Animated.spring(tiltY, { toValue: 0, useNativeDriver: true }),
          Animated.spring(walletFlapOpen, { toValue: 0, useNativeDriver: true }),
        ]).start();
      },
    })
  ).current;

  // Interlocked transforms: combine automated float + manual tilt
  const combinedTranslateY = Animated.add(
    lift.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }),
    tiltX.interpolate({ inputRange: [-8, 8], outputRange: [2, -2] })
  );

  const rotateXFloat = lift.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "3deg"] });

  const finalRotateX = Animated.add(
    tiltX,
    lift.interpolate({ inputRange: [0, 1], outputRange: [0, 3] })
  ).interpolate({
    inputRange: [-11, 11],
    outputRange: ["-11deg", "11deg"],
  });

  const finalRotateY = tiltY.interpolate({
    inputRange: [-8, 8],
    outputRange: ["-8deg", "8deg"],
  });

  // Wallet flap animations (3D open)
  const flapRotateX = walletFlapOpen.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "70deg"], // opens forward in 3D space
  });

  const flapTranslateY = walletFlapOpen.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.savingsCard,
        {
          transform: [
            { perspective: 900 },
            { scale: scale },
            { rotateX: finalRotateX },
            { rotateY: finalRotateY },
            { translateY: combinedTranslateY },
          ],
        },
      ]}
    >
      <View>
        <Text style={styles.savingsLabel}>Total Savings</Text>
        <Text style={styles.savingsAmount}>{balance}</Text>
        <Text style={styles.savingsTrend}>+12.5% from last month</Text>
      </View>
      
      {/* 3D Wallet visual component */}
      <View style={styles.wallet3D}>
        <Animated.View 
          style={[
            styles.walletFlap,
            {
              transform: [
                { perspective: 400 },
                { translateY: flapTranslateY },
                { rotateX: flapRotateX },
                { rotateZ: "-12deg" },
              ]
            }
          ]} 
        />
        <View style={styles.walletPocket} />
        <View style={styles.walletButtonDot} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  savingsCard: {
    backgroundColor: colors.green,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 122,
    overflow: "hidden",
    padding: 22,
    borderColor: "#4ade80",
    borderWidth: 1.5,
    shadowColor: colors.greenDark,
    shadowOffset: { height: 16, width: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },
  savingsLabel: {
    color: "#eafff1",
    fontSize: 12,
    fontWeight: "800",
  },
  savingsAmount: {
    color: "#ffffff",
    fontSize: 27,
    fontWeight: "900",
    marginTop: 8,
  },
  savingsTrend: {
    color: "#eafff1",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 10,
  },
  wallet3D: {
    alignSelf: "center",
    backgroundColor: "#fb9959",
    borderRadius: 9,
    height: 62,
    shadowColor: "#065f46",
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    transform: [{ rotateZ: "-2deg" }],
    width: 78,
  },
  walletFlap: {
    backgroundColor: "#84cc16",
    borderRadius: 8,
    height: 26,
    left: 8,
    position: "absolute",
    top: -14,
    width: 52,
  },
  walletPocket: {
    backgroundColor: "#f97316",
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    bottom: 0,
    height: 29,
    left: 0,
    position: "absolute",
    right: 0,
  },
  walletButtonDot: {
    backgroundColor: "#fde68a",
    borderRadius: 5,
    height: 10,
    position: "absolute",
    right: 13,
    top: 28,
    width: 10,
  },
});
