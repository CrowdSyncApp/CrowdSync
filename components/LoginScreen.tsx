import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook

const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Perform login logic, e.g., API calls for authentication
    // For this example, let's just check if email and password are not empty
    if (email.trim() !== '' && password.trim() !== '') {
      // If login is successful, call the onLoginSuccess function
      onLoginSuccess();
    } else {
      // Handle login failure, show an error message, etc.
      alert('Please enter a valid email and password.');
    }
  };

  // Get the navigation object using the useNavigation hook
    const navigation = useNavigation();

    const handleSignUp = () => {
      // Navigate to the SignUp screen
      navigation.navigate('SignUp'); // Replace 'SignUp' with the name of your SignUp screen in the navigation stack
    };

  return (
    <View>
      <Text>Login Screen</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderColor: 'gray', borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderColor: 'gray', borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: 'blue', padding: 10, marginBottom: 10 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignUp} style={{ backgroundColor: 'green', padding: 10 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
