import React, { useState } from 'react';
import { Button, View, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../QueryCaching';
import { startSession } from './SessionManager';
import { Auth } from 'aws-amplify';
import participantsData from '../dummies/dummy_accounts.json';

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
        <View>
        <TextInput
              placeholder="General"
              value={sessionTitle}
              onChangeText={text => setSessionTitle(text)}
            />
          <Button title="Start Session" onPress={handleStartSession} />
        </View>
      );
    }

    return null;
  };

  return (
    <View>
      <Button
        title="Join Session with QR Code"
        onPress={handleJoinSessionWithQRCode}
      />
      <Button title="Profile" onPress={handleProfilePress} />
      {renderSessionButtons()}
    </View>
  );
};

export default FindSessionScreen;
