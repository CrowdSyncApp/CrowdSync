// EditProfileScreen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../QueryCaching";
import MyConnections from "./MyConnections";
import { getParticipants } from '../src/graphql/queries';
import { Storage } from "aws-amplify";
import { updateParticipants, updateUserProfile } from '../src/graphql/mutations';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen = ({ route }) => {
  // Extract the user information passed as props from the route object
  const { userProfileData, updatedTags } = route.params;
  const [currTags, setCurrTags] = useState(userProfileData.tags);
  const { uploadImageToS3, updateUserProfileTable, createUserTagsWithSession, removeUserTagsByTagId } = useAuth();
  const navigation = useNavigation();

    useEffect(() => {
        if (updatedTags) {
          setCurrTags(updatedTags);
        }
      }, [updatedTags]);

  const [editableFields, setEditableFields] = useState({
      userId: userProfileData.userId,
      fullName: userProfileData.fullName,
      jobTitle: userProfileData.jobTitle,
      address: userProfileData.address,
      phoneNumber: userProfileData.phoneNumber,
      profilePicture: userProfileData.profilePicture,
      socialLinks: userProfileData.socialLinks || []
    });
    const [profilePictureUri, setProfilePictureUri] = useState(null);

    const handleAddSocialLink = () => {
        if (editableFields.socialLinks.length < 5) {
          setEditableFields({
            ...editableFields,
            socialLinks: [...editableFields.socialLinks, ""],
          });
        }
      };

      const handleAddTags = () => {
        navigation.navigate('AddTags', { userProfileData });
      };

      const handleSocialLinkChange = (index, value) => {
          const updatedLinks = [...editableFields.socialLinks];
          updatedLinks[index] = value;
          setEditableFields({ ...editableFields, socialLinks: updatedLinks });
        };

  const handleProfilePicturePress = () => {
    launchImageLibrary({
            mediaType: 'photo',
          }, (response) => {
            if (!response.didCancel && !response.error) {
              setProfilePictureUri(response['assets'][0].uri);
            }
          }
        );
  };

  const handleSaveChanges = async () => {
        let profilePictureName;
      try {
            // Update S3 profile picture if a new one was selected
            if (profilePictureUri) {
              profilePictureName = await uploadImageToS3(profilePictureUri);
            }

            const newProfilePictureUri = profilePictureUri !== null ? profilePictureUri : userProfileData?.profilePictureUri;

            const updatedFields = {
                  userId: editableFields.userId,
                  fullName: editableFields.fullName,
                  jobTitle: editableFields.jobTitle,
                  address: editableFields.address,
                  phoneNumber: editableFields.phoneNumber,
                  profilePicture: profilePictureName || editableFields.profilePicture,
                  socialLinks: editableFields.socialLinks
                };

            const updatedUserData = await updateUserProfileTable(updatedFields);

            const newTags = currTags.filter(currTag => !userProfileData.tags.some(userTag => userTag.tagId === currTag.tagId));

            const removedTags = userProfileData.tags.filter(userTag => !currTags.some(currTag => currTag.tagId === userTag.tagId));

            const addedTags = await createUserTagsWithSession(userProfileData.userId, userProfileData.sessionId, newTags);
            let combinedTags = [...userProfileData.tags, ...addedTags];

            const tagIds = removedTags;
            await removeUserTagsByTagId(userProfileData.userId, userProfileData.sessionId, tagIds);

            removedTags.forEach(removedTag => {
                  combinedTags = combinedTags.filter(tag => tag.tagId !== removedTag.tagId);
                });

            updatedUserData.profilePictureUri = newProfilePictureUri;
            updatedUserData.tags = combinedTags;

            alert("Changes saved successfully!");
            navigation.navigate('Profile', { userProfileData: updatedUserData });
          } catch (error) {
            console.error("Error saving changes:", error);
          }
    };

  return (
  <KeyboardAvoidingView
          style={{ flex: 1 }} // Set the flex property to 1 to fill the available space
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
        >
  <ScrollView style={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.profilePictureContainer}>
            <TouchableOpacity onPress={handleProfilePicturePress}>
              <Image
                source={{ uri: profilePictureUri || userProfileData?.profilePictureUri }}
                style={{
                  width: 350,
                  height: 350,
                  borderRadius: 100,
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>
          </View>

          {/* Full Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldTitle}>Full Name:</Text>
            <TextInput
              style={styles.editableField}
              value={editableFields.fullName}
              onChangeText={(text) => setEditableFields({ ...editableFields, fullName: text })}
            />
          </View>

          {/* Job Title */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldTitle}>Job Title:</Text>
            <TextInput
              style={styles.editableField}
              value={editableFields.jobTitle}
              onChangeText={(text) => setEditableFields({ ...editableFields, jobTitle: text })}
            />
          </View>

          {/* Address */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldTitle}>Address:</Text>
            <TextInput
              style={styles.editableField}
              value={editableFields.address}
              onChangeText={(text) => setEditableFields({ ...editableFields, address: text })}
            />
          </View>

          {/* Phone Number */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldTitle}>Phone Number:</Text>
            <TextInput
              style={styles.editableField}
              value={editableFields.phoneNumber}
              onChangeText={(text) => setEditableFields({ ...editableFields, phoneNumber: text })}
            />
          </View>

      {/* Social Links */}
        <View style={styles.linksContainer}>
          <Text style={styles.linksHeader}>Social Links:</Text>
          {editableFields.socialLinks.map((link, index) => (
            <View key={index} style={styles.linkInputContainer}>
              <TextInput
                style={styles.linkInput}
                placeholder="Add a social link"
                value={link}
                onChangeText={(text) => handleSocialLinkChange(index, text)}
              />
            </View>
          ))}
          {editableFields.socialLinks.length < 5 && (
            <TouchableOpacity onPress={handleAddSocialLink}>
              <Text style={styles.addLinkButton}>Add Link</Text>
            </TouchableOpacity>
          )}
        </View>

      {/* My Tags */}
      <View style={styles.tagsContainer}>
        <Text style={styles.tagsHeader}>My Tags:</Text>
        {currTags.length > 0 ? (
          // Render list of tags
          currTags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text>{tag.tag}</Text>
            </View>
          ))
        ) : (
          // Display an empty list of tags
          <Text>No tags available.</Text>
        )}
        {/* Add a button for adding tags */}
        <Button title="Add/Remove Tag" onPress={handleAddTags} />
      </View>

      <Button title="Save Changes" onPress={handleSaveChanges} />
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
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
