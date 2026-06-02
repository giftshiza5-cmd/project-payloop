import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Linking from "expo-linking";
import { colors } from "../theme/colors";
import { Screen } from "../components/Screen";
import { AppHeader } from "../components/AppHeader";

export function QRScannerScreen({ route, navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState("");

  const returnTo = route.params?.returnTo || "Dashboard";

  if (!permission) {
    return (
      <Screen>
        <AppHeader title="QR Scanner" onLeft={() => navigation.goBack()} />
        <View style={styles.centerContainer}>
          <Text style={styles.cardTitle}>Checking camera permission...</Text>
        </View>
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <AppHeader title="QR Scanner" onLeft={() => navigation.goBack()} />
        <View style={styles.permissionCard}>
          <Text style={styles.cardTitle}>Camera Permission Required</Text>
          <Text style={styles.mutedCopy}>Allow camera access to scan wallet addresses and payment QR codes.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Allow Camera</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  const isAddress = scanned.startsWith("0x") && scanned.length === 42;
  const isUrl = scanned.startsWith("http://") || scanned.startsWith("https://");

  const handleOpenAction = async () => {
    if (isAddress) {
      // Navigate to Contribute screen and prefill the wallet address
      navigation.navigate("Contribute", { scannedAddress: scanned });
    } else if (isUrl) {
      try {
        const supported = await Linking.canOpenURL(scanned);
        if (supported) {
          await Linking.openURL(scanned);
        } else {
          Alert.alert("Error", `Cannot open URL: ${scanned}`);
        }
      } catch (error) {
        Alert.alert("Error opening link", error.message);
      }
    } else {
      // Generic content copy alert
      Alert.alert("Scanned Code Content", scanned);
    }
  };

  return (
    <Screen scroll={false}>
      <AppHeader title="Scan QR Code" onLeft={() => navigation.goBack()} />
      
      <View style={styles.scannerWrapper}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={scanned ? undefined : ({ data }) => setScanned(data)}
        />
        
        {/* Visual Target Frame */}
        <View style={styles.overlayContainer}>
          <View style={styles.scanTargetFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>
      </View>
      
      {/* Slide up Result Modal */}
      {scanned ? (
        <View style={styles.resultModal}>
          <Text style={styles.resultTitle}>
            {isAddress ? "Polygon Wallet Address" : isUrl ? "Web Link Detected" : "QR Code Detected"}
          </Text>
          
          <Text style={styles.resultValue} numberOfLines={2}>
            {scanned}
          </Text>
          
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity 
              style={[styles.primaryButton, styles.modalButton]} 
              onPress={handleOpenAction}
            >
              <Text style={styles.primaryButtonText}>
                {isAddress ? "Pay Address" : isUrl ? "Open Link" : "View Text"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.secondaryButton, styles.modalButton]} 
              onPress={() => setScanned("")}
            >
              <Text style={styles.secondaryButtonText}>Scan Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.instructionBanner}>
          <Text style={styles.instructionText}>
            Align QR code inside the frame to scan
          </Text>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 20,
  },
  permissionCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 14,
    marginTop: 40,
    alignItems: "center",
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900",
  },
  mutedCopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  scannerWrapper: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: "#000000",
    position: "relative",
    marginBottom: 10,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  scanTargetFrame: {
    width: 200,
    height: 200,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 24,
    height: 24,
    borderColor: colors.green,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  resultModal: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 18,
    gap: 12,
    shadowColor: "#0b1f16",
    shadowOffset: { height: -8, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  resultTitle: {
    color: colors.greenDark,
    fontSize: 14,
    fontWeight: "900",
  },
  resultValue: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "800",
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    marginTop: 0,
  },
  instructionBanner: {
    backgroundColor: "rgba(11, 31, 22, 0.8)",
    padding: 12,
    borderRadius: 20,
    alignSelf: "center",
    bottom: 30,
    position: "absolute",
    zIndex: 5,
  },
  instructionText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.green,
    borderRadius: 12,
    minHeight: 50,
    justifyContent: "center",
    shadowColor: colors.greenDark,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1.5,
    minHeight: 50,
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: colors.green,
    fontWeight: "900",
  },
});
