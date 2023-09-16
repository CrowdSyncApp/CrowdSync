import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
  SafeAreaView,
  StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Auth } from "aws-amplify";
import { useAuth } from "../QueryCaching";
import CrowdSyncLogo from "../images/Crowdsync_Logo.png";
import styles, { palette, fonts } from "./style";
import { useLog } from "../CrowdSyncLogManager";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const { login } = useAuth();
  const log = useLog();

  log.debug('Login screen...');

  useEffect(() => {
        navigation.addListener('beforeRemove', nav => {
            // Prevent going back
            if (nav.data.action.type === 'GO_BACK') {
              nav.preventDefault();
            }
          });
   }, [navigation]);

  const handleLogin = async () => {
    try {
        log.debug('Attempted login on username: ', username);
      await login({ username, password }, log);
      navigation.navigate("FindSession");
    } catch (error) {
    log.debug('Failed login: ', error);
      throw error;
    }
  };

  const handleSignUp = () => {
    // Navigate to the SignUp screen
    log.debug('Navigating to signup screen');
    navigation.navigate("SignUp");
  };

  const handleGuestSignIn = async () => {
    log.debug('handleGuestSignIn');
    try {
      log.debug('Logging in with guest account hello@crowdync.net');
      await login({ username: 'hello@crowdsync.net', password: 'CrowdsyncGuest1' }, log);

      // Navigate to the FindSession screen or any other desired screen
      navigation.navigate("FindSession");
    } catch (error) {
      console.error("Guest Sign In error:", error);
      log.error("Guest Sign In error:", error);
      alert("Guest Sign In failed. Please try again.");
    }
  };

  const handleForgotUsername = () => {
    log.debug('handleForgotUsername');
    // Navigate to the ForgotUsername screen
    navigation.navigate("ForgotUsername");
  };

  const handleForgotPassword = () => {
    log.debug('handleForgotPassword');
    // Navigate to the ForgotPassword screen
    navigation.navigate("ForgotPassword");
  };

  return (

    <View style={styles.index}>
      <View style={styles.div}>
  <View style={{backgroundColor: palette.primaryBgColor}}>
   <SafeAreaView style={{marginTop: StatusBar.currentHeight }}>
        <View style={styles.titleContainer}>
          <Image
            source={CrowdSyncLogo}
            resizeMode="contain"
            style={styles.splashLogo}
          />
          <Text style={styles.headerTitle}>CrowdSync</Text>
        </View>
        <View style={{ paddingVertical: 10 }}>
          <TextInput
            placeholder="Email"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            style={styles.textInput}
            placeholderTextColor="#2a2e30"
          />
        </View>
        <View style={{ paddingVertical: 10 }}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.textInput}
            placeholderTextColor="#2a2e30"
          />
        </View>
        <View style={styles.flexButtonContainer}>
          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignUp} style={styles.signUpButton}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingVertical: 10, paddingHorizontal: 13 }}>
          <TouchableOpacity
            onPress={handleGuestSignIn}
            style={styles.tertiaryButton}
          >
            <Text style={styles.buttonText}>Guest Sign In</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text
            style={{
              color: palette.tertiaryColor,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>
   </SafeAreaView>
   </View>

      </View>
    </View>
  );
};

export default LoginScreen;
