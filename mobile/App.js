import "react-native-get-random-values";
import "react-native-url-polyfill/auto";

import React, { useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { PayLoopContext } from "./src/context/PayLoopContext";
import { usePayLoopWallet } from "./src/hooks/usePayLoopWallet";
import { colors } from "./src/theme/colors";

// Screen imports
import { OverviewScreen } from "./src/screens/OverviewScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { GroupsScreen } from "./src/screens/GroupsScreen";
import { ContributeScreen } from "./src/screens/ContributeScreen";
import { LoanRequestScreen } from "./src/screens/LoanRequestScreen";
import { CreditScoreScreen } from "./src/screens/CreditScoreScreen";
import { TransactionsScreen } from "./src/screens/TransactionsScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { MembersScreen } from "./src/screens/MembersScreen";
import { QRScannerScreen } from "./src/screens/QRScannerScreen";

const Stack = createNativeStackNavigator();
const PayLoopContext = createContext(null);
const groupId = 0;

const colors = {
  background: "#f5fbf7",
  card: "#ffffff",
  cardSoft: "#edf8f1",
  green: "#16a34a",
  greenDark: "#047857",
  greenLight: "#bbf7d0",
  ink: "#0b1f16",
  muted: "#65756c",
  border: "#d8eadf",
  warning: "#fb923c",
  red: "#ef4444",
  blue: "#2563eb",
};

const groups = [
  { id: "eldoret", name: "Eldoret Chama", members: "20 Members", balance: "KES 125,000", contribution: "KES 5,000" },
  { id: "uasin", name: "Uasin Gishu Table", members: "15 Members", balance: "KES 75,000", contribution: "KES 3,000" },
  { id: "family", name: "Family Savings", members: "8 Members", balance: "KES 40,000", contribution: "KES 2,500" },
];

const transactions = [
  { id: "1", type: "Contribution", group: "Eldoret Chama", amount: "+KES 2,500", date: "May 12, 2024", icon: "+", tone: colors.green },
  { id: "2", type: "Loan Disbursed", group: "School fees", amount: "+KES 20,000", date: "May 10, 2024", icon: "L", tone: "#8b5cf6" },
  { id: "3", type: "Loan Repayment", group: "School fees", amount: "-KES 5,000", date: "May 02, 2024", icon: "-", tone: "#f97316" },
  { id: "4", type: "Rewards", group: "LoopPoints", amount: "+50 LP", date: "Apr 20, 2024", icon: "*", tone: "#8b5cf6" },
];

const baseMembers = [
  { id: "1", displayName: "Mary Wanjiku", walletAddress: "0x742A...8C45", contributionTotal: "KES 120,000" },
  { id: "2", displayName: "John Kamau", walletAddress: "0x91bD...7a2B", contributionTotal: "KES 100,000" },
  { id: "3", displayName: "James Otieno", walletAddress: "0x3f42...1D90", contributionTotal: "KES 90,000" },
];

function shortAddress(address) {
  if (!address) {
    return "0x3a21...f48d";
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

function Screen({ children, scroll = true }) {
  const Wrapper = scroll ? ScrollView : View;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <ParallaxBackdrop />
      <Wrapper
        contentContainerStyle={scroll ? styles.screenContent : undefined}
        showsVerticalScrollIndicator={false}
        style={!scroll && styles.flex}
      >
        {children}
      </Wrapper>
    </SafeAreaView>
  );
}

function ParallaxBackdrop() {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 5200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 5200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [drift]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          styles.backdropWash,
          {
            transform: [
              { translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [-18, 18] }) },
              { translateX: drift.interpolate({ inputRange: [0, 1], outputRange: [-10, 10] }) },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.backdropPlane,
          {
            transform: [
              { perspective: 700 },
              { rotateZ: drift.interpolate({ inputRange: [0, 1], outputRange: ["-7deg", "4deg"] }) },
              { translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [12, -14] }) },
            ],
          },
        ]}
      />
    </View>
  );
}

