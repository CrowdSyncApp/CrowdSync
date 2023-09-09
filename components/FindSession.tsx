import React, { useState, useEffect } from "react";
import {
  Pressable,
  View,
  TextInput,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../QueryCaching";
import { startSession } from "./SessionManager";
import { Auth } from "aws-amplify";
import participantsData from "../dummies/dummy_accounts.json";
import styles, { palette, fonts } from "./style";
import { useHeaderHeight } from "@react-navigation/elements";
import { StatusBar } from "react-native";
import { createTagSet, listTagSets } from "../src/graphql/mutations";

import SampleFindSessionMap from "../images/sample_find_session.png";

const FindSessionScreen = () => {
  const headerHeight = useHeaderHeight();
  // https://github.com/ovr/react-native-status-bar-height <-- Might need for IOS
  const keyboardVerticalOffset = StatusBar.currentHeight + headerHeight;
  const navigation = useNavigation();
  const { user, fetchUserProfileData, populateTagSet } = useAuth();
  const [sessionTitle, setSessionTitle] = useState("General"); // Default title is General

useEffect(() => {
        navigation.addListener('beforeRemove', nav => {
            // Prevent going back
            if (nav.data.action.type === 'GO_BACK') {
              nav.preventDefault();
            }
          });
   }, [navigation]);

  const handleJoinSessionWithQRCode = () => {
    navigation.navigate("QRScanner");
  };

  const handleStartSession = async () => {
    const userProfileData = await fetchUserProfileData(user?.userId);
    const newSession = await startSession(userProfileData, sessionTitle);

    // Check if startSession was successful and navigate to SessionHomeScreen
    if (newSession) {
      navigation.navigate("SessionHome", { sessionData: newSession });
    }
  };

  const handlePopulateTagSet = async () => {
    try {
      // Load CSV, fetch existing tags, filter duplicates, and create new tags
      await populateTagSet();
    } catch (error) {
      console.error("Error populating TagSet table:", error);
    }
  };

  const renderSessionButtons = () => {
    const userGroups =
      user?.signInUserSession?.idToken?.payload["cognito:groups"] || [];

    if (userGroups.includes("CrowdSync_UserPool_Admin")) {
      return (
        <View style={styles.textInputContainer}>
          <View style={{ marginTop: 30 }} />
          <TextInput
            style={styles.textInput}
            placeholder="General"
            value={sessionTitle}
            onChangeText={(text) => setSessionTitle(text)}
          />
          <View style={{ paddingVertical: 10 }} />
          <Pressable style={styles.basicButton} onPress={handleStartSession}>
            <Text style={styles.buttonText}>Start Session</Text>
          </Pressable>
        </View>
      );
    }

    return null;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.index}>
          <View style={styles.div}>
            <Image
              source={SampleFindSessionMap}
              style={styles.findSessionMap}
            />
            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.basicButton}
                onPress={handleJoinSessionWithQRCode}
              >
                <Text style={styles.buttonText}>Join Session with QR Code</Text>
              </Pressable>
              <View style={{ paddingVertical: 10 }} />
              {renderSessionButtons()}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default FindSessionScreen;
