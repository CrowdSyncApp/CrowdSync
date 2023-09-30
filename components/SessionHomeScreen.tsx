import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Pressable,
  Modal,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { API, graphqlOperation } from "aws-amplify";
import QRCode from "react-native-qrcode-svg";
import { useAuth } from "../QueryCaching";
import { endSession, fetchParticipants, exitSession } from "./SessionManager";
import { getParticipants, listParticipants } from "../src/graphql/queries";
import { updateParticipants } from "../src/graphql/mutations";
import {
  onCreateParticipants,
  onCreateOrUpdateParticipants,
  onDeleteParticipants,
  onUpdateParticipants,
} from "../src/graphql/subscriptions";
import styles, { palette, fonts } from "./style";
import { useLog } from "../CrowdSyncLogManager";

const SessionHomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user, fetchUserProfileData, getUserProfileFromId, storeInterval } =
    useAuth();
  const { sessionData } = route.params;
  const log = useLog();
  const [participants, setParticipants] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isQRCodeModalVisible, setIsQRCodeModalVisible] = useState(false);

  log.debug("SessionHomeScreen on sessionData: ", sessionData);

  const qrCodeData = JSON.stringify({
    sessionId: sessionData.sessionId,
    startTime: sessionData.startTime,
    title: sessionData.title,
    creatorId: sessionData.creatorId,
    status: sessionData.status,
  });

  const handleQRCodePress = () => {
    setIsQRCodeModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsQRCodeModalVisible(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const storeParticipantData = async () => {
          log.debug("storeParticipantData on user: ", user);
          // Fetch participant data for the current session
          const participantsList = await fetchParticipants(log);
          log.debug("participantsList: ", participantsList);
          setParticipants(participantsList);
        };
        storeParticipantData();

        // TODO update to remove an extra API call and just get the result from the storeParticipantData call
        const fetchVisibility = async () => {
          log.debug("fetchVisibility");
          const userProfileData = await fetchUserProfileData();
          try {
            const response = await API.graphql({
              query: getParticipants,
              variables: {
                sessionId: sessionData.sessionId,
                userId: userProfileData.userId,
              },
            });

            log.debug("visibility: ", response.data.getParticipants.visibility);
            // Update the visibility state
            setIsVisible(
              response.data.getParticipants.visibility === "VISIBLE"
            );
          } catch (error) {
            console.error("Error fetching visibility:", error);
            log.error("Error fetching visibility:", JSON.stringify(error));
          }
        };

        fetchVisibility();

        const createOrUpdateSubscription = () => {
          // Create subscription for adding new participants
          log.debug("onCreateOrUpdateParticipants on sessionData: ", sessionData);
          const subscription = API.graphql(
            graphqlOperation(onCreateOrUpdateParticipants, {
              sessionId: sessionData.sessionId,
            })
          ).subscribe({
            next: (response) => {
              const newParticipant = response.value.data.onCreateOrUpdateParticipants;
              setParticipants((prevParticipants) => [
                ...prevParticipants,
                newParticipant,
              ]);
            },
            error: (error) => {
              console.error("Error subscribing to participant created or updated:", error);
              log.error(
                "Error subscribing to participant created or updated:",
                JSON.stringify(error)
              );
            },
          });
          return subscription;
        };

        const deleteSubscription = () => {
          // Create subscription for deleting participants
          const subscription = API.graphql(
            graphqlOperation(onDeleteParticipants, {
              sessionId: sessionData.sessionId,
            })
          ).subscribe({
            next: (response) => {
              const deletedParticipant =
                response.value.data.onDeleteParticipants;
              setParticipants((prevParticipants) =>
                prevParticipants.filter(
                  (participant) =>
                    participant.userId !== deletedParticipant.userId
                )
              );
            },
            error: (error) => {
              console.error("Error subscribing to participant deleted:", error);
              log.error(
                "Error subscribing to participant deleted:",
                JSON.stringify(error)
              );
            },
          });
          return subscription;
        };

        const updateSubscription = () => {
          // Create subscription for updating participant visibility
          const subscription = API.graphql(
            graphqlOperation(onUpdateParticipants, {
              sessionId: sessionData.sessionId,
            })
          ).subscribe({
            next: (response) => {
              const updatedParticipant =
                response.value.data.onUpdateParticipants;

              if (updatedParticipant.userId !== user?.attributes.sub) {
                if (
                    updatedParticipant.visibility === "VISIBLE" &&
                    updatedParticipant.userStatus === "ACTIVE"
                  ) {
                    setParticipants((prevParticipants) => [
                      ...prevParticipants,
                      updatedParticipant,
                    ]);
                  } else {
                    setParticipants((prevParticipants) =>
                      prevParticipants.filter(
                        (participant) =>
                          participant.userId !== updatedParticipant.userId
                      )
                    );
                  }
              }
            },
            error: (error) => {
              console.error("Error subscribing to participant updated:", error);
              log.error(
                "Error subscribing to participant updated:",
                JSON.stringify(error)
              );
            },
          });
          return subscription;
        };

        const onCreateOrUpdateSubscription = createOrUpdateSubscription();
        const onDeleteSubscription = deleteSubscription();
        const onUpdateSubscription = updateSubscription();

        return () => {
          onCreateOrUpdateSubscription.unsubscribe();
          onDeleteSubscription.unsubscribe();
          onUpdateSubscription.unsubscribe();
        };
      };

      fetchData();
    }, [user, fetchParticipants, fetchUserProfileData, sessionData.sessionId])
  );

  const handleJoinSessionWithQRCode = () => {
    log.debug("handleJoinSessionWithQRCode");
    navigation.navigate("QRScanner");
  };

  // Function to handle pressing the Search For People button
  const handleSearchForPeople = () => {
    log.debug(
      "handleSearchForPeople on sessionData: ",
      JSON.stringify(sessionData)
    );
    // Handle the action when Search For People button is pressed
    // For now, let's log a message to the console
    navigation.navigate("SearchForPeople", { sessionData: sessionData });
  };

  // Function to handle pressing the Chat button
  const handleChat = () => {
    log.debug("handleChat");
    // Handle the action when Chat button is pressed
    // For now, let's log a message to the console
    navigation.navigate("ChatScreen");
  };

  const handleExitSession = async () => {
    log.debug(
      "handleExitSession on sessionData: ",
      JSON.stringify(sessionData)
    );
    try {
      await exitSession(user?.username, sessionData.sessionId, log);

      navigation.navigate("FindSession");
    } catch (error) {
      // Handle the error as needed
      console.error("Error exiting session:", error);
      log.error("Error exiting session:", JSON.stringify(error));
    }
  };

  const handleEndSession = async () => {
    log.debug("handleEndSession on sessionData: ", JSON.stringify(sessionData));
    try {
      await endSession(
        user?.username,
        sessionData.sessionId,
        sessionData.startTime,
        log
      );

      navigation.navigate("FindSession");
    } catch (error) {
      // Handle the error as needed
      console.error("Error ending session:", error);
      log.error("Error ending session:", JSON.stringify(error));
    }
  };

  const handleToggleVisibility = async () => {
    log.debug("handleToggleVisibility");
    try {
      const userProfileData = await fetchUserProfileData();
      const newVisibility = isVisible ? "INVISIBLE" : "VISIBLE";

      log.debug(
        "updateParticipants on sessionId: " +
          JSON.stringify(sessionData.sessionId) +
          " and userId: " +
          JSON.stringify(userProfileData.userId) +
          " and visibility: " +
          JSON.stringify(newVisibility)
      );
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
      log.error("Error toggling visibility:", JSON.stringify(error));
    }
  };

  const handleUserProfilePress = async (userProfileData) => {
    log.debug(
      "handleUserProfilePress on userProfileData: " +
        JSON.stringify(userProfileData) +
        " and sessionId: " +
        JSON.stringify(sessionData.sessionId)
    );
    let userData = await getUserProfileFromId(userProfileData.userId, log);

    navigation.navigate("OtherUserProfile", {
      userData,
      sessionId: sessionData.sessionId,
    });
  };

  const isAdmin = user?.signInUserSession?.idToken?.payload[
    "cognito:groups"
  ]?.includes("CrowdSync_UserPool_Admin");

  return (
    <View style={styles.index}>
      <View style={styles.div}>
        {/* QR Code */}
        <TouchableOpacity onPress={handleQRCodePress}>
          <View style={{ marginBottom: 10, alignItems: "center" }}>
            <QRCode value={qrCodeData} size={200} />
          </View>
        </TouchableOpacity>

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
        <View style={styles.flexButtonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleToggleVisibility}
          >
            <Text style={styles.buttonText}>
              {isVisible ? "Go Invisible" : "Go Visible"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleExitSession}
          >
            <Text style={styles.buttonText}>Exit Session</Text>
          </TouchableOpacity>
        </View>

        {isAdmin && (
          <View
            style={{ flexDirection: "row", marginBottom: 10, marginTop: 10 }}
          >
            <TouchableOpacity
              style={styles.tertiaryButton}
              onPress={handleEndSession}
            >
              <Text style={styles.buttonText}>End Session</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ marginTop: 10 }} />
        <View style={styles.flexButtonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSearchForPeople}
          >
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>

          {isVisible && (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() =>
                navigation.navigate("ChatScreen", {
                  participants: participants,
                  chatType: "GROUP",
                })
              }
            >
              <Text style={styles.buttonText}>Session Chat</Text>
            </TouchableOpacity>
          )}
        </View>
        <Modal
          visible={isQRCodeModalVisible}
          transparent={true}
          onRequestClose={handleCloseModal}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Add a semi-transparent black background
            }}
          >
            <View
              style={{
                padding: 20,
                backgroundColor: "#fff",
                borderRadius: 10,
              }}
            >
              <QRCode value={qrCodeData} size={300} />
              <TouchableOpacity
                style={{
                  marginTop: 20,
                  padding: 10,
                  backgroundColor: "#ff0000",
                  borderRadius: 5,
                }}
                onPress={handleCloseModal}
              >
                <Text style={{ color: "#fff" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default SessionHomeScreen;
