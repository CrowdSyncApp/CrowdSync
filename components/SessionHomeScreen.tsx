import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API } from 'aws-amplify';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../QueryCaching';
import { endSession } from './SessionManager';
import { listParticipants } from '../src/graphql/queries';

const SessionHomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user, fetchUserProfileData } = useAuth();
  const { sessionData } = route.params;
  const [participants, setParticipants] = useState([]);

  const qrCodeData = JSON.stringify({
      sessionId: sessionData.sessionId,
      startTime: sessionData.startTime,
    });

  useEffect(() => {
      // Fetch participant data for the current session
      const fetchParticipants = async () => {
        try {
          const response = await API.graphql({
            query: listParticipants,
            variables: {
              filter: {
                sessionId: {
                  eq: sessionData.sessionId,
                },
              },
            },
          });
          const fetchedParticipants = response.data.listParticipants.items;
          setParticipants(fetchedParticipants);
        } catch (error) {
          console.error('Error fetching participants:', error);
        }
      };

      fetchParticipants();
    }, [sessionData.sessionId]);

  const handleProfilePress = async () => {
      const userProfileData = await fetchUserProfileData(user?.userId);
      // Navigate to the ProfileScreen and pass the user profile data as params
      navigation.navigate('Profile', { userProfileData });
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

  const handleEndSession = async () => {
      try {
        await endSession(sessionData.sessionId, sessionData.startTime);

        navigation.navigate('FindSession');
      } catch (error) {
        // Handle the error as needed
        console.error('Error ending session:', error);
      }
    };

  const handleUserProfilePress = (userData) => {
      navigation.navigate('OtherUserProfile', { userData });
  };

  const isAdmin = user?.signInUserSession?.idToken?.payload['cognito:groups']?.includes('CrowdSync_UserPool_Admin');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {/* QR Code */}
          <View style={{ marginBottom: 20 }}>
                  <QRCode value={qrCodeData} size={200} />
                </View>

          <View style={{ flex: 1, width: '100%' }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                    Available Profiles:
                  </Text>
                  <FlatList
                    data={participants} // Use participants data
                    keyExtractor={(item) => item.userId}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => handleUserProfilePress(item)}>
                        <Text style={{ fontSize: 16 }}>{item.fullName}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>

      <View>
      <Button title="Profile" onPress={handleProfilePress} />
      </View>

    {isAdmin && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <Button title="End Session" onPress={handleEndSession} />
            </View>
          )}

      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <View style={{ marginLeft: 10 }}>
          <Button title="Search For People" onPress={handleSearchForPeople} />
        </View>
        <View style={{ marginLeft: 10 }}>
          <Button
            title="Chat"
            onPress={() => navigation.navigate('ChatScreen', { participants: participants, chatType: "GROUP" })}
          />
        </View>
      </View>
    </View>
  );
};

export default SessionHomeScreen;
