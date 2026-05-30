import "react-native-get-random-values";
import "react-native-url-polyfill/auto";

import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MetaMaskSDK } from "@metamask/sdk";
import WalletConnectProvider from "@walletconnect/react-native-dapp";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import {
  circleVaultAbi,
  contractAddresses,
  creditScoreAbi,
  fromWei,
  getReadOnlyContract,
  getReadWriteContract,
  lendingPoolAbi,
  polygonChainId,
  polygonParams,
  toWei,
} from "./src/lib/contracts";
import { listCircleMembers, savePushToken, upsertPayLoopUser } from "./src/lib/firebase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();
const PayLoopContext = createContext(null);
const groupId = 0;

const baseMembers = [
  { id: "1", displayName: "Mary Wanjiku", walletAddress: "0x742A...8C45", contributionTotal: "KES 120,000" },
  { id: "2", displayName: "John Kamau", walletAddress: "0x91bD...7a2B", contributionTotal: "KES 100,000" },
  { id: "3", displayName: "James Otieno", walletAddress: "0x3f42...1D90", contributionTotal: "KES 90,000" },
];

function shortAddress(address) {
  if (!address) {
    return "Not connected";
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function usePayLoopApp() {
  const context = useContext(PayLoopContext);

  if (!context) {
    throw new Error("PayLoop context is missing");
  }

  return context;
}

function usePayLoopWallet() {
  const [walletAddress, setWalletAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [provider, setProvider] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const sdk = useMemo(
    () =>
      new MetaMaskSDK({
        dappMetadata: {
          name: "PayLoop",
          url: "https://payloop.local",
        },
        openDeeplink: (link) => Linking.openURL(link),
        useDeeplink: true,
      }),
    [],
  );

  async function connect(displayName) {
    setIsConnecting(true);

    try {
      const accounts = await sdk.connect();
      const nextProvider = sdk.getProvider();
      const address = accounts?.[0];
      const nextChainId = await nextProvider.request({ method: "eth_chainId" });

      if (!address) {
        throw new Error("MetaMask did not return a wallet address.");
      }

      setProvider(nextProvider);
      setWalletAddress(address);
      setChainId(nextChainId);

      await upsertPayLoopUser({
        walletAddress: address,
        displayName: displayName || "PayLoop Member",
      });

      return address;
    } finally {
      setIsConnecting(false);
    }
  }

  async function switchToPolygon() {
    if (!provider) {
      throw new Error("Connect MetaMask first.");
    }

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: polygonChainId }],
      });
    } catch (error) {
      if (error.code === 4902) {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [polygonParams],
        });
      } else {
        throw error;
      }
    }

    setChainId(polygonChainId);
  }

  function disconnect() {
    sdk.terminate();
    setProvider(null);
    setWalletAddress("");
    setChainId("");
  }

  return {
    chainId,
    connect,
    disconnect,
    isConnecting,
    isWrongNetwork: Boolean(walletAddress && chainId !== polygonChainId),
    provider,
    switchToPolygon,
    walletAddress,
  };
}

function Screen({ children, theme, scroll = true }) {
  const Wrapper = scroll ? ScrollView : View;

  return (
    <SafeAreaView style={[styles.screen, theme.screen]}>
      <Wrapper contentContainerStyle={scroll ? styles.screenContent : undefined} style={!scroll && styles.flex}>
        {children}
      </Wrapper>
    </SafeAreaView>
  );
}

function HeaderCard({ title, subtitle, theme, walletAddress, onToggleTheme, mode }) {
  return (
    <View style={[styles.headerCard, theme.panel]}>
      <View>
        <Text style={[styles.eyebrow, theme.muted]}>PayLoop Mobile</Text>
        <Text style={[styles.title, theme.text]}>{title}</Text>
        <Text style={[styles.copy, theme.muted]}>{subtitle}</Text>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity style={[styles.iconButton, theme.softPanel]} onPress={onToggleTheme}>
          <Text style={theme.text}>{mode === "dark" ? "Light" : "Dark"}</Text>
        </TouchableOpacity>
        <View style={[styles.walletPill, theme.softPanel]}>
          <Text style={[styles.walletPillText, theme.text]}>{shortAddress(walletAddress)}</Text>
        </View>
      </View>
    </View>
  );
}

