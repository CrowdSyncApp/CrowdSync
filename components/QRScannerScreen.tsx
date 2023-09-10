import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { RNCamera, BarCodeReadEvent } from "react-native-camera";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../QueryCaching";
import { createParticipant } from "./SessionManager";

const QRScannerScreen = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [debugText, setDebugText] = useState<string>("");
  const [debugText2, setDebugText2] = useState<string>("");
  const [debugText3, setDebugText3] = useState<string>("");
  const [debugText4, setDebugText4] = useState<string>("");
  const [debugText5, setDebugText5] = useState<string>("");
  const navigation = useNavigation();
  const { user, fetchUserProfileData } = useAuth();

  // Function to handle QR code scanning
  const handleBarCodeScanned = async (event: BarCodeReadEvent) => {
    const { data } = event;
    setDebugText(data);

    try {
      const userProfileData = await fetchUserProfileData(user?.username);
      setDebugText2(userProfileData);
      const fullName = userProfileData.fullName;
      setDebugText3(fullName);

      const sessionData = data;
      setDebugText4(sessionData);
      await createParticipant(user?.userId, fullName, sessionData.sessionId);
      setDebugText5("here");

      navigation.navigate("SessionHome", { sessionData: sessionData });
    } catch (error) {
      // Handle errors, e.g., show an error message to the user
      console.error("Error joining session:", error);
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
        captureAudio={false}
      />
      {scannedData && (
        <View
          style={{
            backgroundColor: "white",
            padding: 16,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
        <Text>{debugText}</Text>
        <Text>{debugText2}</Text>
        <Text>{debugText3}</Text>
        <Text>{debugText4}</Text>
        <Text>{debugText5}</Text>
        </View>
      )}
    </View>
  );
};

export default QRScannerScreen;
