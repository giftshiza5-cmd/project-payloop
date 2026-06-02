import React, { useRef } from "react";
  import { SafeAreaView, StatusBar, StyleSheet, Animated, View } from "react-native";
  import { colors } from "../theme/colors";
  import { ParallaxBackdrop } from "./ParallaxBackdrop";

  export function Screen({ children, scroll = true }) {
    const scrollY = useRef(new Animated.Value(0)).current;

    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar barStyle="dark-content" />
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
      backgroundColor: colors.background,
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