function AppHeader({ title, left = "<", right, onLeft, onRight }) {
  return (
    <View style={styles.appHeader}>
      <TouchableOpacity style={styles.headerIcon} onPress={onLeft}>
        <Text style={styles.headerIconText}>{left}</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity style={styles.headerIcon} onPress={onRight}>
        <Text style={styles.headerIconText}>{right || ""}</Text>
      </TouchableOpacity>
    </View>
  );
}

function Logo3D({ size = 76 }) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 6200,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    ).start();
  }, [spin]);

  return (
    <Animated.View
      style={[
        styles.logo3D,
        {
          height: size,
          width: size,
          transform: [
            { perspective: 700 },
            { rotateY: spin.interpolate({ inputRange: [0, 0.5, 1], outputRange: ["-16deg", "18deg", "-16deg"] }) },
            { rotateX: spin.interpolate({ inputRange: [0, 0.5, 1], outputRange: ["10deg", "-8deg", "10deg"] }) },
          ],
        },
      ]}
    >
      <View style={styles.logoInset}>
        <Text style={[styles.logoMark, { fontSize: size * 0.42 }]}>P</Text>
      </View>
    </Animated.View>
  );
}

function IntroPeople() {
  return (
    <View style={styles.peopleScene}>
      <View style={[styles.person, styles.personOne]}>
        <View style={[styles.head, { backgroundColor: "#8b4b2e" }]} />
        <View style={[styles.body, { backgroundColor: colors.greenDark }]} />
      </View>
      <View style={[styles.person, styles.personTwo]}>
        <View style={[styles.head, { backgroundColor: "#5b3527" }]} />
        <View style={[styles.body, { backgroundColor: "#f7b84b" }]} />
      </View>
      <View style={[styles.person, styles.personThree]}>
        <View style={[styles.head, { backgroundColor: "#6b3c27" }]} />
        <View style={[styles.body, { backgroundColor: "#1f8a52" }]} />
      </View>
      <View style={[styles.person, styles.personFour]}>
        <View style={[styles.head, { backgroundColor: "#3d241b" }]} />
        <View style={[styles.body, { backgroundColor: "#f5cf65" }]} />
      </View>
      <View style={styles.phoneMini}>
        <Text style={styles.phoneMiniText}>KES</Text>
      </View>
    </View>
  );
}

