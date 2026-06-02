import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { listCircleMembers } from "../lib/firebase";
import { Screen } from "../components/Screen";
import { AppHeader } from "../components/AppHeader";

const baseMembers = [
  { id: "1", displayName: "Mary Wanjiku", walletAddress: "0x742A387B4C44a8C45A91bDc1D905187e145A8C45", contributionTotal: "KES 120,000" },
  { id: "2", displayName: "John Kamau", walletAddress: "0x91bDb905187e145A8C45742A387B4C44a8C450x9", contributionTotal: "KES 100,000" },
  { id: "3", displayName: "James Otieno", walletAddress: "0x3f421D905187e145A8C45742A387B4C44a8C450x", contributionTotal: "KES 90,000" },
];

function shortAddress(address) {
  if (!address) {
    return "0x3a21...f48d";
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function MembersScreen({ navigation }) {
  const [members, setMembers] = useState(baseMembers);

  useEffect(() => {
    async function loadMembers() {
      try {
        const firebaseMembers = await listCircleMembers();
        if (firebaseMembers.length > 0) {
          setMembers(
            firebaseMembers.map((member) => ({
              ...member,
              contributionTotal: member.contributionTotal || "On-chain total pending",
            })),
          );
        }
      } catch {
        setMembers(baseMembers);
      }
    }

    loadMembers();
  }, []);

  return (
    <Screen scroll={false}>
      <AppHeader title="Circle Members" left="<" onLeft={() => navigation.goBack()} />
      
      <FlatList
        contentContainerStyle={styles.screenContent}
        data={members}
        keyExtractor={(item) => item.id || item.walletAddress}
        renderItem={({ item }) => (
          <View style={styles.memberRow}>
            <View style={styles.roundIcon}>
              <Text style={styles.roundIconText}>{(item.displayName || "M").slice(0, 1).toUpperCase()}</Text>
            </View>
            <View style={styles.flex}>
              <Text style={styles.cardTitle}>{item.displayName || "PayLoop Member"}</Text>
              <Text style={styles.mutedSmall}>{shortAddress(item.walletAddress)}</Text>
            </View>
            <Text style={styles.boldValue}>{item.contributionTotal}</Text>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    gap: 12,
    padding: 18,
    paddingBottom: 40,
  },
  memberRow: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 14,
    shadowColor: "#0b1f16",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
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
  flex: {
    flex: 1,
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "900",
  },
  mutedSmall: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  boldValue: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "900",
  },
});
