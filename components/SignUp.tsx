import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { createUserProfile } from "../src/graphql/mutations";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../QueryCaching";

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

      // Create the user profile in DynamoDB using the API
      const userProfileInput = {
        userId: user.userSub,
        fullName: fullName,
        email: isEmailFormat(username) ? username : "", // Store the email if it's in email format, otherwise set to null
        phoneNumber: isEmailFormat(username) ? "" : username, // Store the phone number if it's not in email format, otherwise set to null
      };

      try {
        const response = await API.graphql(
          graphqlOperation(createUserProfile, { input: userProfileInput })
        );
        const data = response.data;
      } catch (error) {
        console.error("Error storing data:", error);
      }

      // After successful signup, automatically log in the user
      await login({ username, password });

      // Fetch user data from DynamoDB
      await fetchUserProfileData();

      navigation.navigate("FindSession");
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

  return (
    <View>
      <Text>Sign Up Screen</Text>
      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        placeholder="Email or Phone Number"
        value={username}
        onChangeText={handleUsernameChange}
        keyboardType={isEmailFormat(username) ? "email-address" : "phone-pad"}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Text style={{ color: "red" }}>{errorMessage}</Text>
      <Button title="Sign Up" onPress={handleSignUp} />
      <Button
        title="Log In With Existing Account"
        onPress={handleLoginRedirect}
      />
    </View>
  );
};

export default SignUpScreen;