function OverviewScreen({ navigation }) {
  return (
    <Screen>
      <View style={styles.centerHero}>
        <Logo3D />
        <Text style={styles.brandTitle}>PayLoop</Text>
        <Text style={styles.heroCopy}>Decentralized group savings for smarter communities.</Text>
      </View>
      <IntroPeople />
      <View style={styles.buttonStack}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.secondaryButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.smallCenterText}>New here? <Text style={styles.greenText}>Register</Text></Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

function RegisterScreen({ navigation }) {
  const { wallet, displayName, setDisplayName } = usePayLoopApp();
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleRegister() {
    try {
      const address = await wallet.connect(displayName);
      await upsertPayLoopUser({
        walletAddress: address,
        displayName: `${displayName} ${lastName}`.trim(),
        email,
        phoneNumber,
        role: "Member",
      });
      await registerForReminders(address);
      navigation.replace("Dashboard");
    } catch (error) {
      Alert.alert("Registration failed", error.message);
    }
  }

  return (
    <Screen>
      <AppHeader title="Register" onLeft={() => navigation.goBack()} />
      <AuthInput icon="U" placeholder="First Name" value={displayName} onChangeText={setDisplayName} />
      <AuthInput icon="U" placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <AuthInput icon="T" placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
      <AuthInput icon="@" placeholder="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <AuthInput icon="#" placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <AuthInput icon="#" placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
      <View style={styles.termsRow}>
        <View style={styles.checkbox}><Text style={styles.checkboxText}>v</Text></View>
        <Text style={styles.termsText}>I agree to the <Text style={styles.greenText}>Terms & Conditions</Text> and <Text style={styles.greenText}>Privacy Policy</Text></Text>
      </View>
      <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
        <Text style={styles.primaryButtonText}>{wallet.isConnecting ? "Connecting..." : "Register"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.smallCenterText}>Already have an account? <Text style={styles.greenText}>Login</Text></Text>
      </TouchableOpacity>
    </Screen>
  );
}

function LoginScreen({ navigation }) {
  const { wallet, displayName, setDisplayName } = usePayLoopApp();
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const address = await wallet.connect(displayName);
      await registerForReminders(address);
      navigation.replace("Dashboard");
    } catch (error) {
      Alert.alert("Login failed", error.message);
    }
  }

  return (
    <Screen>
      <AppHeader title="Login" onLeft={() => navigation.goBack()} />
      <View style={styles.loginHero}>
        <Logo3D size={70} />
        <Text style={styles.loginTitle}>Welcome Back!</Text>
        <Text style={styles.loginCopy}>Login to continue to PayLoop</Text>
      </View>
      <AuthInput icon="@" placeholder="Email Address" value={displayName} onChangeText={setDisplayName} />
      <AuthInput icon="#" placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.forgotButton}>
        <Text style={styles.greenLink}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
        <Text style={styles.primaryButtonText}>{wallet.isConnecting ? "Connecting..." : "Login"}</Text>
      </TouchableOpacity>
      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.divider} />
      </View>
      <TouchableOpacity style={styles.walletButton} onPress={handleLogin}>
        <Text style={styles.walletButtonText}>Login with MetaMask</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.smallCenterText}>Don't have an account? <Text style={styles.greenText}>Register</Text></Text>
      </TouchableOpacity>
    </Screen>
  );
}

function DashboardScreen({ navigation }) {
  const { wallet } = usePayLoopApp();
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
        <TouchableOpacity style={styles.headerIcon}><Text style={styles.headerIconText}>=</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity style={styles.headerIcon}><Text style={styles.headerIconText}>!</Text></TouchableOpacity>
      </View>
      <Text style={styles.greeting}>Hello, John</Text>
      <Text style={styles.mutedSmall}>Welcome back to PayLoop</Text>
      {wallet.isWrongNetwork ? <NetworkWarning wallet={wallet} /> : null}
      <SavingsCard balance={`KES ${vaultBalance}`} />
      <View style={styles.statsGrid}>
        <StatCard icon="G" label="My Groups" value="3" status="Active" tone={colors.green} />
        <StatCard icon="L" label="Pending Loans" value="1" status="Request" tone={colors.warning} />
        <StatCard icon="C" label="Credit Score" value="720" status="Excellent" tone={colors.blue} />
        <StatCard icon="K" label="Total Contributions" value="KES 8,500" status="This Month" tone={colors.greenDark} />
      </View>
      <SectionHeader title="Recent Transactions" action="View All" onPress={() => navigation.navigate("Transactions")} />
      <TransactionRow item={transactions[0]} />
      <BottomTabs active="Home" navigation={navigation} />
    </Screen>
  );
}

function SavingsCard({ balance }) {
  const lift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(lift, { toValue: 1, duration: 3500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(lift, { toValue: 0, duration: 3500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    ).start();
  }, [lift]);

  return (
    <Animated.View
      style={[
        styles.savingsCard,
        {
          transform: [
            { perspective: 900 },
            { rotateX: lift.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "5deg"] }) },
            { translateY: lift.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) },
          ],
        },
      ]}
    >
      <View>
        <Text style={styles.savingsLabel}>Total Savings</Text>
        <Text style={styles.savingsAmount}>{balance}</Text>
        <Text style={styles.savingsTrend}>+12.5% from last month</Text>
      </View>
      <View style={styles.wallet3D}>
        <View style={styles.walletFlap} />
        <View style={styles.walletPocket} />
        <View style={styles.walletButtonDot} />
      </View>
    </Animated.View>
  );
}

