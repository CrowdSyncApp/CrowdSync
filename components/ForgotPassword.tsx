import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Auth } from 'aws-amplify';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const [username, setUsername] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigation = useNavigation();

  const handleSendCode = async () => {
    try {
      await Auth.forgotPassword(username);
      setIsCodeSent(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    try {
      await Auth.forgotPasswordSubmit(username, verificationCode, newPassword);
      alert('Password reset successful.');
      // Navigate back to login or wherever you need
      navigation.navigate("Login");
    } catch (error) {
      console.error('Reset password error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <View>
      <Text>Forgot Password Screen</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {!isCodeSent ? (
        <TouchableOpacity onPress={handleSendCode}>
          <Text>Send Verification Code</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TextInput
            placeholder="Verification Code"
            value={verificationCode}
            onChangeText={setVerificationCode}
          />
          <TextInput
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TouchableOpacity onPress={handleResetPassword}>
            <Text>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default ForgotPasswordScreen;
