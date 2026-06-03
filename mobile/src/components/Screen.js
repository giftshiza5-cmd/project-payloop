import React, { useRef } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Animated, View } from "react-native";
import { colors } from "../theme/colors";
import { ParallaxBackdrop } from "./ParallaxBackdrop";
import { usePayLoopApp } from "../context/PayLoopContext";

export function Screen({ children, scroll = true }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  
  let theme = "light";
  try {
    const context = usePayLoopApp();
    if (context && context.theme) {
      theme = context.theme;
    }
  } catch {
    // Context might not be available yet, default to light
  }

  const isDark = theme === "dark";
  const bg = isDark ? "#090e1a" : colors.background;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ParallaxBackdrop scrollY={scrollY} />
      {scroll ? (
        <Animated.ScrollView
          contentContainerStyle={styles.screenContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          {children}
        </Animated.ScrollView>
      ) : (
        <View style={styles.flex}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  screenContent: {
    gap: 14,
    padding: 18,
    paddingBottom: 100,
  },
  flex: {
    flex: 1,
  },
});