function GroupsScreen({ navigation }) {
  return (
    <Screen>
      <AppHeader title="My Groups" right="+" onLeft={() => navigation.goBack()} />
      <View style={styles.segment}>
        <Text style={styles.segmentActive}>My Groups</Text>
        <Text style={styles.segmentItem}>Discover</Text>
      </View>
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
      <BottomTabs active="Groups" navigation={navigation} />
    </Screen>
  );
}

function GroupCard({ group }) {
  return (
    <View style={styles.groupCard}>
      <View style={styles.groupHeader}>
        <View style={styles.roundIcon}><Text style={styles.roundIconText}>G</Text></View>
        <View style={styles.flex}>
          <Text style={styles.cardTitle}>{group.name}</Text>
          <Text style={styles.mutedSmall}>{group.members}</Text>
        </View>
        <View style={styles.activePill}><Text style={styles.activePillText}>Active</Text></View>
      </View>
      <View style={styles.cardSplit}>
        <View>
          <Text style={styles.mutedSmall}>Total Balance</Text>
          <Text style={styles.boldValue}>{group.balance}</Text>
        </View>
        <View>
          <Text style={styles.mutedSmall}>My Contribution</Text>
          <Text style={styles.boldValue}>{group.contribution}</Text>
        </View>
      </View>
    </View>
  );
}

function ContributeScreen() {
  const { wallet } = usePayLoopApp();
  const [amount, setAmount] = useState("2500");
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
    <Screen>
      <AppHeader title="Contribute" />
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
      <PaymentMethod label="Pay with M-Pesa" icon="M" />
      <PaymentMethod label="Pay with Crypto (Polygon)" icon="P" />
      <AuthInput icon="K" placeholder="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <TouchableOpacity style={styles.primaryButton} onPress={submitContribution}>
        <Text style={styles.primaryButtonText}>Send Contribution</Text>
      </TouchableOpacity>
      {status ? <Text style={styles.statusText}>{status}</Text> : null}
      <SectionHeader title="Contribution History" />
      <HistoryRow month="April Contribution" date="Apr 25, 2024" amount="KES 2,500" />
      <HistoryRow month="March Contribution" date="Mar 25, 2024" amount="KES 2,500" />
    </Screen>
  );
}

function LoanRequestScreen() {
  const { wallet } = usePayLoopApp();
  const [amount, setAmount] = useState("20,000");
  const [purpose, setPurpose] = useState("School fees");
  const [status, setStatus] = useState("");

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
      const tx = await pool.requestLoan(groupId, toWei(amount.replace(/,/g, "")), purpose || "Member loan");
      setStatus("Loan request sent. Waiting for confirmation...");
      await tx.wait();
      setStatus("Loan request submitted. Voting status: Pending.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <Screen>
      <AppHeader title="Loan Request" />
      <Text style={styles.formLabel}>Select Group</Text>
      <SelectBox value="Eldoret Chama" />
      <Text style={styles.formLabel}>Loan Amount (KES)</Text>
      <AuthInput placeholder="20,000" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <Text style={styles.formLabel}>Purpose</Text>
      <AuthInput placeholder="School fees" value={purpose} onChangeText={setPurpose} />
      <Text style={styles.formLabel}>Repayment Period</Text>
      <SelectBox value="3 Months" />
      <Text style={styles.repayCopy}>You will repay KES 21,600 including 8% service fee.</Text>
      <TouchableOpacity style={styles.primaryButton} onPress={submitLoan}>
        <Text style={styles.primaryButtonText}>Submit Request</Text>
      </TouchableOpacity>
      {status ? <Text style={styles.statusText}>{status}</Text> : null}
    </Screen>
  );
}

