// ProfileScreen.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, Button, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../QueryCaching";
import MyConnections from "./MyConnections";
import { getParticipants } from '../src/graphql/queries';
import { updateParticipants, updateUserProfile } from '../src/graphql/mutations';

const ProfileScreen = ({ route }) => {
  // Extract the user information passed as props from the route object
  const { userProfileData } = route.params;
  const { logout } = useAuth();
  const navigation = useNavigation();

  const [editableFields, setEditableFields] = useState({
      fullName: userProfileData.fullName,
      jobTitle: userProfileData.jobTitle,
      address: userProfileData.address,
      phoneNumber: userProfileData.phoneNumber,
    });

  const handleLogout = () => {
    logout();
    navigation.navigate("Login");
  };

  const handleMyConnectionsPress = () => {
    // Navigate to the ProfileScreen and pass the user data as params
    navigation.navigate("MyConnections", { userProfileData });
  };

  const handleSaveChanges = () => {
      // Update DynamoDB table with editableFields data
      // You would need to implement this part using your GraphQL mutations

      // For example:
      // const updatedUserProfile = await API.graphql(graphqlOperation(updateUserProfile, {
      //   input: {
      //     userId: userProfileData.userId,
      //     fullName: editableFields.fullName,
      //     jobTitle: editableFields.jobTitle,
      //     address: editableFields.address,
      //     phoneNumber: editableFields.phoneNumber,
      //   }
      // }));

      // Update the userProfileData in the state with the new values
      // setUserProfileData(updatedUserProfile);

      // You can also display a success message to the user
      // alert("Profile updated successfully!");
    };

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <View style={styles.profilePictureContainer}>
        {/* Add your profile picture component here */}
      </View>

      {/* Full Name */}
      <Text style={styles.fullName}>{userProfileData.fullName}</Text>

      {/* Job Title */}
      <Text style={styles.infoText}>Job Title: {userProfileData.jobTitle}</Text>

      {/* Address */}
      <Text style={styles.infoText}>Location: {userProfileData.address}</Text>

      {/* Phone Number */}
      <Text style={styles.infoText}>Phone Number: {userProfileData.phoneNumber}</Text>

      {/* Links to URLs */}
      <View style={styles.linksContainer}>
        {/* Add rows of links to URLs here */}
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
        {/* Add a button for adding tags */}
        <Button title="Add Tag" onPress={() => {}} />
      </View>

      <Button title="Save Changes" onPress={handleSaveChanges} />

      {/* My Connections Button */}
      <Button title="My Connections" onPress={handleMyConnectionsPress} />

      <Button title="Log Out" onPress={logout} />
    </View>
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
