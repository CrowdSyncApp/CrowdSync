import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Auth } from "aws-amplify";

const ForgotUsernameScreen = () => {
  const [email, setEmail] = useState("");
  const [retrievedUsername, setRetrievedUsername] = useState("");

  const handleRetrieveUsername = async () => {
    try {
      const retrievedUsername = await Auth.forgotPassword(username);
      setRetrievedUsername(retrievedUsername);
    } catch (error) {
      console.error("Forgot username error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <View>
      <Text>Forgot Username Screen</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TouchableOpacity onPress={handleRetrieveUsername}>
        <Text>Retrieve Username</Text>
      </TouchableOpacity>
      {retrievedUsername && (
        <Text>Retrieved Username: {retrievedUsername}</Text>
      )}
    </View>
  );
};

export default ForgotUsernameScreen;