function CreditScoreScreen() {
  const { wallet } = usePayLoopApp();
  const [score, setScore] = useState("720");
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
        setScore("720");
      }
    }

    loadScore();
  }, [wallet.provider, wallet.walletAddress]);

  return (
    <Screen>
      <AppHeader title="Credit Score" right="i" />
      <View style={styles.scoreDial}>
        <View style={styles.arcBack} />
        <View style={[styles.arcSegment, styles.arcWarm]} />
        <View style={[styles.arcSegment, styles.arcGreen]} />
        <Text style={styles.scoreNumber}>{score}</Text>
        <Text style={styles.scoreLabel}>Excellent</Text>
        <Text style={styles.scoreGain}>+40 points this month</Text>
      </View>
      <View style={styles.scoreBreakdown}>
        <ScoreLine label="On-time Contributions" value={profile ? `+${profile.onTimeContributions}` : "+350"} />
        <ScoreLine label="Loan Repayments" value={profile ? `+${profile.loansRepaid}` : "+250"} />
        <ScoreLine label="Account Age" value="+120" />
        <View style={styles.totalScoreRow}>
          <Text style={styles.cardTitle}>Total Score</Text>
          <Text style={styles.boldValue}>{score} / 1000</Text>
        </View>
      </View>
      <View style={styles.tipCard}>
        <Text style={styles.tipIcon}>*</Text>
        <View style={styles.flex}>
          <Text style={styles.cardTitle}>Improve your score</Text>
          <Text style={styles.mutedSmall}>Keep making on-time contributions and repay loans early.</Text>
        </View>
      </View>
    </Screen>
  );
}

function TransactionsScreen({ navigation }) {
  return (
    <Screen>
      <AppHeader title="Transactions" onLeft={() => navigation.goBack()} />
      <View style={styles.filterRow}>
        {["All", "Contributions", "Loans", "Rewards"].map((item, index) => (
          <Text key={item} style={index === 0 ? styles.filterActive : styles.filterItem}>{item}</Text>
        ))}
      </View>
      {transactions.map((transaction) => (
        <TransactionRow key={transaction.id} item={transaction} />
      ))}
    </Screen>
  );
}

