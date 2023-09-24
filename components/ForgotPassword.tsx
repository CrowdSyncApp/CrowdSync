import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { Auth } from "aws-amplify";
import { useNavigation } from "@react-navigation/native";
import CrowdSyncLogo from "../images/Crowdsync_Logo.png";
import styles, { palette, fonts } from "./style";
import { useLog } from "../CrowdSyncLogManager";

const ForgotPasswordScreen = () => {
  const [username, setUsername] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigation = useNavigation();
  const log = useLog();

  log.debug("Entering ForgotPasswordScreen...");

  const handleSendCode = async () => {
    log.debug('handleSendCode on username: ', JSON.stringify(username));
    try {
      await Auth.forgotPassword(username);
      setIsCodeSent(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      log.error("Forgot password error:", JSON.stringify(error));
      alert("An error occurred. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    log.debug('handleResetPassword...');
    try {
      await Auth.forgotPasswordSubmit(username, verificationCode, newPassword);
      alert("Password reset successful.");
      // Navigate back to login or wherever you need
      navigation.navigate("Login");
    } catch (error) {
      console.error("Reset password error:", error);
      log.error("Reset password error:", JSON.stringify(error));
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
            style={styles.textInput}
            placeholderTextColor="#2a2e30"
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
                placeholderTextColor="#2a2e30"
              />
              <TextInput
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholderTextColor="#2a2e30"
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
