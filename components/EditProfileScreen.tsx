// EditProfileScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../QueryCaching";
import MyConnections from "./MyConnections";
import { getParticipants } from "../src/graphql/queries";
import { Storage } from "aws-amplify";
import {
  updateParticipants,
  updateUserProfile,
} from "../src/graphql/mutations";
import { launchImageLibrary } from "react-native-image-picker";
import styles, { palette, fonts } from "./style";

const EditProfileScreen = ({ route }) => {
  // Extract the user information passed as props from the route object
  const { userProfileData, updatedTags } = route.params;
  const [currTags, setCurrTags] = useState(userProfileData.tags);
  const {
    uploadImageToS3,
    updateUserProfileTable,
    createUserTagsWithSession,
    removeUserTagsByTagId,
  } = useAuth();
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
    socialLinks: userProfileData.socialLinks || [],
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
    navigation.navigate("AddTags", { userProfileData });
  };

  const handleSocialLinkChange = (index, value) => {
    const updatedLinks = [...editableFields.socialLinks];
    updatedLinks[index] = value;
    setEditableFields({ ...editableFields, socialLinks: updatedLinks });
  };

  const handleDeleteSocialLink = (index) => {
    const updatedLinks = [...editableFields.socialLinks];
    updatedLinks.splice(index, 1); // Remove the link at the given index
    setEditableFields({ ...editableFields, socialLinks: updatedLinks });
  };

  const handleProfilePicturePress = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
      },
      (response) => {
        if (!response.didCancel && !response.error) {
          setProfilePictureUri(response["assets"][0].uri);
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

      const newProfilePictureUri =
        profilePictureUri !== null
          ? profilePictureUri
          : userProfileData?.profilePictureUri;

      const updatedFields = {
        userId: editableFields.userId,
        fullName: editableFields.fullName,
        jobTitle: editableFields.jobTitle,
        address: editableFields.address,
        phoneNumber: editableFields.phoneNumber,
        profilePicture: profilePictureName || editableFields.profilePicture,
        socialLinks: editableFields.socialLinks,
      };

      const updatedUserData = await updateUserProfileTable(updatedFields);

      const newTags = currTags.filter(
        (currTag) =>
          !userProfileData.tags.some(
            (userTag) => userTag.tagId === currTag.tagId
          )
      );

      const removedTags = userProfileData.tags.filter(
        (userTag) =>
          !currTags.some((currTag) => currTag.tagId === userTag.tagId)
      );

      const addedTags = await createUserTagsWithSession(
        userProfileData.userId,
        userProfileData.sessionId,
        newTags
      );
      let combinedTags = [...userProfileData.tags, ...addedTags];

      const tagIds = removedTags;
      await removeUserTagsByTagId(
        userProfileData.userId,
        userProfileData.sessionId,
        tagIds
      );

      removedTags.forEach((removedTag) => {
        combinedTags = combinedTags.filter(
          (tag) => tag.tagId !== removedTag.tagId
        );
      });

      updatedUserData.profilePictureUri = newProfilePictureUri;
      updatedUserData.tags = combinedTags;

      alert("Changes saved successfully!");
      navigation.navigate("Profile", { userProfileData: updatedUserData });
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }} // Set the flex property to 1 to fill the available space
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior based on platform
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.index}>
          <View style={styles.div}>
            <TouchableOpacity onPress={handleProfilePicturePress}>
              <Image
                source={{
                  uri: profilePictureUri || userProfileData?.profilePictureUri,
                }}
                style={{
                  width: 350,
                  height: 350,
                  borderRadius: 100,
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>

            {/* Full Name */}
            <View>
              <Text style={styles.secondaryHeaderTitle}>Full Name:</Text>
              <TextInput
                style={styles.textInput}
                value={editableFields.fullName}
                onChangeText={(text) =>
                  setEditableFields({ ...editableFields, fullName: text })
                }
              />
            </View>

            {/* Job Title */}
            <View>
              <Text style={styles.secondaryHeaderTitle}>Job Title:</Text>
              <TextInput
                style={styles.textInput}
                value={editableFields.jobTitle}
                onChangeText={(text) =>
                  setEditableFields({ ...editableFields, jobTitle: text })
                }
              />
            </View>

            {/* Address */}
            <View>
              <Text style={styles.secondaryHeaderTitle}>Address:</Text>
              <TextInput
                style={styles.textInput}
                value={editableFields.address}
                onChangeText={(text) =>
                  setEditableFields({ ...editableFields, address: text })
                }
              />
            </View>

            {/* Phone Number */}
            <View>
              <Text style={styles.secondaryHeaderTitle}>Phone Number:</Text>
              <TextInput
                style={styles.textInput}
                value={editableFields.phoneNumber}
                onChangeText={(text) =>
                  setEditableFields({ ...editableFields, phoneNumber: text })
                }
              />
            </View>

            {/* Social Links */}
            <View>
              <Text style={styles.secondaryHeaderTitle}>Social Links:</Text>
              {editableFields.socialLinks.map((link, index) => (
                <View key={index}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Add a link"
                    placeholderTextColor="#2a2e30"
                    value={link}
                    onChangeText={(text) => handleSocialLinkChange(index, text)}
                  />
                  <TouchableOpacity
                    style={{ position: "absolute", right: 10, top: -17 }}
                    onPress={() => handleDeleteSocialLink(index)}
                  >
                    <Text style={{ color: "red", fontSize: 50 }}>-</Text>
                  </TouchableOpacity>
                  <View style={{ paddingVertical: 5 }} />
                </View>
              ))}
              {editableFields.socialLinks.length < 5 && (
                <TouchableOpacity onPress={handleAddSocialLink}>
                  <Text
                    style={{
                      color: palette.tertiaryColor,
                      textAlign: "left",
                      marginTop: 3,
                    }}
                  >
                    Add Link
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* My Tags */}
            <View>
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
                <Pressable style={styles.basicButton} onPress={handleAddTags}>
                  <Text style={styles.buttonText}>Add/Remove Tag</Text>
                </Pressable>
                <View style={{ paddingVertical: 10 }} />

                <Pressable
                  style={styles.basicButton}
                  onPress={handleSaveChanges}
                >
                  <Text style={styles.buttonText}>Save Changes</Text>
                </Pressable>
                <View style={{ paddingVertical: 10 }} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;
