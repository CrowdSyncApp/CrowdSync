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
import { launchImageLibrary } from "react-native-image-picker";
import styles, { palette, fonts } from "./style";
import { getSessionData } from "./SessionManager";
import { useLog } from "../CrowdSyncLogManager";

const EditProfileScreen = ({ route }) => {
  // Extract the user information passed as props from the route object
  const { userProfileData, updatedTags } = route.params;
  const [currTags, setCurrTags] = useState(userProfileData.tags);
  const {
    uploadImageToS3,
    updateUserProfileTable,
    addUserTags,
    removeUserTagsByTagId,
    fetchUserProfileImage,
  } = useAuth();
  const log = useLog();
  const navigation = useNavigation();

  log.debug(
    "Entering EditProfileScreen screen with userProfileData: " +
      JSON.stringify(userProfileData) +
      " and updatedTags: " +
      JSON.stringify(updatedTags)
  );

  useEffect(() => {
    async function getProfileImageUri() {
      const profilePicture = await fetchUserProfileImage(
        userProfileData.identityId,
        userProfileData.profilePicture,
        log
      );
      log.debug("profilePictureUri: ", JSON.stringify(profilePicture));
      setProfilePictureUri(profilePicture);
    }

    getProfileImageUri();
  }, [userProfileData]);

  useEffect(() => {
    if (updatedTags) {
      log.debug("currTags: ", JSON.stringify(updatedTags));
      setCurrTags(updatedTags);
    }
  }, [updatedTags]);

  const [editableFields, setEditableFields] = useState({
    userId: userProfileData.userId,
    fullName: userProfileData.fullName,
    jobTitle: userProfileData.jobTitle,
    location: userProfileData.location,
    phoneNumber: userProfileData.phoneNumber,
    profilePicture: userProfileData.profilePicture,
    socialLinks: userProfileData.socialLinks || [],
  });
  log.debug("default editableFields: ", JSON.stringify(editableFields));
  const [profilePictureUri, setProfilePictureUri] = useState(null);

  const handleAddSocialLink = () => {
    log.debug("Updating social links...");
    if (editableFields.socialLinks.length < 5) {
      setEditableFields({
        ...editableFields,
        socialLinks: [...editableFields.socialLinks, ""],
      });
    }
  };

  const handleAddTags = () => {
    log.debug("handleAddTags...");
    navigation.navigate("AddTags", { userProfileData, currTags });
  };

  const handleSocialLinkChange = (index, value) => {
    log.debug(
      "handleSocialLinkChange on index: " + JSON.stringify(index) + " and value: " + JSON.stringify(value)
    );
    const updatedLinks = [...editableFields.socialLinks];
    updatedLinks[index] = value;
    setEditableFields({ ...editableFields, socialLinks: updatedLinks });
  };

  const handleDeleteSocialLink = (index) => {
    log.debug("handleDeleteSocialLink on index: ", JSON.stringify(index));
    const updatedLinks = [...editableFields.socialLinks];
    updatedLinks.splice(index, 1); // Remove the link at the given index
    setEditableFields({ ...editableFields, socialLinks: updatedLinks });
  };

  const handleProfilePicturePress = () => {
    log.debug("handleProfilePicturePress...");
    launchImageLibrary(
      {
        mediaType: "photo",
      },
      (response) => {
        if (!response.didCancel && !response.error) {
          log.debug("Setting new profilePictureUri...");
          setProfilePictureUri(response["assets"][0].uri);
        }
      }
    );
  };

  const handleSaveChanges = async () => {
    log.debug("handleSaveChanges...");
    let profilePictureName;
    try {
      // Update S3 profile picture if a new one was selected
      if (profilePictureUri) {
        log.debug("New profile picture to save...");
        profilePictureName = await uploadImageToS3(profilePictureUri, log);
      }

      const newProfilePictureUri =
        profilePictureUri !== null
          ? profilePictureUri
          : userProfileData?.profilePictureUri;
      log.debug("newProfilePictureUri: ", JSON.stringify(newProfilePictureUri));

      const updatedFields = {
        userId: editableFields.userId,
        fullName: editableFields.fullName,
        jobTitle: editableFields.jobTitle,
        location: editableFields.location,
        phoneNumber: editableFields.phoneNumber,
        profilePicture: profilePictureName || editableFields.profilePicture,
        socialLinks: editableFields.socialLinks,
      };
      log.debug("updatedFields: ", JSON.stringify(updatedFields));

      const updatedUserData = await updateUserProfileTable(updatedFields, log);

      const newTags = currTags.filter(
        (currTag) =>
          !userProfileData.tags.some(
            (userTag) => userTag.tagId === currTag.tagId
          )
      );
      log.debug("newTags: ", JSON.stringify(newTags));

      const removedTags = userProfileData.tags.filter(
        (userTag) =>
          !currTags.some((currTag) => currTag.tagId === userTag.tagId)
      );
      log.debug("removedTags: ", JSON.stringify(removedTags));
      const sessionData = await getSessionData(log);
      const sessionId = sessionData.sessionId;

      const addedTags = await addUserTags(
        userProfileData.userId,
        newTags,
        updatedUserData.fullName,
        log
      );
      let combinedTags = [...userProfileData.tags, ...addedTags];
      log.debug("combinedTags: ", JSON.stringify(combinedTags));

      const tagIds = removedTags;
      await removeUserTagsByTagId(
        userProfileData.userId,
        tagIds,
        log
      );

      removedTags.forEach((removedTag) => {
        combinedTags = combinedTags.filter(
          (tag) => tag.tagId !== removedTag.tagId
        );
      });

      updatedUserData.profilePictureUri = newProfilePictureUri;
      updatedUserData.tags = combinedTags;
      log.debug("Final updatedUserData: ", JSON.stringify(updatedUserData));

      alert("Changes saved successfully!");
      navigation.navigate("Profile", { userProfileData: updatedUserData });
    } catch (error) {
      console.error("Error saving changes:", error);
      log.error("Error saving changes:", JSON.stringify(error));
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
              {profilePictureUri !== "" ? (
                <Image
                  source={{ uri: profilePictureUri }}
                  style={{
                    width: 350,
                    height: 350,
                    borderRadius: 100,
                    resizeMode: "contain",
                  }}
                />
              ) : (
                <View style={{ width: 350, height: 350 }} />
              )}
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

            {/* Location */}
            <View>
              <Text style={styles.secondaryHeaderTitle}>Location:</Text>
              <TextInput
                style={styles.textInput}
                value={editableFields.location}
                onChangeText={(text) =>
                  setEditableFields({ ...editableFields, location: text })
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
                  {currTags && currTags.length > 0
                    ? currTags.map((tag, index) =>
                        index === currTags.length - 1
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
