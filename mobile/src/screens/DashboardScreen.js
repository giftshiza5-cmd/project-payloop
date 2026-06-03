import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Animated, Easing, Dimensions } from "react-native";
import { colors } from "../theme/colors";
import { usePayLoopApp } from "../context/PayLoopContext";
import {
  circleVaultAbi,
  contractAddresses,
  fromWei,
  getReadOnlyContract,
} from "../lib/contracts";
import { Screen } from "../components/Screen";
import { SavingsCard } from "../components/SavingsCard";
import { StatCard } from "../components/StatCard";
import { TransactionRow } from "../components/TransactionRow";
import { BottomTabs } from "../components/BottomTabs";
import { NetworkWarning } from "../components/NetworkWarning";

const { width } = Dimensions.get("window");
const groupId = 0;

const localTransactions = [
  { id: "1", type: "Contribution", group: "Eldoret Chama", amount: "+KES 2,500", date: "May 12, 2024", icon: "+", tone: colors.green },
  { id: "2", type: "Loan Disbursed", group: "School fees", amount: "+KES 20,000", date: "May 10, 2024", icon: "L", tone: "#8b5cf6" },
  { id: "3", type: "Loan Repayment", group: "School fees", amount: "-KES 5,000", date: "May 02, 2024", icon: "-", tone: "#f97316" },
  { id: "4", type: "Rewards", group: "LoopPoints", amount: "+50 LP", date: "Apr 20, 2024", icon: "*", tone: "#8b5cf6" },
];

