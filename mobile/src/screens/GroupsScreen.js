import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { Screen } from "../components/Screen";
import { AppHeader } from "../components/AppHeader";
import { GroupCard } from "../components/GroupCard";
import { BottomTabs } from "../components/BottomTabs";

const localGroups = [
  { id: "eldoret", name: "Eldoret Chama", members: "20 Members", balance: "KES 125,000", contribution: "KES 5,000" },
  { id: "uasin", name: "Uasin Gishu Table", members: "15 Members", balance: "KES 75,000", contribution: "KES 3,000" },
  { id: "family", name: "Family Savings", members: "8 Members", balance: "KES 40,000", contribution: "KES 2,500" },
];

export function GroupsScreen({ navigation }) {
  return (
    <Screen>
      <AppHeader title="My Groups" right="+" onLeft={() => navigation.goBack()} />
      
      <View style={styles.segment}>
        <Text style={styles.segmentActive}>My Groups</Text>
        <Text style={styles.segmentItem}>Discover</Text>
      </View>
      
      {localGroups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
      
      <BottomTabs active="Groups" navigation={navigation} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  segment: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    padding: 4,
    marginVertical: 4,
  },
  segmentActive: {
    backgroundColor: colors.cardSoft,
    borderColor: colors.greenLight,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.green,
    flex: 1,
    fontSize: 12,
    fontWeight: "900",
    paddingVertical: 10,
    textAlign: "center",
    overflow: "hidden",
  },
  segmentItem: {
    color: colors.ink,
    flex: 1,
    fontSize: 12,
    fontWeight: "800",
    paddingVertical: 10,
    textAlign: "center",
  },
});
