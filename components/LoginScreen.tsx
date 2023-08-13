import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Auth } from "aws-amplify";
import { useAuth } from "../QueryCaching";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const { login, fetchUserProfileData } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ username, password });

      // Fetch user data from DynamoDB
      await fetchUserProfileData();
      // Navigation logic after successful login
      navigation.navigate("FindSession");
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid email or password. Please try again.");
    }
  };

  const handleSignUp = () => {
    // Navigate to the SignUp screen
    navigation.navigate("SignUp"); // Replace 'SignUp' with the name of your SignUp screen in the navigation stack
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
    <View>
      <Text>Login Screen</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderColor: "gray",
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderColor: "gray",
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />
      <TouchableOpacity
        onPress={handleLogin}
        style={{ backgroundColor: "blue", padding: 10, marginBottom: 10 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSignUp}
        style={{ backgroundColor: "green", padding: 10 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={{ color: "blue", textAlign: "center", marginTop: 10 }}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