function ProfileScreen({ navigation }) {
  const { wallet } = usePayLoopApp();

  return (
    <Screen>
      <AppHeader title="Profile" onLeft={() => navigation.goBack()} />
      <View style={styles.profileCard}>
        <View style={styles.avatar}><Text style={styles.avatarText}>JK</Text></View>
        <View style={styles.flex}>
          <Text style={styles.cardTitle}>John Kamau</Text>
          <Text style={styles.mutedSmall}>johnkamau@email.com</Text>
          <Text style={styles.verified}>Verified</Text>
        </View>
        <Text style={styles.chevronDark}>></Text>
      </View>
      <View style={styles.profileCard}>
        <View style={styles.flex}>
          <Text style={styles.mutedSmall}>Wallet Address</Text>
          <Text style={styles.boldValue}>{shortAddress(wallet.walletAddress)}</Text>
        </View>
        <Text style={styles.chevronDark}>[]</Text>
      </View>
      {["Edit Profile", "Security", "Payment Methods", "Notification Settings", "Help & Support"].map((item) => (
        <TouchableOpacity key={item} style={styles.menuRow}>
          <Text style={styles.menuText}>{item}</Text>
          <Text style={styles.chevronDark}>></Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.logoutButton} onPress={wallet.disconnect}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <BottomTabs active="Profile" navigation={navigation} />
    </Screen>
  );
}

function MembersScreen() {
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
      <FlatList
        contentContainerStyle={styles.screenContent}
        data={members}
        keyExtractor={(item) => item.id || item.walletAddress}
        ListHeaderComponent={<Text style={styles.headerTitle}>Circle Members</Text>}
        renderItem={({ item }) => (
          <View style={styles.memberRow}>
            <View style={styles.roundIcon}>
              <Text style={styles.roundIconText}>{(item.displayName || "M").slice(0, 1)}</Text>
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

async function openScannedValue(value) {
  if (!value) {
    return;
  }

  const trimmed = value.trim();
  const ethereumAddress = /^0x[0-9a-fA-F]{40}$/.test(trimmed);
  const isUrl = /^(https?:\/\/|payloop:\/\/|ethereum:|wc:|mailto:|sms:)/i.test(trimmed);

  if (isUrl && (await Linking.canOpenURL(trimmed))) {
    await Linking.openURL(trimmed);
    return;
  }

  if (ethereumAddress) {
    const ethUrl = `ethereum:${trimmed}`;
    if (await Linking.canOpenURL(ethUrl)) {
      await Linking.openURL(ethUrl);
      return;
    }

    const metaMaskUrl = `https://metamask.app.link/send/${trimmed}`;
    if (await Linking.canOpenURL(metaMaskUrl)) {
      await Linking.openURL(metaMaskUrl);
      return;
    }
  }

  Alert.alert(
    "Cannot open QR code",
    "The scanned QR code does not contain a link or a supported wallet address.",
  );
}

function shouldOpenScan(value) {
  if (!value) {
    return false;
  }

  return /^(https?:\/\/|payloop:\/\/|ethereum:|wc:|mailto:|sms:)/i.test(value.trim()) || /^0x[0-9a-fA-F]{40}$/.test(value.trim());
}

function QRScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState("");

  if (!permission) {
    return <Screen><Text style={styles.cardTitle}>Checking camera permission...</Text></Screen>;
  }

  if (!permission.granted) {
    return (
      <Screen>
        <View style={styles.groupCard}>
          <Text style={styles.cardTitle}>QR Payments</Text>
          <Text style={styles.mutedCopy}>Allow camera access to scan peer wallet addresses.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Allow Camera</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={async ({ data }) => {
          setScanned(data);
          if (shouldOpenScan(data)) {
            await openScannedValue(data);
          }
        }}
      />
      <View style={styles.scannerResult}>
        <Text style={styles.cardTitle}>Scanned Wallet</Text>
        <Text style={styles.mutedCopy}>{scanned || "Point camera at a wallet payment QR code."}</Text>
        {scanned && shouldOpenScan(scanned) ? (
          <TouchableOpacity
            style={[styles.primaryButton, { marginTop: 12 }]}
            onPress={() => openScannedValue(scanned)}
          >
            <Text style={styles.primaryButtonText}>Open scanned link</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </Screen>
  );
}

function AuthInput({ icon, ...inputProps }) {
  return (
    <View style={styles.inputShell}>
      {icon ? <Text style={styles.inputIcon}>{icon}</Text> : null}
      <TextInput
        style={styles.input}
        placeholderTextColor="#84968b"
        autoCapitalize="none"
        {...inputProps}
      />
    </View>
  );
}

function SelectBox({ value }) {
  return (
    <View style={styles.selectBox}>
      <Text style={styles.selectText}>{value}</Text>
      <Text style={styles.chevronDark}>v</Text>
    </View>
  );
}

function StatCard({ icon, label, value, status, tone }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${tone}18` }]}>
        <Text style={[styles.statIconText, { color: tone }]}>{icon}</Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={[styles.statStatus, { color: tone }]}>{status}</Text>
    </View>
  );
}

function SectionHeader({ title, action, onPress }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.greenLink}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function TransactionRow({ item }) {
  return (
    <View style={styles.transactionRow}>
      <View style={[styles.transactionIcon, { backgroundColor: `${item.tone}1f` }]}>
        <Text style={[styles.transactionIconText, { color: item.tone }]}>{item.icon}</Text>
      </View>
      <View style={styles.flex}>
        <Text style={styles.cardTitle}>{item.type}</Text>
        <Text style={styles.mutedSmall}>{item.group}</Text>
      </View>
      <View style={styles.rightText}>
        <Text style={[styles.boldValue, { color: item.amount.startsWith("+") ? colors.green : colors.ink }]}>{item.amount}</Text>
        <Text style={styles.mutedSmall}>{item.date}</Text>
      </View>
    </View>
  );
}

function PaymentMethod({ label, icon }) {
  return (
    <TouchableOpacity style={styles.paymentMethod}>
      <View style={styles.methodIcon}><Text style={styles.methodIconText}>{icon}</Text></View>
      <Text style={styles.paymentLabel}>{label}</Text>
      <Text style={styles.chevronDark}>></Text>
    </TouchableOpacity>
  );
}

function HistoryRow({ month, date, amount }) {
  return (
    <View style={styles.historyRow}>
      <View style={styles.transactionIcon}><Text style={styles.transactionIconText}>$</Text></View>
      <View style={styles.flex}>
        <Text style={styles.cardTitle}>{month}</Text>
        <Text style={styles.paidText}>Paid</Text>
      </View>
      <View style={styles.rightText}>
        <Text style={styles.boldValue}>{amount}</Text>
        <Text style={styles.mutedSmall}>{date}</Text>
      </View>
    </View>
  );
}

function ScoreLine({ label, value }) {
  return (
    <View style={styles.scoreLine}>
      <Text style={styles.mutedCopy}>{label}</Text>
      <Text style={styles.scoreLineValue}>{value}</Text>
    </View>
  );
}

function BottomTabs({ active, navigation }) {
  const items = [
    ["Home", "H", "Dashboard"],
    ["Groups", "G", "Groups"],
    ["Contribute", "+", "Contribute"],
    ["Loans", "L", "LoanRequest"],
    ["Profile", "P", "Profile"],
  ];

  return (
    <View style={styles.bottomTabs}>
      {items.map(([label, icon, route]) => (
        <TouchableOpacity key={label} style={styles.tabItem} onPress={() => navigation.navigate(route)}>
          <View style={label === "Contribute" ? styles.fabTab : undefined}>
            <Text style={label === active ? styles.tabIconActive : label === "Contribute" ? styles.fabText : styles.tabIcon}>{icon}</Text>
          </View>
          <Text style={label === active ? styles.tabLabelActive : styles.tabLabel}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function NetworkWarning({ wallet }) {
  async function switchNetwork() {
    try {
      await wallet.switchToPolygon();
    } catch (error) {
      Alert.alert("Network switch failed", error.message);
    }
  }

  return (
    <View style={styles.warning}>
      <Text style={styles.warningText}>You are not connected to Polygon.</Text>
      <TouchableOpacity style={styles.secondaryButton} onPress={switchNetwork}>
        <Text style={styles.secondaryButtonText}>Switch to Polygon</Text>
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

const linking = {
  prefixes: [Linking.createURL("/"), "payloop://"],
  config: {
    screens: {
      Overview: "",
      Register: "register",
      Login: "login",
      Dashboard: "dashboard",
      Groups: "groups",
      Contribute: "contribute",
      LoanRequest: "loan-request",
      CreditScore: "credit-score",
      Transactions: "transactions",
      Profile: "profile",
      Members: "members",
      QRScanner: "scan",
    },
  },
};

export default function App() {
  const wallet = usePayLoopWallet();
  const [displayName, setDisplayName] = useState("John Kamau");

  const screenParams = {
    displayName,
    setDisplayName,
    wallet,
  };

  return (
    <PayLoopContext.Provider value={screenParams}>
      <NavigationContainer theme={DefaultTheme} linking={linking}>
        <Stack.Navigator
          initialRouteName="Overview"
          screenOptions={{
            contentStyle: { backgroundColor: colors.background },
            headerShown: false,
          }}
        >
          <Stack.Screen name="Overview" component={OverviewScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Groups" component={GroupsScreen} />
          <Stack.Screen name="Contribute" component={ContributeScreen} />
          <Stack.Screen name="LoanRequest" component={LoanRequestScreen} />
          <Stack.Screen name="CreditScore" component={CreditScoreScreen} />
          <Stack.Screen name="Transactions" component={TransactionsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Members" component={MembersScreen} />
          <Stack.Screen name="QRScanner" component={QRScannerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PayLoopContext.Provider>
  );
}
