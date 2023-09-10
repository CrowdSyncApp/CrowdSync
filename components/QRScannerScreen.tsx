import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../QueryCaching";
import { createParticipant } from "./SessionManager";
import QRCodeScanner from 'react-native-qrcode-scanner';

const QRScannerScreen = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const navigation = useNavigation();
  const { user, fetchUserProfileData } = useAuth();

  // Function to handle QR code scanning
  const handleBarCodeScanned = async (event) => {
    const { data } = event;

    try {
      const userProfileData = await fetchUserProfileData(user?.username);
      const fullName = userProfileData.fullName;

      const sessionData = data;
      await createParticipant(user?.userId, fullName, sessionData.sessionId);

      navigation.navigate("SessionHome", { sessionData: sessionData });
    } catch (error) {
      // Handle errors, e.g., show an error message to the user
      console.error("Error joining session:", error);
    }

    setScannedData(data);
  };

  return (
    <View style={{ flex: 1 }}>
    <QRCodeScanner onRead={handleBarCodeScanned} captureAudio={false}/>
    </View>
  );
};

export default QRScannerScreen;