function OnboardingScreen({ navigation }) {
  const { wallet, theme, displayName, setDisplayName, onToggleTheme, mode } = usePayLoopApp();
  const walletConnectUri = `payloop://walletconnect?member=${displayName || "member"}`;

  async function handleConnect() {
    try {
      const address = await wallet.connect(displayName);
      await registerForReminders(address);
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("MetaMask connection failed", error.message);
    }
  }

  return (
    <Screen theme={theme}>
      <HeaderCard
        title="Connect MetaMask"
        subtitle="Start with WalletConnect, then confirm account access in MetaMask Mobile."
        theme={theme}
        walletAddress={wallet.walletAddress}
        onToggleTheme={onToggleTheme}
        mode={mode}
      />

      <View style={[styles.qrPanel, theme.panel]}>
        <QRCode value={walletConnectUri} size={190} backgroundColor="transparent" color={mode === "dark" ? "#ffffff" : "#132036"} />
        <Text style={[styles.copy, theme.muted]}>Scan this PayLoop WalletConnect QR code or open MetaMask directly.</Text>
      </View>

      <Text style={[styles.label, theme.text]}>Display name</Text>
      <TextInput
        style={[styles.input, theme.input]}
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Jane Member"
        placeholderTextColor={theme.placeholder.color}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handleConnect}>
        <Text style={styles.primaryButtonText}>
          {wallet.isConnecting ? "Connecting..." : "Connect MetaMask Wallet"}
        </Text>
      </TouchableOpacity>
    </Screen>
  );
}

