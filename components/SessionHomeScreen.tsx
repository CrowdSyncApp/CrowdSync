import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API } from 'aws-amplify';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../QueryCaching';
import { endSession } from './SessionManager';
import { getParticipants } from '../src/graphql/queries';
import participantsData from '../dummies/dummy_accounts.json';

const SessionHomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user, fetchUserProfileData } = useAuth();
  const { sessionData } = route.params;
  const [participants, setParticipants] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  const qrCodeData = JSON.stringify({
      sessionId: sessionData.sessionId,
      startTime: sessionData.startTime,
    });

    const styles = StyleSheet.create({
      circleIndicator: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 10,
      },
    });

  useEffect(() => {
      // Fetch participant data for the current session
      const fetchParticipants = async () => {
        /*try {
          const response = await API.graphql({
                  query: listParticipants,
                  variables: {
                    filter: {
                      sessionId: {
                        eq: sessionData.sessionId,
                      },
                      visibility: {
                        eq: 'VISIBLE',
                      },
                      userId: {
                          ne: user?.attributes.sub,
                        },
                    },
                  },
                });
          const fetchedParticipants = response.data.listParticipants.items;
          setParticipants(fetchedParticipants);
        } catch (error) {
          console.error('Error fetching participants:', error);
        }*/
        const filteredParticipantsList = participantsData.filter(participant => participant.visibility === "VISIBLE");
        setParticipants(filteredParticipantsList);
      };

      const fetchVisibility = async () => {
        const userProfileData = await fetchUserProfileData(user?.userId);
            try {
              const response = await API.graphql({
                query: getParticipants,
                variables: {
                sessionId: sessionData.sessionId,
                  userId: user?.attributes.sub,
                },
              });

              // Update the visibility state
              setIsVisible(response.data.getParticipants.visibility === 'VISIBLE');
            } catch (error) {
              console.error('Error fetching visibility:', error);
            }
          };

      fetchParticipants();
      fetchVisibility();
    }, [sessionData.sessionId]);

  const handleProfilePress = async () => {
      let userProfileData;

      if (user) {
        userProfileData = await fetchUserProfileData(user?.userId);
      } else {
        // Pick a random user from participantsData
        const randomIndex = Math.floor(Math.random() * participantsData.length);
        userProfileData = participantsData[randomIndex];
      }

      // Navigate to the ProfileScreen and pass the user profile data as params
      navigation.navigate('Profile', { userProfileData });
    };

    const handleJoinSessionWithQRCode = () => {
      navigation.navigate('QRScanner');
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

  const handleToggleVisibility = async () => {
      try {
        // Toggle the visibility in the database
        const newVisibility = isVisible ? 'INVISIBLE' : 'VISIBLE';
        await API.graphql({
          query: updateParticipants,
          variables: {
          sessionId: sessionData.sessionId,
            userId: userProfileData.userId,
            visibility: newVisibility,
          },
        });

        // Update the visibility state
        setIsVisible(!isVisible);
      } catch (error) {
        console.error('Error toggling visibility:', error);
      }
    };

  const handleUserProfilePress = (userData) => {
      navigation.navigate('OtherUserProfile', { userData });
  };

  const isAdmin = user?.signInUserSession?.idToken?.payload['cognito:groups']?.includes('CrowdSync_UserPool_Admin');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{sessionData.title}</Text>
          </View>
          {/* QR Code */}
          <View style={{ marginBottom: 20 }}>
                  <QRCode value={qrCodeData} size={200} />
                </View>

          <View style={{ flex: 1, width: '100%' }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                    Available Profiles:
                  </Text>
                  <FlatList
                    data={participants}
                    keyExtractor={(item) => item.userId}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => handleUserProfilePress(item)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                          {/* You can add profile pictures here if you have them */}
                          {/* <Image source={item.profilePicture} style={{ width: 50, height: 50, borderRadius: 25 }} /> */}
                          <Text style={{ fontSize: 16, marginLeft: 10 }}>{item.name}</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>

      <View>
      <Button title="Profile" onPress={handleProfilePress} />

        <View
                style={[
                  styles.circleIndicator,
                  { backgroundColor: isVisible ? "green" : "red" },
                ]}
              />

      <Button
          title={isVisible ? "Go Invisible" : "Go Visible"}
          onPress={handleToggleVisibility}
        />
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
