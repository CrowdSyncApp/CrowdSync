import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Auth } from "aws-amplify";
import { useAuth } from "../QueryCaching";
import CrowdSyncLogo from "../images/Crowdsync_Logo.png";
import styles, { palette, fonts } from "./style";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const user = await login({ username, password });
    } catch (error) {
      throw error;
    }
  };

  const handleSignUp = () => {
    // Navigate to the SignUp screen
    navigation.navigate("SignUp"); // Replace 'SignUp' with the name of your SignUp screen in the navigation stack
  };

  const handleGuestSignIn = async () => {
    try {
      const anonymousUser = await Auth.currentCredentials(); // Guest account

      // Navigate to the FindSession screen or any other desired screen
      navigation.navigate("FindSession");
    } catch (error) {
      console.error("Guest Sign In error:", error);
      alert("Guest Sign In failed. Please try again.");
    }
  };

  const handleForgotUsername = () => {
    // Navigate to the ForgotUsername screen
    navigation.navigate("ForgotUsername"); // Replace 'ForgotUsername' with the name of your ForgotUsername screen in the navigation stack
  };

  const handleForgotPassword = () => {
    // Navigate to the ForgotPassword screen
    navigation.navigate("ForgotPassword"); // Replace 'ForgotPassword' with the name of your ForgotPassword screen in the navigation stack
  };

  return (
    <View style={styles.index}>
      <View style={styles.div}>
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
            placeholder="Email or Phone"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.textInput}
          />
        </View>
        <View style={{ paddingVertical: 10 }}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.textInput}
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
      </View>
    </View>
  );
};

export default LoginScreen;