function HomeScreen({ navigation }) {
  const { wallet, theme, onToggleTheme, mode } = usePayLoopApp();
  const [vaultBalance, setVaultBalance] = useState("0.0");
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
        setVaultBalance("0.0");
      }
    }

    loadVault();
  }, [wallet.provider]);

  return (
    <Screen theme={theme}>
      <HeaderCard
        title="Group Dashboard"
        subtitle="Daily savings, lending, and member activity at a glance."
        theme={theme}
        walletAddress={wallet.walletAddress}
        onToggleTheme={onToggleTheme}
        mode={mode}
      />

      {wallet.isWrongNetwork ? <NetworkWarning wallet={wallet} theme={theme} /> : null}

      <View style={[styles.groupCard, theme.panel]}>
        <Text style={[styles.eyebrow, theme.muted]}>Active Group</Text>
        <Text style={[styles.groupName, theme.text]}>{groupName}</Text>
        <View style={styles.metricGrid}>
          <Metric label="Vault Balance" value={`${vaultBalance} MATIC`} theme={theme} />
          <Metric label="Next Due Date" value="Jun 30, 2026" theme={theme} />
        </View>
      </View>

      <View style={styles.actionGrid}>
        {[
          ["Contribute", "Contribute"],
          ["Request Loan", "LoanRequest"],
          ["Credit Score", "CreditScore"],
          ["Members", "Members"],
          ["Scan QR", "QRScanner"],
        ].map(([label, screen]) => (
          <TouchableOpacity
            key={screen}
            style={[styles.actionCard, theme.panel]}
            onPress={() => navigation.navigate(screen)}
          >
            <Text style={[styles.actionTitle, theme.text]}>{label}</Text>
            <Text style={[styles.copySmall, theme.muted]}>Open</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Screen>
  );
}

function ContributeScreen() {
  const { wallet, theme } = usePayLoopApp();
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  async function submitContribution() {
    try {
      if (!wallet.provider) {
        throw new Error("Connect MetaMask first.");
      }

      const vault = await getReadWriteContract(
        wallet.provider,
        contractAddresses.circleVault,
        circleVaultAbi,
        "CircleVault",
      );
      const tx = await vault.contribute(groupId, { value: toWei(amount) });
      setStatus("Waiting for MetaMask confirmation and block finality...");
      await tx.wait();
      setStatus("Contribution recorded on-chain.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <Screen theme={theme}>
      <FormCard title="Contribute" subtitle="Enter an amount in MATIC. MetaMask will open for signing." theme={theme}>
        <TextInput
          style={[styles.input, theme.input]}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0.05"
          placeholderTextColor={theme.placeholder.color}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={submitContribution}>
          <Text style={styles.primaryButtonText}>Send Contribution</Text>
        </TouchableOpacity>
        {status ? <Text style={[styles.statusText, theme.muted]}>{status}</Text> : null}
      </FormCard>
    </Screen>
  );
}

function LoanRequestScreen() {
  const { wallet, theme } = usePayLoopApp();
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [status, setStatus] = useState("No loan submitted in this session.");

  async function submitLoan() {
    try {
      if (!wallet.provider) {
        throw new Error("Connect MetaMask first.");
      }

      const pool = await getReadWriteContract(
        wallet.provider,
        contractAddresses.lendingPool,
        lendingPoolAbi,
        "LendingPool",
      );
      const tx = await pool.requestLoan(groupId, toWei(amount), purpose || "Member loan");
      setStatus("Loan request sent. Waiting for confirmation...");
      await tx.wait();
      setStatus("Loan request submitted. Voting status: Pending.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <Screen theme={theme}>
      <FormCard title="Loan Request" subtitle="Submit a loan request for on-chain member voting." theme={theme}>
        <TextInput
          style={[styles.input, theme.input]}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0.20"
          placeholderTextColor={theme.placeholder.color}
        />
        <TextInput
          style={[styles.input, theme.input]}
          value={purpose}
          onChangeText={setPurpose}
          placeholder="School fees"
          placeholderTextColor={theme.placeholder.color}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={submitLoan}>
          <Text style={styles.primaryButtonText}>Submit Loan Request</Text>
        </TouchableOpacity>
        <Text style={[styles.statusText, theme.muted]}>{status}</Text>
      </FormCard>
    </Screen>
  );
}

function CreditScoreScreen() {
  const { wallet, theme } = usePayLoopApp();
  const [score, setScore] = useState("500");
  const [profile, setProfile] = useState(null);

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
        setScore("500");
      }
    }

    loadScore();
  }, [wallet.provider, wallet.walletAddress]);

  return (
    <Screen theme={theme}>
      <View style={[styles.scoreCard, theme.panel]}>
        <Text style={[styles.eyebrow, theme.muted]}>CreditLoop Score</Text>
        <Text style={[styles.score, theme.text]}>{score}</Text>
        <Text style={[styles.copy, theme.muted]}>Read directly from CreditScore.sol for your wallet.</Text>
      </View>
      <View style={styles.metricGrid}>
        <Metric label="On-time Contributions" value={profile ? profile.onTimeContributions.toString() : "0"} theme={theme} />
        <Metric label="Loans Repaid" value={profile ? profile.loansRepaid.toString() : "0"} theme={theme} />
      </View>
    </Screen>
  );
}

function MembersScreen() {
  const { theme } = usePayLoopApp();
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
    <Screen theme={theme} scroll={false}>
      <FlatList
        contentContainerStyle={styles.screenContent}
        data={members}
        keyExtractor={(item) => item.id || item.walletAddress}
        ListHeaderComponent={<Text style={[styles.title, theme.text]}>Circle Members</Text>}
        renderItem={({ item }) => (
          <View style={[styles.memberRow, theme.panel]}>
            <View style={styles.memberAvatar}>
              <Text style={styles.memberAvatarText}>{(item.displayName || "M").slice(0, 1)}</Text>
            </View>
            <View style={styles.flex}>
              <Text style={[styles.memberName, theme.text]}>{item.displayName || "PayLoop Member"}</Text>
              <Text style={[styles.copySmall, theme.muted]}>{shortAddress(item.walletAddress)}</Text>
            </View>
            <Text style={[styles.memberTotal, theme.text]}>{item.contributionTotal}</Text>
          </View>
        )}
      />
    </Screen>
  );
}

function QRScannerScreen() {
  const { theme } = usePayLoopApp();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState("");

  if (!permission) {
    return <Screen theme={theme}><Text style={theme.text}>Checking camera permission...</Text></Screen>;
  }

  if (!permission.granted) {
    return (
      <Screen theme={theme}>
        <FormCard title="QR Payments" subtitle="Allow camera access to scan peer wallet addresses." theme={theme}>
          <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Allow Camera</Text>
          </TouchableOpacity>
        </FormCard>
      </Screen>
    );
  }

  return (
    <Screen theme={theme} scroll={false}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={({ data }) => setScanned(data)}
      />
      <View style={[styles.scannerResult, theme.panel]}>
        <Text style={[styles.label, theme.text]}>Scanned Wallet</Text>
        <Text style={[styles.copy, theme.muted]}>{scanned || "Point camera at a wallet payment QR code."}</Text>
      </View>
    </Screen>
  );
}

function Metric({ label, value, theme }) {
  return (
    <View style={[styles.metricCard, theme.panel]}>
      <Text style={[styles.copySmall, theme.muted]}>{label}</Text>
      <Text style={[styles.metricValue, theme.text]}>{value}</Text>
    </View>
  );
}

function FormCard({ title, subtitle, children, theme }) {
  return (
    <View style={[styles.formCard, theme.panel]}>
      <Text style={[styles.title, theme.text]}>{title}</Text>
      <Text style={[styles.copy, theme.muted]}>{subtitle}</Text>
      {children}
    </View>
  );
}

function NetworkWarning({ wallet, theme }) {
  async function switchNetwork() {
    try {
      await wallet.switchToPolygon();
    } catch (error) {
      Alert.alert("Network switch failed", error.message);
    }
  }

  return (
    <View style={[styles.warning, theme.warning]}>
      <Text style={styles.warningText}>You are not connected to Polygon.</Text>
      <TouchableOpacity style={styles.secondaryButton} onPress={switchNetwork}>
        <Text style={[styles.secondaryButtonText, theme.text]}>Switch to Polygon</Text>
      </TouchableOpacity>
    </View>
  );
}

async function registerForReminders(walletAddress) {
  const permission = await Notifications.requestPermissionsAsync();

  if (!permission.granted) {
    return;
  }

  const token = await Notifications.getExpoPushTokenAsync();
  await savePushToken({ walletAddress, token: token.data });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "PayLoop contribution reminder",
      body: "Your next group contribution is due soon.",
    },
    trigger: {
      seconds: 10,
    },
  });
}

