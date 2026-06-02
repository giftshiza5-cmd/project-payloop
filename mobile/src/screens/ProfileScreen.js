import React from "react";
import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { colors } from "../theme/colors";
import { usePayLoopApp } from "../context/PayLoopContext";
import { Screen } from "../components/Screen";
import { AppHeader } from "../components/AppHeader";
import { BottomTabs } from "../components/BottomTabs";

function shortAddress(address) {
  if (!address) {
    return "0x3a21...f48d";
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function ProfileScreen({ navigation }) {
  const { wallet, displayName } = usePayLoopApp();
  const displayAddress = wallet.walletAddress || "0x742A387B4C44a8C45A91bDc1D905187e145A8C45";

  const handleShare = async () => {
    try {
      await Share.share({
        message: `PayLoop Wallet Address: ${displayAddress}`,
      });
    } catch (error) {
      Alert.alert("Error sharing", error.message);
    }
  };

  const getInitials = (name) => {
    if (!name) return "PL";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return (parts[0].slice(0, 1) + parts[1].slice(0, 1)).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Screen>
      <AppHeader title="Profile" left="<" onLeft={() => navigation.goBack()} />
      
      {/* Profile Details */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
        </View>
        <View style={styles.flex}>
          <Text style={styles.cardTitle}>{displayName || "PayLoop Member"}</Text>
          <Text style={styles.mutedSmall}>{displayName.toLowerCase().replace(" ", "")}@email.com</Text>
          <Text style={styles.verified}>Verified</Text>
        </View>
      </View>
      
      {/* 3D Payment QR Card */}
      <View style={styles.qrCard}>
        <Text style={styles.qrTitle}>My Payment QR</Text>
        <Text style={styles.qrMuted}>Scan to pay me on Polygon or add me to your Chama</Text>
        
        <View style={styles.qrWrapper}>
          <QRCode 
            value={displayAddress} 
            size={140} 
            color={colors.ink}
            backgroundColor="#ffffff"
          />
        </View>
        
        <TouchableOpacity 
          style={styles.addressDisplayRow} 
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <View style={styles.flex}>
            <Text style={styles.addressLabel}>Wallet Address</Text>
            <Text style={styles.addressValue}>{shortAddress(displayAddress)}</Text>
          </View>
          <View style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Share</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Settings Menu */}
      <View style={styles.menuContainer}>
        {["Edit Profile", "Security", "Payment Methods", "Notification Settings", "Help & Support"].map((item) => (
          <TouchableOpacity key={item} style={styles.menuRow} activeOpacity={0.8}>
            <Text style={styles.menuText}>{item}</Text>
            <Text style={styles.chevronDark}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={() => {
          wallet.disconnect();
          navigation.replace("Overview");
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      
      <BottomTabs active="Profile" navigation={navigation} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  profileCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 16,
    padding: 16,
    shadowColor: "#0b1f16",
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.greenDark,
    borderRadius: 999,
    height: 62,
    justifyContent: "center",
    width: 62,
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900",
  },
  mutedSmall: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  verified: {
    alignSelf: "flex-start",
    backgroundColor: "#dcfce7",
    borderRadius: 999,
    color: colors.greenDark,
    fontSize: 11,
    fontWeight: "900",
    marginTop: 6,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  qrCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 12,
    shadowColor: "#0b1f16",
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  qrTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900",
  },
  qrMuted: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  qrWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#0b1f16",
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderColor: colors.border,
    borderWidth: 1.5,
  },
  addressDisplayRow: {
    alignItems: "center",
    backgroundColor: colors.cardSoft,
    borderColor: colors.greenLight,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    gap: 12,
    padding: 12,
    marginTop: 6,
    width: "100%",
  },
  addressLabel: {
    color: colors.greenDark,
    fontSize: 11,
    fontWeight: "800",
  },
  addressValue: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "900",
    marginTop: 2,
  },
  shareButton: {
    backgroundColor: colors.green,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  shareButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
  },
  menuContainer: {
    gap: 10,
  },
  menuRow: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 52,
    paddingHorizontal: 16,
    shadowColor: "#0b1f16",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  menuText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "800",
  },
  chevronDark: {
    color: colors.muted,
    fontSize: 20,
    fontWeight: "900",
  },
  logoutButton: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1.5,
    minHeight: 52,
    justifyContent: "center",
    marginBottom: 8,
  },
  logoutText: {
    color: colors.red,
    fontWeight: "900",
  },
});
