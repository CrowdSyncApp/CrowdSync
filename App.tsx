/**
 * CrowdSync app.
 *
 * @format
 */

import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PropsWithChildren } from "react";
import { Amplify } from "aws-amplify";
import awsmobile from './aws-exports';

Amplify.configure(awsmobile);

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
} from "react-native";

import {
  Colors,
  DebugInstructions,
  LearnMoreLinks,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";

const Stack = createStackNavigator();

import LoginScreen from "./components/LoginScreen";
import SignUp from "./components/SignUp";
import FindSession from "./components/FindSession";
import QRScannerScreen from "./components/QRScannerScreen";
import SessionHomeScreen from "./components/SessionHomeScreen";
import ProfileScreen from "./components/ProfileScreen";
import OtherUserProfileScreen from "./components/OtherUserProfileScreen";
import SearchForPeople from "./components/SearchForPeople";
import ChatScreen from "./components/ChatScreen";
import MyConnections from "./components/MyConnections";

import CrowdSyncLogo from "./images/CrowdSyncLogo.png";

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  // Function to handle successful login and update authentication state
  const handleLoginSuccess = () => {
    setIsUserLoggedIn(true);
  };

  // Function to handle user logout and update authentication state
  const handleLogout = () => {
    setIsUserLoggedIn(false);
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isUserLoggedIn ? (
          <>
            <Stack.Screen
              name="Login"
              options={{
                headerShown: false,
              }}
            >
              {(props) => (
                <LoginScreen {...props} onLoginSuccess={handleLoginSuccess} />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="SignUp"
              component={SignUp} // Add SignUp screen
              options={{
                title: "Sign Up", // Optional: Set the title for the SignUp screen header
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="FindSession"
              options={{
                header: () => <Header />,
              }}
            >
              {(props) => <FindSession {...props} onLogout={handleLogout} />}
            </Stack.Screen>
            <Stack.Screen
              name="MyConnections"
              component={MyConnections}
              options={{
                title: "My Connections",
              }}
            />
            <Stack.Screen
              name="ChatScreen"
              component={ChatScreen}
              options={{
                title: "Chat",
              }}
            />
            <Stack.Screen
              name="SearchForPeople"
              component={SearchForPeople}
              options={{
                title: "Search For People",
              }}
            />
            <Stack.Screen
              name="OtherUserProfile"
              component={OtherUserProfileScreen}
              options={{
                title: "Other User",
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                title: "Profile",
              }}
            />
            <Stack.Screen
              name="SessionHome"
              component={SessionHomeScreen} // Add SessionHomeScreen
              options={{
                title: "Session Home",
              }}
            />
          </>
        )}
        <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Header = () => {
  return (
    <View style={styles.header}>
      <Image
        source={CrowdSyncLogo}
        style={{
          width: 50, // Set the desired width of your logo
          height: 50, // Set the desired height of your logo
        }}
      />
      {/* Replace "Your App Name" with your desired title */}
      <Text style={styles.headerTitle}>CrowdSync</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
});

export default App;
