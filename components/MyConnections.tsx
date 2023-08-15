import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import participantsData from '../dummies/dummy_accounts.json';

const MyConnections = ({ navigation }) => {
  // Function to handle when a connection is pressed
  const handleConnectionPress = (connectionData: string) => {
    // Handle the action when a connection is pressed (e.g., navigate to their profile)
    navigation.navigate('OtherUserProfile', { userData: connectionData });
  };

  return (
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        {/* List of Connections */}
        <FlatList
            data={participantsData}
            keyExtractor={(item) => item.userId} // Use a unique identifier from your data
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleConnectionPress(item)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                  {/* You can add profile pictures here if you have them */}
                  {/* <Image source={item.profilePicture} style={{ width: 50, height: 50, borderRadius: 25 }} /> */}
                  <Text style={{ fontSize: 16, marginLeft: 10 }}>{item.fullName}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
      </View>
    );
  };

export default MyConnections;
