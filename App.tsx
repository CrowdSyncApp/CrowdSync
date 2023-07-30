/**
 * CrowdSync app.
 *
 * @format
 */

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Stack = createStackNavigator();

import LoginScreen from './components/LoginScreen.tsx';
import SignUp from './components/SignUp.tsx';
import FindSession from './components/FindSession.tsx';

import CrowdSyncLogo from './images/CrowdSyncLogo.png'

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
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
              {(props) => <LoginScreen {...props} onLoginSuccess={handleLoginSuccess} />}
            </Stack.Screen>
            <Stack.Screen
              name="SignUp"
              component={SignUp} // Add SignUp screen
              options={{
                title: 'Sign Up', // Optional: Set the title for the SignUp screen header
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="FindSession"
            options={{
              header: () => <Header />, // Add the custom header
            }}
          >
            {(props) => <FindSession {...props} onLogout={handleLogout} />} {/* Pass onLogout prop to FindSession */}
          </Stack.Screen>
        )}
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
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
