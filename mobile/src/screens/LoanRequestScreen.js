import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";
import { usePayLoopApp } from "../context/PayLoopContext";
import {
  contractAddresses,
  getReadWriteContract,
  lendingPoolAbi,
  toWei,
} from "../lib/contracts";
import { Screen } from "../components/Screen";
import { AppHeader } from "../components/AppHeader";
import { SelectBox } from "../components/SelectBox";
import { AuthInput } from "../components/AuthInput";
import { BottomTabs } from "../components/BottomTabs";

const groupId = 0;

export function LoanRequestScreen({ navigation }) {
  const { wallet } = usePayLoopApp();
  const [amount, setAmount] = useState("20000");
  const [purpose, setPurpose] = useState("School fees");
  const [status, setStatus] = useState("");

  async function submitLoan() {
    try {
      if (!wallet.provider) {
        throw new Error("Connect MetaMask first.");
      }

      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        throw new Error("Please enter a valid loan amount.");
      }

      setStatus("Initiating loan request on-chain...");
      const pool = await getReadWriteContract(
        wallet.provider,
        contractAddresses.lendingPool,
        lendingPoolAbi,
        "LendingPool",
      );
      const tx = await pool.requestLoan(groupId, toWei((parseFloat(amount) / 130).toFixed(6)), purpose || "Member loan");
      setStatus("Loan request transaction sent. Waiting for block confirmation...");
      await tx.wait();
      setStatus("Loan request submitted. Voting status: Pending approvals.");
      Alert.alert("Success", "Loan request submitted on-chain!");
    } catch (error) {
      setStatus(error.message);
      Alert.alert("Submission Failed", error.message);
    }
  }

  const calculatedRepayment = amount && !isNaN(amount) 
    ? (parseFloat(amount) * 1.08).toLocaleString("en-US", { maximumFractionDigits: 2 })
    : "0";

  return (
    <Screen>
      <AppHeader title="Loan Request" left="<" onLeft={() => navigation.goBack()} />
      
      <Text style={styles.formLabel}>Select Group</Text>
      <SelectBox value="Eldoret Chama" />
      
      <Text style={styles.formLabel}>Loan Amount (KES)</Text>
      <AuthInput placeholder="20,000" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      
      <Text style={styles.formLabel}>Purpose</Text>
      <AuthInput placeholder="School fees" value={purpose} onChangeText={setPurpose} />
      
      <Text style={styles.formLabel}>Repayment Period</Text>
      <SelectBox value="3 Months" />
      
      <Text style={styles.repayCopy}>
        You will repay <Text style={styles.boldText}>KES {calculatedRepayment}</Text> including an 8% service fee.
      </Text>
      
      <TouchableOpacity style={styles.primaryButton} onPress={submitLoan}>
        <Text style={styles.primaryButtonText}>Submit Request</Text>
      </TouchableOpacity>
      
      {status ? <Text style={styles.statusText}>{status}</Text> : null}
      
      <BottomTabs active="Loans" navigation={navigation} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  formLabel: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: -6,
    marginTop: 4,
    paddingHorizontal: 2,
  },
  repayCopy: {
    color: colors.ink,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
    paddingHorizontal: 2,
  },
  boldText: {
    fontWeight: "900",
    color: colors.green,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.green,
    borderRadius: 12,
    minHeight: 54,
    justifyContent: "center",
    shadowColor: colors.greenDark,
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 3,
    marginTop: 10,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
  },
  statusText: {
    color: colors.greenDark,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 4,
  },
});
