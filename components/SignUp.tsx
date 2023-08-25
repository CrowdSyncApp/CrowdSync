import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../QueryCaching";
import { createUserProfile } from "../src/graphql/mutations";
import CrowdSyncLogo from "../images/Crowdsync_Logo.png";
import styles, { palette, fonts } from './style';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState(""); // Use this field for email or phone number
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login, fetchUserProfileData } = useAuth();

  const handleSignUp = async () => {
    try {
      // Perform sign-up logic
      const user = await Auth.signUp({
        username: username, // Use the chosen username (either email or phone number)
        password: password,
      });

        const now = new Date().toISOString();

      // Create the user profile in DynamoDB using the API
      const userProfileInput = {
        userId: user.userSub,
        fullName: fullName,
        email: isEmailFormat(username) ? username : "", // Store the email if it's in email format, otherwise set to null
        phoneNumber: isEmailFormat(username) ? null : username, // Store the phone number if it's not in email format, otherwise set to null
        createdAt: now,
        updatedAt: now,
      };

      try {
        const response = await API.graphql(
          graphqlOperation(createUserProfile, { input: userProfileInput })
        );
        const data = response.data;
      } catch (error) {
        console.error("Error storing data:", error);
      }

      navigation.navigate("Login");
    } catch (error) {
      console.error("Sign up error:", error);
      if (error.code === "UsernameExistsException") {
        setErrorMessage(
          "Username already exists. Please choose a different email or phone number."
        );
      } else {
        setErrorMessage(
          "An error occurred during sign up. Please try again later."
        );
      }
    }
  };

  const isEmailFormat = (value) => {
    // Simple email format validation
    return /\S+@\S+\.\S+/.test(value);
  };

  const handleUsernameChange = (value) => {
    setUsername(value);
    setErrorMessage("");
  };

  const handleLoginRedirect = () => {
    // Navigate to the Login screen
    navigation.navigate("Login");
  };

  return (<KeyboardAvoidingView
                    style={{ flex: 1 }} // Set the flex property to 1 to fill the available space
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
                  >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <View style={styles.index}>
        <View style={styles.div}>
      <View style={styles.titleContainer}>
          <Image source={CrowdSyncLogo} resizeMode="contain" style={styles.splashLogo} />
            <Text style={styles.headerTitle}>CrowdSync</Text>
            </View>
            <View style={{paddingVertical: 10, paddingHorizontal: 13}}>
      <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.textInput}
        />
        <View style={{ paddingVertical: 10 }} />
      <TextInput
          placeholder="Email or Phone Number"
          value={username}
          onChangeText={handleUsernameChange}
          keyboardType={isEmailFormat(username) ? "email-address" : "phone-pad"}
          style={styles.textInput}
        />
        <View style={{ paddingVertical: 10 }} />
      <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.textInput}
        />
        <View style={{ paddingVertical: 10 }} />
      <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.textInput}
        />
        </View>
      <Text style={{ color: "red" }}>{errorMessage}</Text>
      <View style={styles.buttonContainer}>
                    <Pressable style={styles.basicButton} onPress={handleSignUp}>
                      <Text style={styles.buttonText}>Sign Up</Text>
                    </Pressable>
                    <View style={{ paddingVertical: 10 }} />

                    <Pressable style={styles.basicButton} onPress={handleLoginRedirect}>
                      <Text style={styles.buttonText}>Log In With Existing Account</Text>
                    </Pressable>
                    <View style={{ paddingVertical: 10 }} />
                </View>
      </View>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
