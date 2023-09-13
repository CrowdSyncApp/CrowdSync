import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API, graphqlOperation } from "aws-amplify";
import QRCode from "react-native-qrcode-svg";
import { useAuth } from "../QueryCaching";
import { endSession, fetchParticipants } from "./SessionManager";
import { getParticipants, listParticipants } from "../src/graphql/queries";
import { updateParticipants } from "../src/graphql/mutations";
import { onCreateParticipants } from '../src/graphql/subscriptions';
import participantsData from "../dummies/dummy_accounts.json";
import styles, { palette, fonts } from "./style";

const SessionHomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user, fetchUserProfileData } = useAuth();
  const { sessionData } = route.params;
  const [participants, setParticipants] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  const qrCodeData = JSON.stringify({
    sessionId: sessionData.sessionId,
    startTime: sessionData.startTime,
    title: sessionData.title,
  });

  useEffect(() => {
    // Fetch participant data for the current session
    const participantsList = fetchParticipants();
      setParticipants(participantsList);

      const participantsUpdateInterval = setInterval(async () => {
            try {
              fetchParticipants();
            } catch (error) {
              console.error("Error refreshing participants:", error);
            }
          }, 1 * 60 * 1000);

    const fetchVisibility = async () => {
      const userProfileData = await fetchUserProfileData(user?.username);
      try {
        const response = await API.graphql({
          query: getParticipants,
          variables: {
            sessionId: sessionData.sessionId,
            userId: userProfileData.userId,
          },
        });

        // Update the visibility state
        setIsVisible(response.data.getParticipants.visibility === "VISIBLE");
      } catch (error) {
        console.error("Error fetching visibility:", error);
      }
    };

    fetchVisibility();

      const subscription = API.graphql(
        graphqlOperation(onCreateParticipants, { sessionId: sessionData.sessionId })
      ).subscribe({
        next: (response) => {
          const newParticipant = response.value.data.onCreateParticipants;
          setParticipants((prevParticipants) => [...prevParticipants, newParticipant]);
        },
        error: (error) => {
          console.error('Error subscribing to participant joined:', error);
        },
      });

      return () => {
        subscription.unsubscribe();
      };
  }, [sessionData.sessionId]);

  const handleProfilePress = async () => {
    let userProfileData;

    if (user) {
      userProfileData = await fetchUserProfileData(user?.username);
    } else {
      // Pick a random user from participantsData
      const randomIndex = Math.floor(Math.random() * participantsData.length);
      userProfileData = participantsData[randomIndex];
    }

    // Navigate to the ProfileScreen and pass the user profile data as params
    navigation.navigate("Profile", { userProfileData });
  };

  const handleJoinSessionWithQRCode = () => {
    navigation.navigate("QRScanner");
  };

  // Function to handle pressing the Search For People button
  const handleSearchForPeople = () => {
    // Handle the action when Search For People button is pressed
    // For now, let's log a message to the console
    navigation.navigate("SearchForPeople");
  };

  // Function to handle pressing the Chat button
  const handleChat = () => {
    // Handle the action when Chat button is pressed
    // For now, let's log a message to the console
    navigation.navigate("ChatScreen");
  };

  const handleEndSession = async () => {
    try {
      await endSession(sessionData.sessionId, sessionData.startTime);

      navigation.navigate("FindSession");
    } catch (error) {
      // Handle the error as needed
      console.error("Error ending session:", error);
    }
  };

  const handleToggleVisibility = async () => {
    try {
      const userProfileData = await fetchUserProfileData(user?.username);
      const newVisibility = isVisible ? "INVISIBLE" : "VISIBLE";

      await API.graphql(
          graphqlOperation(updateParticipants, {
              input: {
                    sessionId: sessionData.sessionId,
                  userId: userProfileData.userId,
                  visibility: newVisibility,
              },
          })
      );

      // Update the visibility state
      setIsVisible(!isVisible);
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  const handleUserProfilePress = (userData) => {
    navigation.navigate("OtherUserProfile", { userData, sessionId: sessionData.sessionId });
  };

  const isAdmin = user?.signInUserSession?.idToken?.payload[
    "cognito:groups"
  ]?.includes("CrowdSync_UserPool_Admin");

  return (
    <View style={styles.index}>
      <View style={styles.div}>
        {/* QR Code */}
        <View style={{ marginBottom: 10, alignItems: "center" }}>
          <QRCode value={qrCodeData} size={200} />
        </View>

        <View style={{ alignItems: "center" }}>
          <Text style={styles.headerTitle}>{sessionData.title}</Text>
        </View>

        <View style={{ flex: 1, width: "100%" }}>
          <Text style={styles.secondaryHeaderTitle}>Available Profiles:</Text>
          <FlatList
            data={participants}
            keyExtractor={(item) => item.userId}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleUserProfilePress(item)}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10,
                  }}
                >
                  <Text style={styles.detailText}>{item.fullName}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={{ height: 40, marginBottom: 10 }}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleToggleVisibility}
          >
            <Text style={styles.buttonText}>
              {isVisible ? "Go Invisible" : "Go Visible"}
            </Text>
          </TouchableOpacity>
        </View>

        {isAdmin && (
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <TouchableOpacity
              style={styles.tertiaryButton}
              onPress={handleEndSession}
            >
              <Text style={styles.buttonText}>End Session</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.flexButtonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSearchForPeople}
          >
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() =>
              navigation.navigate("ChatScreen", {
                participants: participants,
                chatType: "GROUP",
              })
            }
          >
            <Text style={styles.buttonText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SessionHomeScreen;
