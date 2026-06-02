import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";
import { usePayLoopApp } from "../context/PayLoopContext";
import {
  circleVaultAbi,
  contractAddresses,
  getReadWriteContract,
  toWei,
} from "../lib/contracts";
import { Screen } from "../components/Screen";
import { AppHeader } from "../components/AppHeader";
import { AuthInput } from "../components/AuthInput";
import { PaymentMethod } from "../components/PaymentMethod";
import { HistoryRow } from "../components/HistoryRow";
import { BottomTabs } from "../components/BottomTabs";

const groupId = 0;

export function ContributeScreen({ route, navigation }) {
  const { wallet } = usePayLoopApp();
  const [amount, setAmount] = useState("2500");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [status, setStatus] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("mpesa");

  // Check if address was passed back from QR Scanner
  useEffect(() => {
    if (route.params?.scannedAddress) {
      setRecipientAddress(route.params.scannedAddress);
      setSelectedMethod("crypto");
    }
  }, [route.params?.scannedAddress]);

  async function submitContribution() {
    try {
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        throw new Error("Please enter a valid amount.");
      }

      if (selectedMethod === "crypto") {
        if (!wallet.provider) {
          throw new Error("Connect MetaMask first.");
        }

        setStatus("Initiating crypto transaction...");
        
        // If an address is prefilled and it's not the default chama contract, simulate peer transfer
        if (recipientAddress && recipientAddress.toLowerCase() !== contractAddresses.circleVault.toLowerCase()) {
          setStatus(`Sending KES ${amount} (equivalent POL) to peer ${recipientAddress}...`);
          // Standard mock of peer transfer block confirmation
          setTimeout(() => {
            setStatus(`Successfully transferred KES ${amount} to ${recipientAddress.slice(0, 6)}...`);
            Alert.alert("Success", `Sent KES ${amount} to address: ${recipientAddress}`);
          }, 3000);
          return;
        }

        const vault = await getReadWriteContract(
          wallet.provider,
          contractAddresses.circleVault,
          circleVaultAbi,
          "CircleVault",
        );
        const tx = await vault.contribute(groupId, { value: toWei((parseFloat(amount) / 130).toFixed(6)) }); // approximate KES to POL conversion
        setStatus("Waiting for MetaMask confirmation...");
        await tx.wait();
        setStatus("Contribution recorded on-chain successfully.");
        Alert.alert("Success", "Contribution recorded on-chain!");
      } else {
        // M-Pesa
        setStatus("Sending M-Pesa STK Push...");
        setTimeout(() => {
          setStatus("M-Pesa payment received. Syncing with contract...");
          Alert.alert("M-Pesa Success", `Received KES ${amount} contribution.`);
        }, 2500);
      }
    } catch (error) {
      setStatus(error.message);
      Alert.alert("Payment Failed", error.message);
    }
  }

  return (
    <Screen>
      <AppHeader title="Contribute" left="<" onLeft={() => navigation.goBack()} />
      
      <View style={styles.contributionCard}>
        <View style={styles.groupHeader}>
          <View style={styles.roundIcon}><Text style={styles.roundIconText}>G</Text></View>
          <View style={styles.flex}>
            <Text style={styles.whiteTitle}>Eldoret Chama</Text>
            <Text style={styles.whiteMuted}>Monthly Contribution</Text>
            <Text style={styles.contributionAmount}>KES {amount || "0"}</Text>
          </View>
          <Text style={styles.chevron}>></Text>
        </View>
        <View style={styles.cardSplit}>
          <View>
            <Text style={styles.whiteMuted}>Due Date</Text>
            <Text style={styles.whiteSmall}>25 May 2024</Text>
          </View>
          <View>
            <Text style={styles.whiteMuted}>Status</Text>
            <Text style={styles.duePill}>Due</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Choose Payment Method</Text>
      
      <View style={styles.methodsContainer}>
        <PaymentMethod 
          label="Pay with M-Pesa" 
          icon="M" 
          selected={selectedMethod === "mpesa"} 
          onPress={() => setSelectedMethod("mpesa")}
        />
        <PaymentMethod 
          label="Pay with Crypto (Polygon)" 
          icon="P" 
          selected={selectedMethod === "crypto"} 
          onPress={() => setSelectedMethod("crypto")}
        />
      </View>
      
      <Text style={styles.sectionTitle}>Transaction Details</Text>
      
      {selectedMethod === "crypto" && (
        <View style={styles.recipientRow}>
          <View style={styles.flex}>
            <AuthInput 
              icon="A" 
              placeholder="Recipient Wallet / Vault Address" 
              value={recipientAddress} 
              onChangeText={setRecipientAddress} 
            />
          </View>
          <TouchableOpacity 
            style={styles.scanButton} 
            onPress={() => navigation.navigate("QRScanner", { returnTo: "Contribute" })}
          >
            <Text style={styles.scanButtonText}>⛶</Text>
          </TouchableOpacity>
        </View>
      )}

      <AuthInput 
        icon="K" 
        placeholder="Amount in KES" 
        value={amount} 
        onChangeText={setAmount} 
        keyboardType="numeric" 
      />
      
      <TouchableOpacity style={styles.primaryButton} onPress={submitContribution}>
        <Text style={styles.primaryButtonText}>
          {selectedMethod === "crypto" ? "Send On-Chain" : "Send STK Push"}
        </Text>
      </TouchableOpacity>
      
      {status ? <Text style={styles.statusText}>{status}</Text> : null}
      
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Contribution History</Text>
        <HistoryRow month="April Contribution" date="Apr 25, 2024" amount="KES 2,500" />
        <HistoryRow month="March Contribution" date="Mar 25, 2024" amount="KES 2,500" />
      </View>
      
      <BottomTabs active="Contribute" navigation={navigation} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  contributionCard: {
    backgroundColor: colors.green,
    borderRadius: 16,
    gap: 18,
    padding: 18,
    borderColor: "#4ade80",
    borderWidth: 1,
    shadowColor: colors.greenDark,
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 4,
  },
  groupHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  roundIcon: {
    alignItems: "center",
    backgroundColor: colors.greenLight,
    borderRadius: 999,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  roundIconText: {
    color: colors.greenDark,
    fontWeight: "900",
  },
  whiteTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
  whiteMuted: {
    color: "#eafff1",
    fontSize: 12,
  },
  contributionAmount: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 4,
  },
  chevron: {
    color: "#ffffff",
    fontSize: 24,
  },
  cardSplit: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  whiteSmall: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 4,
  },
  duePill: {
    backgroundColor: "#fb923c",
    borderRadius: 999,
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: "center",
    marginTop: 4,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900",
    marginTop: 4,
  },
  methodsContainer: {
    gap: 10,
  },
  recipientRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  scanButton: {
    backgroundColor: "rgba(22, 163, 74, 0.08)",
    borderColor: colors.green,
    borderWidth: 1.5,
    borderRadius: 8,
    height: 52,
    width: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  scanButtonText: {
    color: colors.green,
    fontSize: 20,
    fontWeight: "900",
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
    marginTop: 6,
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
  historySection: {
    gap: 10,
    marginTop: 4,
  },
});
