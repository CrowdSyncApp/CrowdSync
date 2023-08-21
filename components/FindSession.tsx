import React, { useState } from 'react';
import { Pressable, View, TextInput, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../QueryCaching';
import { startSession } from './SessionManager';
import { Auth } from 'aws-amplify';
import participantsData from '../dummies/dummy_accounts.json';
import styles, { palette, fonts } from './style';

const FindSessionScreen = () => {
  const navigation = useNavigation();
  const { user, fetchUserProfileData } = useAuth();
  const [sessionTitle, setSessionTitle] = useState('General'); // Default title is General

  const handleProfilePress = async () => {
    let userProfileData;

    if (user) {
      userProfileData = await fetchUserProfileData(user?.userId);
    } else {
      // Pick a random user from participantsData
      const randomIndex = Math.floor(Math.random() * participantsData.length);
      userProfileData = participantsData[randomIndex];
    }

    // Navigate to the ProfileScreen and pass the user profile data as params
    navigation.navigate('Profile', { userProfileData });
  };

  const handleJoinSessionWithQRCode = () => {
    navigation.navigate('QRScanner');
  };

  const handleStartSession = async () => {

    const userProfileData = await fetchUserProfileData(user?.userId);
      const newSession = await startSession(userProfileData, sessionTitle);

      // Check if startSession was successful and navigate to SessionHomeScreen
      if (newSession) {
        navigation.navigate('SessionHome', { sessionData: newSession });
      }
    };

  const renderSessionButtons = () => {

    const userGroups = user?.signInUserSession?.idToken?.payload['cognito:groups'] || [];

    if (userGroups.includes('CrowdSync_UserPool_Admin')) {
      return (
        <View style={styles.textInputContainer}>
        <View style={{ marginTop: 30 }} />
        <TextInput
        style={styles.textInput}
              placeholder="General"
              value={sessionTitle}
              onChangeText={text => setSessionTitle(text)}
            />
            <View style={{ paddingVertical: 10 }} />
            <Pressable style={styles.basicButton} onPress={handleStartSession}>
                    <Text style={styles.buttonText}>Start Session</Text>
                  </Pressable>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.index}>
      <View style={styles.div}>
      <View style={styles.buttonContainer}>
      <Pressable style={styles.basicButton} onPress={handleJoinSessionWithQRCode}>
        <Text style={styles.buttonText}>Join Session with QR Code</Text>
      </Pressable>
      <View style={{ paddingVertical: 10 }} />
      <Pressable style={styles.basicButton} onPress={handleProfilePress}>
        <Text style={styles.buttonText}>Profile</Text>
      </Pressable>
      <View style={{ paddingVertical: 10 }} />
      {renderSessionButtons()}
      </View>
      </View>
    </View>
  );
};

export default FindSessionScreen;
