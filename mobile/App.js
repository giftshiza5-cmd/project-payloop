import "react-native-get-random-values";
import "react-native-url-polyfill/auto";

import React, { useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";

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
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const screenParams = {
    displayName,
    setDisplayName,
    wallet,
    theme,
    setTheme,
    toggleTheme,
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