export default function App() {
  const wallet = usePayLoopWallet();
  const [displayName, setDisplayName] = useState("John Kamau");
  const [mode, setMode] = useState("dark");
  const theme = useMemo(() => makeTheme(mode), [mode]);

  const screenParams = {
    displayName,
    mode,
    onToggleTheme: () => setMode((current) => (current === "dark" ? "light" : "dark")),
    setDisplayName,
    theme,
    wallet,
  };

  return (
    <WalletConnectProvider redirectUrl={Linking.createURL("/")} storageOptions={{ asyncStorage: null }}>
      <PayLoopContext.Provider value={screenParams}>
        <NavigationContainer theme={mode === "dark" ? DarkTheme : DefaultTheme}>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: theme.screen.backgroundColor },
              headerTintColor: theme.text.color,
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Contribute" component={ContributeScreen} />
            <Stack.Screen name="LoanRequest" component={LoanRequestScreen} options={{ title: "Loan Request" }} />
            <Stack.Screen name="CreditScore" component={CreditScoreScreen} options={{ title: "Credit Score" }} />
            <Stack.Screen name="Members" component={MembersScreen} />
            <Stack.Screen name="QRScanner" component={QRScannerScreen} options={{ title: "Scan QR" }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PayLoopContext.Provider>
    </WalletConnectProvider>
  );
}

function makeTheme(mode) {
  const dark = mode === "dark";

  return StyleSheet.create({
    screen: {
      backgroundColor: dark ? "#050913" : "#f4f7fb",
    },
    panel: {
      backgroundColor: dark ? "#0b1422" : "#ffffff",
      borderColor: dark ? "#1d2b42" : "#d9e1ee",
    },
    softPanel: {
      backgroundColor: dark ? "#101b2c" : "#eef3f8",
      borderColor: dark ? "#1d2b42" : "#d9e1ee",
    },
    text: {
      color: dark ? "#edf4ff" : "#132036",
    },
    muted: {
      color: dark ? "#8d9ab0" : "#617089",
    },
    input: {
      backgroundColor: dark ? "#101b2c" : "#ffffff",
      borderColor: dark ? "#1d2b42" : "#cdd7e6",
      color: dark ? "#edf4ff" : "#132036",
    },
    placeholder: {
      color: dark ? "#65748c" : "#8b97aa",
    },
    warning: {
      backgroundColor: dark ? "#2c2109" : "#fff6df",
      borderColor: "#f0b64f",
    },
  });
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  screenContent: {
    gap: 16,
    padding: 18,
  },
  headerCard: {
    borderRadius: 8,
    borderWidth: 1,
    gap: 16,
    padding: 18,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 7,
    borderWidth: 1,
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  walletPill: {
    borderRadius: 7,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 12,
  },
  walletPillText: {
    fontWeight: "700",
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    marginBottom: 6,
  },
  copy: {
    fontSize: 15,
    lineHeight: 22,
  },
  copySmall: {
    fontSize: 12,
    lineHeight: 18,
  },
  qrPanel: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    gap: 16,
    padding: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: "800",
  },
  input: {
    borderRadius: 7,
    borderWidth: 1,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#7c3aed",
    borderRadius: 7,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "800",
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#c5ccda",
    borderRadius: 7,
    borderWidth: 1,
    marginTop: 12,
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  secondaryButtonText: {
    fontWeight: "800",
  },
  groupCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 18,
  },
  groupName: {
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 14,
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    borderRadius: 8,
    borderWidth: 1,
    flexGrow: 1,
    minWidth: 140,
    padding: 14,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 5,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionCard: {
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 90,
    padding: 16,
    width: "47%",
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 8,
  },
  formCard: {
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 18,
  },
  statusText: {
    fontSize: 14,
    lineHeight: 21,
  },
  scoreCard: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    padding: 28,
  },
  score: {
    fontSize: 76,
    fontWeight: "900",
  },
  memberRow: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
    padding: 14,
  },
  memberAvatar: {
    alignItems: "center",
    backgroundColor: "#7c3aed",
    borderRadius: 999,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  memberAvatarText: {
    color: "#ffffff",
    fontWeight: "900",
  },
  memberName: {
    fontSize: 15,
    fontWeight: "800",
  },
  memberTotal: {
    fontSize: 13,
    fontWeight: "800",
  },
  camera: {
    flex: 1,
  },
  scannerResult: {
    borderRadius: 8,
    borderWidth: 1,
    bottom: 18,
    left: 18,
    padding: 16,
    position: "absolute",
    right: 18,
  },
  warning: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  warningText: {
    color: "#f0b64f",
    fontWeight: "800",
  },
});
