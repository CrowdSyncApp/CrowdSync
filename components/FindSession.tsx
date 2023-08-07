import React from 'react';
import { Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../QueryCaching';
import { startSession, endSession } from './SessionManager';

const FindSessionScreen = () => {
  const navigation = useNavigation();
  const { user, fetchUserProfileData } = useAuth(); // Get the authenticated user from the useAuth hook

  const handleProfilePress = async () => {
    const userProfileData = await fetchUserProfileData(user?.userId);
    // Navigate to the ProfileScreen and pass the user profile data as params
    navigation.navigate('Profile', { userProfileData });
  };

  const handleJoinSessionWithQRCode = () => {
    // Navigate to the QRScannerScreen
    navigation.navigate('SessionHome');
  };

const renderSessionButtons = () => {
    if (
      user?.attributes?.email === 'sstben@gmail.com' ||
      user?.attributes?.email === 'chuynh@crowdsync.net'
    ) {
      return (
        <View>
          <Button title="Start Session" onPress={() => {startSession}} />
          <Button title="End Session" onPress={() => {endSession}} />
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
    </View>
  );
};

export default FindSessionScreen;
