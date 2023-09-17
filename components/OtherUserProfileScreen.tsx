import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Pressable, Linking } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getSessionData, getParticipantVisibility } from "./SessionManager";
import styles, { palette, fonts } from "./style";
import { useAuth } from "../QueryCaching";
import { useLog } from "../CrowdSyncLogManager";

const OtherUserProfileScreen = () => {
  const navigation = useNavigation(); // Get navigation instance
  const route = useRoute(); // Get route object
  const { fetchUserProfileImage } = useAuth();
  const [profilePictureUri, setProfilePictureUri] = useState("");
  const log = useLog();

  const { userData, sessionId } = route.params;

  log.debug('OtherUserProfileScreen on userData: ' + userData + ' and sessionId: ' + sessionId);

  const [showLocationButton, setShowLocationButton] = useState(false);
  const [visible, setVisible] = useState(false);

    useEffect(() => {
        async function getProfileImageUri() {
           let profilePicture;
            if (userData.userId === "1" || userData.userId === "2" || userData.userId === "3" || userData.userId === "4" || userData.userId === "5") {
                profilePicture = userData.profilePicture;
            } else {
                profilePicture = await fetchUserProfileImage(userData.identityId, userData.profilePicture, log);
               }
               log.debug('getProfileImageUri results: ', profilePicture);
            setProfilePictureUri(profilePicture);
        }

        async function getVisibility() {
            let visible;
        if (userData.userId === "1" || userData.userId === "2" || userData.userId === "3" || userData.userId === "4" || userData.userId === "5") {
            visible = true;
            if (userData.userId == "3") {
                visible = false;
            }
        } else {
            visible = await getParticipantVisibility(userData.userId, sessionId, log);
           }
           log.debug('getVisibility results: ', visible);
           setVisible(visible);
        }

        getVisibility();
        getProfileImageUri();
    }, []);

useEffect(() => {
    async function checkSessionId() {
    log.debug('checkSessionId...');
      try {
        const currentUserSessionData = await getSessionData(log);
        log.debug('currentUserSessionData: ', currentUserSessionData);
        if (sessionId === currentUserSessionData.sessionId && sessionId !== "INACTIVE") {
          setShowLocationButton(true);
          log.debug('showLocationButton is true');
        } else {
          setShowLocationButton(false);
          log.debug('showLocationButton is false');
        }
      } catch (error) {
        console.error("Error fetching current user's sessionId:", error);
        log.error("Error fetching current user's sessionId:", error);
        setShowLocationButton(false); // Handle the error by not showing the button
      }
    }

    checkSessionId();
  }, [sessionId]);

  const handleLinkPress = (url) => {
    log.debug('handleLinkPress on url: ', url);
      if (url) {
        Linking.openURL(url).catch((err) =>
          log.error("Error opening URL:", err)
        );
      }
    };

  const renderSocialLinks = (socialLinks) => {
    if (socialLinks && socialLinks.length > 0) {
      return socialLinks.map((link, index) => (
        <TouchableOpacity key={index} onPress={() => handleLinkPress(link)}>
          <Text style={styles.detailText}>{link}</Text>
        </TouchableOpacity>
      ));
    } else {
      return <Text style={styles.detailText}>No social links available.</Text>;
    }
  };

  // Function to handle opening the chat (you can implement your chat logic here)
  const handleChatPress = () => {
  log.debug('handleChatPress on participants: ' + [userData] + ' and chatType: INDIVIDUAL');
    // Implement your chat logic here
    navigation.navigate("ChatScreen", {
      participants: [userData],
      chatType: "INDIVIDUAL",
    });
  };

  const handleLocationPress = () => {
    log.debug('handleLocationPress on userData: ' + userData + ' and sessionId: ' + sessionId);
      // Implement your chat logic here
      navigation.navigate("UserLocation", { userData: userData, sessionId: sessionId });
    };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.index}>
        <View style={styles.div}>
          {/* Profile Picture */}
          {profilePictureUri !== '' ? (
            <Image
              source={{ uri: profilePictureUri }}
              style={{
                width: 350,
                height: 350,
                borderRadius: 100,
                resizeMode: "contain",
              }}
            />
          ) : <View style={{ width: 350, height: 350 }}/>}

          {/* User's Name */}
          <View style={{ alignItems: "center" }}>
            <Text style={styles.headerTitle}>{userData.fullName}</Text>
          </View>

          {/* Job Title and Company */}
          {userData.jobTitle || userData.company ? (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.secondaryHeaderTitle}>
                {userData.jobTitle}
                {userData.jobTitle && userData.company ? ", " : ""}
                {userData.company}
              </Text>
            </View>
          ) : null}

          {/* Location and Phone Number */}
          {userData.jobTitle || userData.company ? (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.secondaryHeaderTitle}>
                {userData.location}
                {userData.location && userData.phoneNumber ? ", " : ""}
                {userData.phoneNumber}
              </Text>
            </View>
          ) : null}

          {/* Social URLs */}
          <View style={styles.linksContainer}>
            <Text style={styles.secondaryHeaderTitle}>Social Links:</Text>
            {renderSocialLinks(userData.socialLinks)}
          </View>

          {/* User's Tags */}
          <View>
            <Text style={styles.secondaryHeaderTitle}>My Tags:</Text>
            <Text style={styles.detailText}>
              {userData.tags && userData.tags.length > 0
                ? userData.tags.map((tag, index) =>
                    index === userData.tags.length - 1
                      ? tag.tag
                      : tag.tag + ", "
                  )
                : "No tags available."}
            </Text>
          </View>

          {/* Chat Button */}
          <View style={{ paddingVertical: 10 }} />
          <Pressable style={styles.basicButton} onPress={handleChatPress}>
            <Text style={styles.buttonText}>Chat</Text>
          </Pressable>

            {showLocationButton && visible && (
                <View style={{ paddingVertical: 10 }}>
                  <Pressable style={styles.basicButton} onPress={handleLocationPress}>
                    <Text style={styles.buttonText}>Location</Text>
                  </Pressable>
                </View>
              )}
        </View>
      </View>
    </ScrollView>
  );
};

export default OtherUserProfileScreen;
