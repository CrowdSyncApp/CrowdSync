import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { RNCamera, BarCodeReadEvent } from 'react-native-camera';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../QueryCaching';
import { createParticipant } from './SessionManager';

const QRScannerScreen = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const navigation = useNavigation();
    const { user, fetchUserProfileData } = useAuth();

  // Function to handle QR code scanning
  const handleBarCodeScanned = async (event: BarCodeReadEvent) => {
    const { data } = event;

    try {
          const userProfileData = await fetchUserProfileData(user?.userId);
          const fullName = userProfileData.fullName;

          const sessionData = data;
          await createParticipant(user?.userId, fullName, sessionData.sessionId);

          navigation.navigate('SessionHome', { sessionData: sessionData });
        } catch (error) {
          // Handle errors, e.g., show an error message to the user
          console.error('Error joining session:', error);
        }

        setScannedData(data);
  };

  useEffect(() => {
    // Clean up the scanned data when the component unmounts
    return () => setScannedData(null);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <RNCamera
        style={{ flex: 1 }}
        onBarCodeRead={handleBarCodeScanned}
        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
      />
      {scannedData && (
        <View
          style={{
            backgroundColor: 'white',
            padding: 16,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Text>Scanned QR Code: {scannedData}</Text>
        </View>
      )}
    </View>
  );
};

export default QRScannerScreen;
