// ProfileScreen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity, Image, ScrollView, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../QueryCaching";
import MyConnections from "./MyConnections";
import { getParticipants } from '../src/graphql/queries';
import { Storage } from "aws-amplify";
import { updateParticipants } from '../src/graphql/mutations';

const ProfileScreen = ({ route }) => {
  // Extract the user information passed as props from the route object
  const { userProfileData } = route.params;
  const { logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    logout();
    navigation.navigate("Login");
  };

  const handleMyConnectionsPress = () => {
    // Navigate to the ProfileScreen and pass the user data as params
    navigation.navigate("MyConnections", { userProfileData });
  };

  const handleEditProfilePress = () => {
      navigation.navigate("EditProfile", { userProfileData });
    };

    const handleLinkPress = (url) => {
        if (url) {
          Linking.openURL(url).catch((err) => console.error("Error opening URL:", err));
        }
      };

  return (
  <ScrollView style={{ flexGrow: 1 }}>
    <View style={styles.container}>
      {/* Profile Picture */}
      <View style={styles.profilePictureContainer}>
      <Image
        source={{ uri: userProfileData?.profilePictureUri }}
        style={{
          width: 350,
          height: 350,
          borderRadius: 100,
          resizeMode: "contain",
        }}
      />
      </View>

      {/* Full Name */}
      <Text style={styles.fullName}>{userProfileData.fullName}</Text>

      {/* Job Title */}
      <Text style={styles.infoText}>Job Title: {userProfileData.jobTitle}</Text>

      {/* Address */}
      <Text style={styles.infoText}>Location: {userProfileData.address}</Text>

      {/* Phone Number */}
      <Text style={styles.infoText}>Phone Number: {userProfileData.phoneNumber}</Text>

      {/* Social Links */}
      <View style={styles.linksContainer}>
        <Text style={styles.linksHeader}>Social Links:</Text>
        {userProfileData.socialLinks ? (
          userProfileData.socialLinks.map((link, index) => (
            <TouchableOpacity key={index} onPress={() => handleLinkPress(link)}>
              <Text style={styles.linkText}>{link}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No social links available.</Text>
        )}
      </View>

      {/* My Tags */}
      <View style={styles.tagsContainer}>
        <Text style={styles.tagsHeader}>My Tags:</Text>
        {/* Check if userProfileData.tags is defined */}
        {userProfileData.tags ? (
          // Render list of tags
          userProfileData.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text>{tag}</Text>
            </View>
          ))
        ) : (
          // Display an empty list of tags
          <Text>No tags available.</Text>
        )}
      </View>

      <Button title="Edit Profile" onPress={handleEditProfilePress} />

      {/* My Connections Button */}
      <Button title="My Connections" onPress={handleMyConnectionsPress} />

      <Button title="Log Out" onPress={handleLogout} />
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profilePictureContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  fullName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  linksContainer: {
    marginBottom: 16,
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tag: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
  },
});

export default ProfileScreen;
