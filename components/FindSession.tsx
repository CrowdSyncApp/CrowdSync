import { Button, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const FindSessionScreen = () => {
  const navigation = useNavigation();

  // Simulated user data
  const user = {
    fullName: "John Doe",
    jobTitle: "Software Engineer",
    address: "123 Main St",
    phoneNumber: "555-1234",
    // Add other user information as needed
  };

  const handleProfilePress = () => {
    // Navigate to the ProfileScreen and pass the user data as params
    navigation.navigate("Profile", { user });
  };

  const handleJoinSessionWithQRCode = () => {
    // Navigate to the QRScannerScreen
    navigation.navigate("SessionHome");
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
