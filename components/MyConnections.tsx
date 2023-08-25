import React from 'react';
import { View, Text, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import participantsData from '../dummies/dummy_accounts.json';
import styles, { palette, fonts } from './style';

const MyConnections = ({ navigation }) => {
  // Function to handle when a connection is pressed
  const handleConnectionPress = (connectionData: string) => {
    // Handle the action when a connection is pressed (e.g., navigate to their profile)
    navigation.navigate('OtherUserProfile', { userData: connectionData });
  };

  return (
      <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
          <View style={styles.index}>
            <View style={styles.div}>
        {/* List of Connections */}
        <FlatList
            data={participantsData}
            keyExtractor={(item) => item.userId} // Use a unique identifier from your data
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleConnectionPress(item)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                  <Text style={styles.secondaryHeaderTitle}>{item.fullName}</Text>
                </View>
              </TouchableOpacity>
            )}
          />

      </View>
    </View>
    </KeyboardAvoidingView>
    );
  };

export default MyConnections;
