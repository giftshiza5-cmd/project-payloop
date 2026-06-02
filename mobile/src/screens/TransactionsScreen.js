import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";
import { Screen } from "../components/Screen";
import { AppHeader } from "../components/AppHeader";
import { TransactionRow } from "../components/TransactionRow";

const localTransactions = [
  { id: "1", type: "Contribution", group: "Eldoret Chama", amount: "+KES 2,500", date: "May 12, 2024", icon: "+", tone: colors.green },
  { id: "2", type: "Loan Disbursed", group: "School fees", amount: "+KES 20,000", date: "May 10, 2024", icon: "L", tone: "#8b5cf6" },
  { id: "3", type: "Loan Repayment", group: "School fees", amount: "-KES 5,000", date: "May 02, 2024", icon: "-", tone: "#f97316" },
  { id: "4", type: "Rewards", group: "LoopPoints", amount: "+50 LP", date: "Apr 20, 2024", icon: "*", tone: "#8b5cf6" },
];

export function TransactionsScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredTransactions = activeFilter === "All"
    ? localTransactions
    : localTransactions.filter(tx => {
        if (activeFilter === "Contributions") return tx.type === "Contribution" || tx.type === "Loan Repayment";
        if (activeFilter === "Loans") return tx.type === "Loan Disbursed";
        if (activeFilter === "Rewards") return tx.type === "Rewards";
        return true;
      });

  const filters = ["All", "Contributions", "Loans", "Rewards"];

  return (
    <Screen>
      <AppHeader title="Transactions" left="<" onLeft={() => navigation.goBack()} />
      
      <View style={styles.filterRow}>
        {filters.map((item) => (
          <TouchableOpacity 
            key={item} 
            onPress={() => setActiveFilter(item)}
            activeOpacity={0.8}
            style={item === activeFilter ? styles.filterActive : styles.filterItem}
          >
            <Text style={item === activeFilter ? styles.filterActiveText : styles.filterItemText}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.transactionsList}>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <TransactionRow key={transaction.id} item={transaction} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No transactions found for {activeFilter}</Text>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 4,
    flexWrap: "wrap",
  },
  filterActive: {
    backgroundColor: colors.cardSoft,
    borderColor: colors.greenLight,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterActiveText: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "900",
  },
  filterItem: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterItemText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
  },
  transactionsList: {
    gap: 12,
    marginTop: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "800",
  },
});
