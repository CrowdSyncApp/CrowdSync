import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { Auth } from "aws-amplify";
import { useNavigation } from "@react-navigation/native";
import CrowdSyncLogo from "../images/Crowdsync_Logo.png";
import styles, { palette, fonts } from "./style";

const ForgotPasswordScreen = () => {
  const [username, setUsername] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigation = useNavigation();

  const handleSendCode = async () => {
    try {
      await Auth.forgotPassword(username);
      setIsCodeSent(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    try {
      await Auth.forgotPasswordSubmit(username, verificationCode, newPassword);
      alert("Password reset successful.");
      // Navigate back to login or wherever you need
      navigation.navigate("Login");
    } catch (error) {
      console.error("Reset password error:", error);
      alert("An error occurred. Please try again.");
    }
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
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.textInput}
          />
          <View style={{ marginTop: 20 }} />
          {!isCodeSent ? (
            <TouchableOpacity
              onPress={handleSendCode}
              style={styles.basicButton}
            >
              <Text style={styles.buttonText}>Send Verification Code</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TextInput
                placeholder="Verification Code"
                value={verificationCode}
                onChangeText={setVerificationCode}
                style={styles.textInput}
              />
              <TextInput
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                style={styles.textInput}
              />
              <TouchableOpacity
                onPress={handleResetPassword}
                style={styles.basicButton}
              >
                <Text style={styles.buttonText}>Reset Password</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;
