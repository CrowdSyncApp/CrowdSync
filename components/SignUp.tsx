import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { createUserProfile } from '../src/graphql/mutations';

const SignUpScreen = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState(''); // Use this field for email or phone number
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
      console.log(userProfileInput);
          const response = await API.graphql(graphqlOperation(createUserProfile, { input: userProfileInput }));
          const data = response.data;
          console.log(data);
      } catch (error) {
         console.error('Error storing data:', error);
      }

      // Handle successful sign-up
    } catch (error) {
      console.error('Sign up error:', error);
      // Handle sign-up error
    }
  };

  const isEmailFormat = (value) => {
    // Simple email format validation
    return /\S+@\S+\.\S+/.test(value);
  };

  const handleUsernameChange = (value) => {
    setUsername(value);
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
        keyboardType={isEmailFormat(username) ? 'email-address' : 'phone-pad'}
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
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

export default SignUpScreen;
