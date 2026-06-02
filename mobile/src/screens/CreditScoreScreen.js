import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { usePayLoopApp } from "../context/PayLoopContext";
import {
  contractAddresses,
  getReadOnlyContract,
  creditScoreAbi,
} from "../lib/contracts";
import { Screen } from "../components/Screen";
import { AppHeader } from "../components/AppHeader";
import { ScoreLine } from "../components/ScoreLine";
import { BottomTabs } from "../components/BottomTabs";

export function CreditScoreScreen({ navigation }) {
  const { wallet } = usePayLoopApp();
  const [score, setScore] = useState("720");
  const [profile, setProfile] = useState(null);
  
  // Animation value for the needle gauge
  const needleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function loadScore() {
      if (!wallet.provider || !wallet.walletAddress || !contractAddresses.creditScore) {
        return;
      }

      try {
        const creditScore = await getReadOnlyContract(
          wallet.provider,
          contractAddresses.creditScore,
          creditScoreAbi,
          "CreditScore",
        );
        const nextScore = await creditScore.calculateScore(wallet.walletAddress);
        const nextProfile = await creditScore.profiles(wallet.walletAddress);
        setScore(nextScore.toString());
        setProfile(nextProfile);
      } catch {
        setScore("720");
      }
    }

    loadScore();
  }, [wallet.provider, wallet.walletAddress]);

  // Animate the needle when score changes
  useEffect(() => {
    Animated.timing(needleAnim, {
      toValue: parseFloat(score) || 720,
      duration: 1600,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();
  }, [score, needleAnim]);

  // Interpolate rotation: 0 score is -100deg, 1000 score is 100deg
  const needleRotation = needleAnim.interpolate({
    inputRange: [0, 1000],
    outputRange: ["-100deg", "100deg"],
  });

  return (
    <Screen>
      <AppHeader title="Credit Score" right="i" onLeft={() => navigation.goBack()} />
      
      <View style={styles.scoreDialContainer}>
        <View style={styles.scoreDial}>
          {/* Dial back arcs */}
          <View style={styles.arcBack} />
          <View style={[styles.arcSegment, styles.arcWarm]} />
          <View style={[styles.arcSegment, styles.arcGreen]} />
          
          {/* Layered 3D Needle */}
          <Animated.View 
            style={[
              styles.needleWrapper, 
              { transform: [{ rotateZ: needleRotation }] }
            ]}
          >
            <View style={styles.needleLine} />
          </Animated.View>
          
          {/* Central Pivot Cap */}
          <View style={styles.needlePivot} />
          
          {/* Score labels */}
          <View style={styles.scoreLabels}>
            <Text style={styles.scoreNumber}>{score}</Text>
            <Text style={styles.scoreLabel}>Excellent</Text>
            <Text style={styles.scoreGain}>+40 points this month</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.scoreBreakdown}>
        <ScoreLine label="On-time Contributions" value={profile ? `+${profile.onTimeContributions}` : "+350"} />
        <ScoreLine label="Loan Repayments" value={profile ? `+${profile.loansRepaid}` : "+250"} />
        <ScoreLine label="Account Age" value="+120" />
        
        <View style={styles.totalScoreRow}>
          <Text style={styles.cardTitle}>Total Score</Text>
          <Text style={styles.boldValue}>{score} / 1000</Text>
        </View>
      </View>
      
      <View style={styles.tipCard}>
        <Text style={styles.tipIcon}>★</Text>
        <View style={styles.tipContent}>
          <Text style={styles.cardTitle}>Improve your score</Text>
          <Text style={styles.mutedSmall}>Keep making on-time contributions and repay loans early.</Text>
        </View>
      </View>
      
      <BottomTabs active="Loans" navigation={navigation} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scoreDialContainer: {
    alignItems: "center",
    height: 240,
    justifyContent: "center",
    marginTop: 10,
  },
  scoreDial: {
    alignItems: "center",
    height: 220,
    justifyContent: "flex-end",
    position: "relative",
    width: 220,
  },
  arcBack: {
    borderColor: "#dbeee1",
    borderRadius: 110,
    borderWidth: 12,
    height: 220,
    position: "absolute",
    top: 0,
    width: 220,
  },
  arcSegment: {
    borderRadius: 110,
    borderWidth: 12,
    height: 220,
    position: "absolute",
    top: 0,
    width: 220,
  },
  arcWarm: {
    borderColor: "#fb923c",
    transform: [{ rotateZ: "-38deg" }],
  },
  arcGreen: {
    borderColor: colors.green,
    transform: [{ rotateZ: "36deg" }],
  },
  needleWrapper: {
    bottom: 30,
    height: 110,
    position: "absolute",
    width: 12,
    zIndex: 2,
    alignItems: "center",
  },
  needleLine: {
    backgroundColor: colors.ink,
    borderRadius: 6,
    height: 85,
    width: 4,
    shadowColor: "#000",
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  needlePivot: {
    backgroundColor: colors.green,
    borderColor: "#ffffff",
    borderWidth: 3.5,
    borderRadius: 15,
    height: 30,
    position: "absolute",
    bottom: 15,
    width: 30,
    zIndex: 3,
    shadowColor: "#000",
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  scoreLabels: {
    alignItems: "center",
    position: "absolute",
    bottom: 50,
  },
  scoreNumber: {
    color: colors.ink,
    fontSize: 50,
    fontWeight: "900",
  },
  scoreLabel: {
    color: colors.greenDark,
    fontSize: 16,
    fontWeight: "900",
    marginTop: 2,
  },
  scoreGain: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 6,
  },
  scoreBreakdown: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#0b1f16",
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  totalScoreRow: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 14,
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "900",
  },
  boldValue: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "900",
  },
  tipCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 16,
    shadowColor: "#0b1f16",
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  tipIcon: {
    color: "#f59e0b",
    fontSize: 26,
  },
  tipContent: {
    flex: 1,
  },
  mutedSmall: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
});
