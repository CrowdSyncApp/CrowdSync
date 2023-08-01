import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

// Dummy data for connections (replace with your actual data)
const connectionsData = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Mike Johnson' },
  { id: '4', name: 'Emily Brown' },
  { id: '5', name: 'Alex Wilson' },
];

const MyConnections = ({ navigation }) => {
  // Function to handle when a connection is pressed
  const handleConnectionPress = (connectionId: string) => {
    // Handle the action when a connection is pressed (e.g., navigate to their profile)
    navigation.navigate('OtherUserProfile', { userId: connectionId });
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
      {/* List of Connections */}
      <FlatList
        data={connectionsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleConnectionPress(item.id)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
              {/* You can add profile pictures here if you have them */}
              {/* <Image source={item.profilePicture} style={{ width: 50, height: 50, borderRadius: 25 }} /> */}
              <Text style={{ fontSize: 16, marginLeft: 10 }}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default MyConnections;
