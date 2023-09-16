// ProfileScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../QueryCaching";
import MyConnections from "./MyConnections";
import { getParticipants } from "../src/graphql/queries";
import { Storage } from "aws-amplify";
import { updateParticipants } from "../src/graphql/mutations";
import styles, { palette, fonts } from "./style";
import { useLog } from "../CrowdSyncLogManager";

const ProfileScreen = ({ route }) => {
  // Extract the user information passed as props from the route object
  const { userProfileData } = route.params;
  const { logout, fetchUserProfileImage } = useAuth();
  const navigation = useNavigation();
  const [profilePictureUri, setProfilePictureUri] = useState("");
  const log = useLog();

  log.debug('ProfileScreen on userProfileData: ', JSON.stringify(userProfileData));

useEffect(() => {
    async function getProfileImageUri() {
        const profilePicture = await fetchUserProfileImage(userProfileData.identityId, userProfileData.profilePicture, log);
        log.debug('getProfileImageUri results: ', profilePicture);
        setProfilePictureUri(profilePicture);
    }

    getProfileImageUri();
}, []);

  const handleLogout = () => {
  log.debug('Logging out and navigating to Login screen...');
    logout(log);
    navigation.navigate("Login");
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

  const handleMyConnectionsPress = () => {
    log.debug('handleMyConnectionsPress on userProfileData: ', userProfileData);
    // Navigate to the ProfileScreen and pass the user data as params
    navigation.navigate("MyConnections", { userProfileData });
  };

  const handleEditProfilePress = () => {
  log.debug('handleEditProfilePress on userProfileData: ', userProfileData);
    navigation.navigate("EditProfile", { userProfileData, updatedTags: userProfileData.tags });
  };

  const handleLinkPress = (url) => {
    log.debug('handleLinkPress on url: ', url);
    if (url) {
      Linking.openURL(url).catch((err) =>
        log.error("Error opening URL:", err)
      );
    }
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

          {/* Full Name */}
          <View style={{ alignItems: "center" }}>
            <Text style={styles.headerTitle}>{userProfileData.fullName}</Text>
          </View>

          {/* Job Title and Company */}
          {userProfileData.jobTitle || userProfileData.company ? (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.secondaryHeaderTitle}>
                {userProfileData.jobTitle}
                {userProfileData.jobTitle && userProfileData.company
                  ? ", "
                  : ""}
                {userProfileData.company}
              </Text>
            </View>
          ) : null}

          {/* Location and Phone Number */}
          {userProfileData.jobTitle || userProfileData.company ? (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.secondaryHeaderTitle}>
                {userProfileData.location}
                {userProfileData.location && userProfileData.phoneNumber
                  ? ", "
                  : ""}
                {userProfileData.phoneNumber}
              </Text>
            </View>
          ) : null}

          {/* Render Social Links */}
          <View style={styles.linksContainer}>
            <Text style={styles.secondaryHeaderTitle}>Social Links:</Text>
            {renderSocialLinks(userProfileData.socialLinks)}
          </View>

          {/* My Tags */}
          <View>
            <Text style={styles.secondaryHeaderTitle}>My Tags:</Text>
            <Text style={styles.detailText}>
              {userProfileData.tags && userProfileData.tags.length > 0
                ? userProfileData.tags.map((tag, index) =>
                    index === userProfileData.tags.length - 1
                      ? tag.tag
                      : tag.tag + ", "
                  )
                : "No tags available."}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.basicButton}
              onPress={handleEditProfilePress}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </Pressable>
            <View style={{ paddingVertical: 10 }} />

            <Pressable
              style={styles.basicButton}
              onPress={handleMyConnectionsPress}
            >
              <Text style={styles.buttonText}>My Connections</Text>
            </Pressable>
            <View style={{ paddingVertical: 10 }} />

            <Pressable style={styles.basicButton} onPress={handleLogout}>
              <Text style={styles.buttonText}>Log Out</Text>
            </Pressable>
            <View style={{ paddingVertical: 10 }} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