function AnimatedMiniChart({ isDark }) {
  const chartData = [
    { label: "Jan", val: 35 },
    { label: "Feb", val: 55 },
    { label: "Mar", val: 45 },
    { label: "Apr", val: 78 },
    { label: "May", val: 60 },
    { label: "Jun", val: 92 },
  ];

  const barAnims = useRef(chartData.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = barAnims.map((anim, idx) =>
      Animated.timing(anim, {
        toValue: chartData[idx].val,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      })
    );
    Animated.stagger(80, animations).start();
  }, []);

  return (
    <View style={[styles.chartCard, isDark && styles.chartCardDark]}>
      <Text style={[styles.chartTitle, isDark && styles.chartTitleDark]}>Chama Savings Trend (6 mo)</Text>
      <View style={styles.chartBarContainer}>
        {chartData.map((item, idx) => (
          <View key={item.label} style={styles.chartCol}>
            <View style={[styles.barBackground, isDark && styles.barBackgroundDark]}>
              <Animated.View 
                style={[
                  styles.barActive, 
                  { 
                    height: barAnims[idx].interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"]
                    })
                  }
                ]} 
              />
            </View>
            <Text style={[styles.chartColLabel, isDark && styles.chartColLabelDark]}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function DashboardScreen({ navigation }) {
  const { wallet, displayName, theme, toggleTheme } = usePayLoopApp();
  const [vaultBalance, setVaultBalance] = useState("15,000");
  const [groupName, setGroupName] = useState("Eldoret Chama");
  
  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-280)).current;

  const isDark = theme === "dark";

  useEffect(() => {
    async function loadVault() {
      if (!wallet.provider || !contractAddresses.circleVault) {
        return;
      }

      try {
        const vault = await getReadOnlyContract(
          wallet.provider,
          contractAddresses.circleVault,
          circleVaultAbi,
          "CircleVault",
        );
        const group = await vault.groups(groupId);
        setGroupName(group.name || "Eldoret Chama");
        setVaultBalance(fromWei(group.balance));
      } catch {
        setVaultBalance("15,000");
      }
    }

    loadVault();
  }, [wallet.provider]);

  const toggleDrawer = () => {
    const toValue = isDrawerOpen ? -280 : 0;
    Animated.timing(drawerAnim, {
      toValue,
      duration: 250,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <View style={styles.flex}>
      <Screen>
        {/* Top bar with hamburger menu */}
        <View style={styles.dashboardTopBar}>
          <TouchableOpacity style={[styles.headerIcon, isDark && styles.headerIconDark]} onPress={toggleDrawer}>
            <Text style={styles.headerIconText}>☰</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>PayLoop</Text>
          <TouchableOpacity 
            style={[styles.headerIconScanner, isDark && styles.headerIconScannerDark]} 
            onPress={() => navigation.navigate("QRScanner")}
          >
            <Text style={styles.headerScannerText}>⛶</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.greetingSection}>
          <Text style={[styles.greeting, isDark && styles.greetingDark]}>Hello, {displayName.split(" ")[0]}</Text>
          <Text style={[styles.mutedSmall, isDark && styles.mutedSmallDark]}>Welcome back to PayLoop</Text>
        </View>
        
        {wallet.isWrongNetwork ? <NetworkWarning wallet={wallet} /> : null}
        
        <SavingsCard 
          balance={`KES ${vaultBalance}`} 
          onPress={() => navigation.navigate("Contribute")}
        />
        
        <View style={styles.statsGrid}>
          <StatCard 
            icon="👥" 
            label="My Groups" 
            value="3" 
            status="Active" 
            tone="#3b82f6" 
            onPress={() => navigation.navigate("Groups")}
          />
          <StatCard 
            icon="📈" 
            label="Pending Loans" 
            value="1" 
            status="Request" 
            tone="#f59e0b" 
            onPress={() => navigation.navigate("LoanRequest")}
          />
          <StatCard 
            icon="⚡" 
            label="Credit Score" 
            value="720" 
            status="Excellent" 
            tone="#7c3aed" 
            onPress={() => navigation.navigate("CreditScore")}
          />
          <StatCard 
            icon="💰" 
            label="Total Contributions" 
            value="KES 8,500" 
            status="This Month" 
            tone="#16a34a" 
            onPress={() => navigation.navigate("Contribute")}
          />
        </View>

        {/* Dynamic Interactive Savings Trend Chart */}
        <AnimatedMiniChart isDark={isDark} />
        
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Transactions")}>
            <Text style={styles.purpleLink}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <TransactionRow item={localTransactions[0]} />
        <TransactionRow item={localTransactions[1]} />
        
        <BottomTabs active="Home" navigation={navigation} />
      </Screen>

      {/* Drawer Overlay Backdrop */}
      {isDrawerOpen && (
        <TouchableOpacity 
          activeOpacity={1} 
          style={styles.drawerBackdrop} 
          onPress={toggleDrawer}
        />
      )}

      {/* Side Sliding Drawer */}
      <Animated.View style={[styles.drawerContainer, { left: drawerAnim }, isDark && styles.drawerContainerDark]}>
        <View style={[styles.drawerHeader, isDark && styles.drawerHeaderDark]}>
          <View style={styles.drawerLogoContainer}>
            <Text style={styles.drawerLogoIcon}>P</Text>
            <View>
              <Text style={[styles.drawerLogoText, isDark && styles.drawerLogoTextDark]}>PayLoop</Text>
              <Text style={styles.drawerLogoSubtext}>Decentralized Chama</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.drawerCloseButton} onPress={toggleDrawer}>
            <Text style={[styles.drawerCloseText, isDark && styles.drawerCloseTextDark]}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.drawerContent}>
          <Text style={styles.drawerSectionHeader}>Dashboards</Text>
          <TouchableOpacity style={[styles.drawerItem, styles.drawerItemActive]} onPress={toggleDrawer}>
            <Text style={styles.drawerItemIcon}>ME</Text>
            <Text style={styles.drawerItemTextActive}>Member Console</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={toggleDrawer}>
            <Text style={styles.drawerItemIcon}>TR</Text>
            <Text style={[styles.drawerItemText, isDark && styles.drawerItemTextDark]}>Treasurer Console</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={toggleDrawer}>
            <Text style={styles.drawerItemIcon}>GA</Text>
            <Text style={[styles.drawerItemText, isDark && styles.drawerItemTextDark]}>Group Admin Console</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={toggleDrawer}>
            <Text style={styles.drawerItemIcon}>SA</Text>
            <Text style={[styles.drawerItemText, isDark && styles.drawerItemTextDark]}>Super Admin Console</Text>
          </TouchableOpacity>

          <Text style={[styles.drawerSectionHeader, { marginTop: 16 }]}>Management</Text>
          <TouchableOpacity style={styles.drawerItem} onPress={() => { toggleDrawer(); navigation.navigate("Groups"); }}>
            <Text style={styles.drawerItemIcon}>G</Text>
            <Text style={[styles.drawerItemText, isDark && styles.drawerItemTextDark]}>Chama Groups</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => { toggleDrawer(); navigation.navigate("Contribute"); }}>
            <Text style={styles.drawerItemIcon}>C</Text>
            <Text style={[styles.drawerItemText, isDark && styles.drawerItemTextDark]}>Contributions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => { toggleDrawer(); navigation.navigate("LoanRequest"); }}>
            <Text style={styles.drawerItemIcon}>L</Text>
            <Text style={[styles.drawerItemText, isDark && styles.drawerItemTextDark]}>Loan Board</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => { toggleDrawer(); navigation.navigate("CreditScore"); }}>
            <Text style={styles.drawerItemIcon}>S</Text>
            <Text style={[styles.drawerItemText, isDark && styles.drawerItemTextDark]}>Credit Score</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.drawerFooter, isDark && styles.drawerFooterDark]}>
          <TouchableOpacity style={styles.themeToggleRow} onPress={toggleTheme}>
            <Text style={[styles.drawerItemText, isDark && styles.drawerItemTextDark, { fontWeight: "900" }]}>
              {isDark ? "☀️ Switch to Light" : "🌙 Switch to Dark"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.drawerFooterText}>v0.1.0 © 2026 PayLoop</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  dashboardTopBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    marginBottom: 8,
  },
  headerIcon: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 40,
    backgroundColor: "rgba(109, 61, 242, 0.08)",
    borderRadius: 20,
  },
  headerIconDark: {
    backgroundColor: "rgba(139, 92, 246, 0.18)",
  },
  headerIconText: {
    color: "#6d3df2",
    fontSize: 20,
    fontWeight: "900",
  },
  headerIconScanner: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 40,
    backgroundColor: "rgba(109, 61, 242, 0.08)",
    borderRadius: 20,
    borderColor: "#6d3df2",
    borderWidth: 1.2,
  },
  headerIconScannerDark: {
    backgroundColor: "rgba(139, 92, 246, 0.18)",
    borderColor: "#a78bfa",
  },
  headerScannerText: {
    color: "#6d3df2",
    fontSize: 18,
    fontWeight: "900",
  },
  headerTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900",
  },
  headerTitleDark: {
    color: "#ffffff",
  },
  greetingSection: {
    marginVertical: 4,
  },
  greeting: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "900",
  },
  greetingDark: {
    color: "#ffffff",
  },
  mutedSmall: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  mutedSmallDark: {
    color: "#94a3b8",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 4,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 4,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900",
  },
  sectionTitleDark: {
    color: "#ffffff",
  },
  purpleLink: {
    color: "#6d3df2",
    fontSize: 13,
    fontWeight: "900",
  },
  
  // Custom interactive chart styles
  chartCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginTop: 10,
    shadowColor: "#000000",
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  chartCardDark: {
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.ink,
    marginBottom: 16,
  },
  chartTitleDark: {
    color: "#ffffff",
  },
  chartBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 100,
    paddingHorizontal: 4,
  },
  chartCol: {
    alignItems: "center",
    flex: 1,
  },
  barBackground: {
    width: 14,
    height: 80,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barBackgroundDark: {
    backgroundColor: "#1e293b",
  },
  barActive: {
    width: "100%",
    backgroundColor: "#6d3df2",
    borderRadius: 8,
  },
  chartColLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: colors.muted,
    marginTop: 6,
  },
  chartColLabelDark: {
    color: "#94a3b8",
  },

  // Drawer styles
  drawerBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    zIndex: 998,
  },
  drawerContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: "#ffffff",
    zIndex: 999,
    padding: 16,
    borderRightWidth: 1.5,
    borderRightColor: "#dfe7f2",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { height: 0, width: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 20,
  },
  drawerContainerDark: {
    backgroundColor: "#0f172a",
    borderRightColor: "#1e293b",
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1.2,
    borderBottomColor: "#dfe7f2",
    paddingBottom: 16,
    marginBottom: 16,
  },
  drawerHeaderDark: {
    borderBottomColor: "#1e293b",
  },
  drawerLogoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  drawerLogoIcon: {
    backgroundColor: "#6d3df2",
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
    width: 34,
    height: 34,
    textAlign: "center",
    lineHeight: 34,
    borderRadius: 6,
    overflow: "hidden",
  },
  drawerLogoText: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.ink,
  },
  drawerLogoTextDark: {
    color: "#ffffff",
  },
  drawerLogoSubtext: {
    fontSize: 9,
    fontWeight: "900",
    color: "#94a3b8",
  },
  drawerCloseButton: {
    padding: 6,
  },
  drawerCloseText: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.muted,
  },
  drawerCloseTextDark: {
    color: "#94a3b8",
  },
  drawerContent: {
    flex: 1,
  },
  drawerSectionHeader: {
    fontSize: 9,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#94a3b8",
    marginBottom: 8,
    paddingLeft: 6,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  drawerItemActive: {
    backgroundColor: "rgba(109, 61, 242, 0.08)",
  },
  drawerItemIcon: {
    fontSize: 11,
    fontWeight: "900",
    color: "#94a3b8",
    backgroundColor: "#f1f5f9",
    width: 24,
    height: 24,
    borderRadius: 6,
    textAlign: "center",
    lineHeight: 24,
    overflow: "hidden",
  },
  drawerItemText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.ink,
  },
  drawerItemTextDark: {
    color: "#cbd5e1",
  },
  drawerItemTextActive: {
    fontSize: 13,
    fontWeight: "900",
    color: "#6d3df2",
  },
  drawerFooter: {
    borderTopWidth: 1.2,
    borderTopColor: "#dfe7f2",
    paddingTop: 16,
  },
  drawerFooterDark: {
    borderTopColor: "#1e293b",
  },
  themeToggleRow: {
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    marginBottom: 10,
  },
  drawerFooterText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#94a3b8",
    textAlign: "center",
  },
});
