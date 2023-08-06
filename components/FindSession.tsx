import React from 'react';
import { Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../QueryCaching'; // Import the useAuth and useUserProfile hooks

const FindSessionScreen = () => {
  const navigation = useNavigation();
  const { user, fetchUserProfile } = useAuth(); // Get the authenticated user from the useAuth hook

  const handleProfilePress = () => {
    const userProfileData = await fetchUserProfile(user?.userId);
    // Navigate to the ProfileScreen and pass the user profile data as params
    navigation.navigate('Profile', { userProfileData });
  };

  const handleJoinSessionWithQRCode = () => {
    // Navigate to the QRScannerScreen
    navigation.navigate('SessionHome');
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
