/**
 * CrowdSync app.
 *
 * @format
 */

import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import type { PropsWithChildren } from "react";
import { Amplify, Auth, PushNotification } from "aws-amplify";
import awsmobile from "./src/aws-exports";
import { AuthProvider, useAuth } from "./QueryCaching";
import { LogProvider, useLog } from "./CrowdSyncLogManager";
import styles, { palette, fonts } from "./components/style";

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
import EditProfileScreen from "./components/EditProfileScreen";
import OtherUserProfileScreen from "./components/OtherUserProfileScreen";
import SearchForPeople from "./components/SearchForPeople";
import ChatScreen from "./components/ChatScreen";
import MyConnections from "./components/MyConnections";
import ForgotUsername from "./components/ForgotUsername";
import ForgotPassword from "./components/ForgotPassword";
import SplashScreen from "./components/SplashScreen";
import Header from "./components/Header";
import HeaderWithBack from "./components/HeaderWithBack";
import HeaderWithBackNoProfile from "./components/HeaderWithBackNoProfile";
import SimplifiedHeader from "./components/SimplifiedHeader";
import AddTags from "./components/AddTags";
import UserLocation from "./components/UserLocation";

export const AppContext = React.createContext();

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <LogProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </LogProvider>
  );
}

const AppNavigator = () => {
  const auth = useAuth();
  const log = useLog();
  const { isUserLoggedIn, refreshToken } = auth;

  log.debug("Starting AppNavigator");

  useEffect(() => {
    //configurePushNotifications();
  }, []);

  useEffect(() => {
    const checkTokenFreshness = async () => {
      try {
        if (isUserLoggedIn) {
          const session = await Auth.currentSession();
          const accessTokenExpiration = new Date(
            session.getAccessToken().payload.exp * 1000
          );

          // Check token freshness and refresh if needed
          if (accessTokenExpiration <= new Date()) {
            await refreshToken();
          }
        }
      } catch (error) {
        console.error("Token check error:", error);
        log.error("Token check error:", error);
      }
    };

    checkTokenFreshness();
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{
          title: "Splash Screen",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FindSession"
        options={{
          header: () => <Header />,
        }}
      >
        {(props) => <FindSession {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="MyConnections"
        component={MyConnections}
        options={{
          title: "My Connections",
          header: () => <HeaderWithBack />,
        }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          title: "Chat",
          header: () => <HeaderWithBack />,
        }}
      />
      <Stack.Screen
        name="SearchForPeople"
        component={SearchForPeople}
        options={{
          title: "Search For People",
          header: () => <HeaderWithBack />,
        }}
      />
      <Stack.Screen
        name="OtherUserProfile"
        component={OtherUserProfileScreen}
        options={{
          title: "Other User",
          header: () => <Header />,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          header: () => <HeaderWithBackNoProfile />,
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: "Edit Profile",
          header: () => <HeaderWithBackNoProfile />,
        }}
      />
      <Stack.Screen
        name="AddTags"
        component={AddTags}
        options={{
          title: "Add Tags",
          header: () => <SimplifiedHeader />,
        }}
      />
      <Stack.Screen
        name="SessionHome"
        component={SessionHomeScreen}
        options={{
          title: "Session Home",
          header: () => <Header />,
        }}
      />
      <Stack.Screen
        name="UserLocation"
        component={UserLocation}
        options={{
          title: "Location",
          header: () => <HeaderWithBack />,
        }}
      />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen
        name="Login"
        options={{
          headerShown: false,
        }}
      >
        {(props) => <LoginScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="SignUp"
        options={{
          title: "Sign Up",
          header: () => <SimplifiedHeader />,
        }}
      >
        {(props) => <SignUp {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="ForgotUsername"
        component={ForgotUsername}
        options={{
          header: () => <SimplifiedHeader />,
          title: "Forgot Username",
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{
          header: () => <SimplifiedHeader />,
          title: "Forgot Username",
        }}
      />
    </Stack.Navigator>
  );
};

export default App;
