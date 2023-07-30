import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');

  const handleSignUp = () => {
    // Perform sign-up logic, e.g., API calls for user registration
    // Validate the input fields and handle the sign-up process
    // Once sign-up is successful, navigate to the appropriate screen

    // For this example, let's simply print the user data for now
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Re-enter Password:', reenterPassword);
  };

  return (
    <View>
      <Text>Sign Up Screen</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        placeholder="Re-enter Password"
        value={reenterPassword}
        onChangeText={setReenterPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

export default SignUpScreen;
