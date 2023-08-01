import React from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

// Dummy data for the list of profiles (you can replace this with real data)
const dummyProfiles = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Michael Johnson' },
];

const SessionHomeScreen = ({ navigation }) => {
  // Function to handle pressing the Exit button
  const handleExit = () => {
    // Handle the action when Exit button is pressed (e.g., navigate to another screen)
    // For now, we'll just go back to the previous screen
    navigation.goBack();
  };

  // Function to handle pressing the Search For People button
  const handleSearchForPeople = () => {
    // Handle the action when Search For People button is pressed
    // For now, let's log a message to the console
    navigation.navigate('SearchForPeople');
  };

  // Function to handle pressing the Chat button
  const handleChat = () => {
    // Handle the action when Chat button is pressed
    // For now, let's log a message to the console
    navigation.navigate('ChatScreen');
  };

  const handleUserProfilePress = (userId) => {
      navigation.navigate('OtherUserProfile', { userId });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {/* QR Code */}
          <View style={{ marginBottom: 20 }}>
            <QRCode value="Your QR code data goes here" size={200} />
          </View>

          {/* List of profiles */}
          <View style={{ flex: 1, width: '100%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              Available Profiles:
            </Text>
            <FlatList
              data={dummyProfiles}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleUserProfilePress(item.id)}>
                  <Text style={{ fontSize: 16 }}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

      {/* Buttons */}
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <Button title="Exit" onPress={handleExit} />
        <View style={{ marginLeft: 10 }}>
          <Button title="Search For People" onPress={handleSearchForPeople} />
        </View>
        <View style={{ marginLeft: 10 }}>
          <Button title="Chat" onPress={handleChat} />
        </View>
      </View>
    </View>
  );
};

export default SessionHomeScreen;
