import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { RNCamera, BarCodeReadEvent } from 'react-native-camera';

const QRScannerScreen = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);

  // Function to handle QR code scanning
  const handleBarCodeScanned = (event: BarCodeReadEvent) => {
    const { data } = event;
    // Perform your logic with the scanned data here
    setScannedData(data);
    // You can do something with the scanned data, such as sending it to the server,
    // displaying it on the screen, etc.
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
