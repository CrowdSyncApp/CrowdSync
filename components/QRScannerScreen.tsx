import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../QueryCaching";
import { createOrUpdateParticipant } from "./SessionManager";
import QRCodeScanner from 'react-native-qrcode-scanner';
import { useLog } from "../CrowdSyncLogManager";

const QRScannerScreen = () => {
  const navigation = useNavigation();
  const { user, fetchUserProfileData } = useAuth();
  const log = useLog();

  log.debug('QRScannerScreen...');

  // Function to handle QR code scanning
  const handleBarCodeScanned = async (event) => {
    const { data } = event;
    log.debug('handleBarCodeScanned on data: ', data);

    try {
      const userProfileData = await fetchUserProfileData(user?.username);
      const fullName = userProfileData.fullName;

      const sessionData = JSON.parse(data);
      const userId = userProfileData.userId;
      const sessionId = sessionData.sessionId;
      await createOrUpdateParticipant(userId, fullName, sessionId, log);

      navigation.navigate("SessionHome", { sessionData: sessionData });
    } catch (error) {
      // Handle errors, e.g., show an error message to the user
      console.error("Error joining session:", error);
      log.error("Error joining session:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
    <QRCodeScanner onRead={handleBarCodeScanned} captureAudio={false}/>
    </View>
  );
};

export default QRScannerScreen;
