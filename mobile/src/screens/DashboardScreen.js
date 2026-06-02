import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

const groupId = 0;

const localTransactions = [
  { id: "1", type: "Contribution", group: "Eldoret Chama", amount: "+KES 2,500", date: "May 12, 2024", icon: "+", tone: colors.green },
  { id: "2", type: "Loan Disbursed", group: "School fees", amount: "+KES 20,000", date: "May 10, 2024", icon: "L", tone: "#8b5cf6" },
  { id: "3", type: "Loan Repayment", group: "School fees", amount: "-KES 5,000", date: "May 02, 2024", icon: "-", tone: "#f97316" },
  { id: "4", type: "Rewards", group: "LoopPoints", amount: "+50 LP", date: "Apr 20, 2024", icon: "*", tone: "#8b5cf6" },
];

export function DashboardScreen({ navigation }) {
  const { wallet, displayName } = usePayLoopApp();
  const [vaultBalance, setVaultBalance] = useState("15,000");
  const [groupName, setGroupName] = useState("Eldoret Chama");

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

  return (
    <Screen>
      <View style={styles.dashboardTopBar}>
        <TouchableOpacity style={styles.headerIcon}>
          <Text style={styles.headerIconText}>=</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity 
          style={styles.headerIconScanner} 
          onPress={() => navigation.navigate("QRScanner")}
        >
          <Text style={styles.headerScannerText}>⛶</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.greetingSection}>
        <Text style={styles.greeting}>Hello, {displayName.split(" ")[0]}</Text>
        <Text style={styles.mutedSmall}>Welcome back to PayLoop</Text>
      </View>
      
      {wallet.isWrongNetwork ? <NetworkWarning wallet={wallet} /> : null}
      
      <SavingsCard 
        balance={`KES ${vaultBalance}`} 
        onPress={() => navigation.navigate("Contribute")}
      />
      
      <View style={styles.statsGrid}>
        <StatCard 
          icon="G" 
          label="My Groups" 
          value="3" 
          status="Active" 
          tone={colors.green} 
          onPress={() => navigation.navigate("Groups")}
        />
        <StatCard 
          icon="L" 
          label="Pending Loans" 
          value="1" 
          status="Request" 
          tone={colors.warning} 
          onPress={() => navigation.navigate("LoanRequest")}
        />
        <StatCard 
          icon="C" 
          label="Credit Score" 
          value="720" 
          status="Excellent" 
          tone={colors.blue} 
          onPress={() => navigation.navigate("CreditScore")}
        />
        <StatCard 
          icon="K" 
          label="Total Contributions" 
          value="KES 8,500" 
          status="This Month" 
          tone={colors.greenDark} 
          onPress={() => navigation.navigate("Contribute")}
        />
      </View>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Transactions")}>
          <Text style={styles.greenLink}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <TransactionRow item={localTransactions[0]} />
      <TransactionRow item={localTransactions[1]} />
      
      <BottomTabs active="Home" navigation={navigation} />
    </Screen>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: "rgba(22, 163, 74, 0.08)",
    borderRadius: 20,
  },
  headerIconText: {
    color: colors.green,
    fontSize: 22,
    fontWeight: "900",
  },
  headerIconScanner: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 40,
    backgroundColor: "rgba(22, 163, 74, 0.08)",
    borderRadius: 20,
    borderColor: colors.green,
    borderWidth: 1,
  },
  headerScannerText: {
    color: colors.green,
    fontSize: 20,
    fontWeight: "900",
  },
  headerTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900",
  },
  greetingSection: {
    marginVertical: 4,
  },
  greeting: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "900",
  },
  mutedSmall: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
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
  greenLink: {
    color: colors.green,
    fontSize: 13,
    fontWeight: "900",
  },
});
