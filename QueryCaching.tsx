import { createContext, useContext, useEffect, useState } from "react";
import { Auth, API, Storage, Hub, graphqlOperation } from "aws-amplify";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserProfile, listTagSets } from "./src/graphql/queries";
import { v4 } from 'uuid';
import { updateParticipants, updateUserProfile, createTagSet } from './src/graphql/mutations';
import skillsJson from './data/skills.json';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

async function fetchUserProfileImage(profilePictureFilename) {
    let getLevel;
  try {

    getLevel = 'private';
    if (!profilePictureFilename) {
        // Default image
        profilePictureFilename = "CrowdSync_Temp_Profile.png";
        getLevel = 'public';
    }
    profilePictureFilename = "CrowdSync_Temp_Profile.png";  // TODO remove, temporary
    getLevel = 'public';  // TODO remove, temporary

    // Fetch the profile image URL from S3 using Amplify's Storage API
     const imageKey = await Storage.get(profilePictureFilename, {level: getLevel, validateObjectExistence: true});

    return imageKey;
  } catch (error) {
    console.error("Error fetching profile image:", error);
    throw error;
  }
}

async function fetchUserProfile(userId) {
  try {
    const cachedUserProfile = await AsyncStorage.getItem("userProfileData");
    //if (cachedUserProfile) {
    //      return JSON.parse(cachedUserProfile);
   // }

    const { data } = await API.graphql(
      graphqlOperation(getUserProfile, { userId })
    );

    if (data && data.getUserProfile) {

        if (!data.getUserProfile.profilePictureUri) {
           const profileImage = await fetchUserProfileImage(data.getUserProfile.profilePicture);
           data.getUserProfile.profilePictureUri = profileImage;
       }

      await AsyncStorage.setItem("userProfileData", JSON.stringify(data.getUserProfile));

      return data.getUserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

async function fetchUser() {
  try {
    const storedUser = await Auth.currentAuthenticatedUser();
    return storedUser;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

async function login(credentials) {
  try {
    const user = await Auth.signIn(credentials.username, credentials.password);
    return user;
  } catch (error) {
    if (error.message === 'User is not confirmed.') {
        alert("Please verify your account before logging in.");
    } else {
        alert("Invalid email or password. Please try again.");
    }
    throw error;
  }
}

async function logout() {
  try {
    const response = await Auth.signOut();
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

const populateTagSet = async () => {
  try {
    const batchSize = 25; // Set the batch size according to your needs

    const tagRows = skillsJson.map(row => ({
      tag: row.tag.trim(),
      tagId: row.tagId.trim()
    }));

    const existingTagsResponse = await API.graphql(graphqlOperation(listTagSets));
    const existingTags = existingTagsResponse.data.listTagSets.items.map(item => item.tag);

    const newTags = tagRows.filter(tagData => !existingTags.includes(tagData.tag));

    console.log(`Total new tags to add: ${newTags.length}`);

    const tagBatches = [];
    for (let i = 0; i < newTags.length; i += batchSize) {
      tagBatches.push(newTags.slice(i, i + batchSize));
    }

    const delayBetweenBatchesMs = 1000;
    const maxRetries = 3;
    for (let batchIndex = 0; batchIndex < tagBatches.length; batchIndex++) {
      let retryAttempts = 0;

      while (retryAttempts < maxRetries) {
        try {
          const batch = tagBatches[batchIndex];
          console.log(`Processing batch ${batchIndex + 1} of ${tagBatches.length}`);

          const batchCreatePromises = batch.map(async tagData => {
            const input = {
              tag: tagData.tag,
              tagId: tagData.tagId, // Make sure this matches your GraphQL schema
            };

            // Retry logic: Regenerate a new tagId on each retry attempt
            if (retryAttempts > 0) {
              input.tagId = generateNewTagId(); // Replace with your UUID generation logic
            }

            return API.graphql(graphqlOperation(createTagSet, { input }));
          });

          await Promise.all(batchCreatePromises);

          console.log(`Batch ${batchIndex + 1} of ${tagBatches.length} completed`);

          // Add a delay between batches
          if (batchIndex < tagBatches.length - 1) {
            console.log(`Waiting for ${delayBetweenBatchesMs / 1000} seconds before the next batch...`);
            await new Promise(resolve => setTimeout(resolve, delayBetweenBatchesMs));
          }

          break; // Exit the retry loop if successful
        } catch (error) {
          console.error(`Error processing batch ${batchIndex + 1}, retrying...`);
          retryAttempts++;
          await new Promise(resolve => setTimeout(resolve, delayBetweenBatchesMs));
        }
      }

      if (retryAttempts === maxRetries) {
        console.error(`Max retries reached for batch ${batchIndex + 1}, skipping...`);
      }
    }

    console.log(`Successfully added ${newTags.length} new tags.`);
  } catch (error) {
    console.error("Error populating TagSet table:", error);
  }
};

async function uploadImageToS3(profilePictureUri) {
    const filename = v4() + '_profilePhoto.jpeg';
    const response = await fetch(profilePictureUri);

    const profilePictureS3Uri = await Storage.put(filename, response.blob(), {level: 'private', contentType: 'image/jpeg'});

    return filename;
}

async function updateUserProfileTable(updatedFields) {
    const updatedUserProfile = await API.graphql(graphqlOperation(updateUserProfile, {input: updatedFields}));
    await AsyncStorage.removeItem("userProfileData");
    return updatedUserProfile.data.updateUserProfile;
}

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
      const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
        const fetchUserData = async () => {
          try {
            const storedUser = await Auth.currentAuthenticatedUser();
            setUser(storedUser);
          } catch (error) {
            setUser(null);
          }
          setIsLoading(false);
        };

        fetchUserData();

        const authListener = (data) => {
          switch (data.payload.event) {
            case 'signIn':
              fetchUserData();
              break;
            case 'signOut':
              setUser(null);
              break;
            default:
              break;
          }
        };

        Hub.listen('auth', authListener);

        return () => Hub.remove('auth', authListener);
      }, []);

      const isUserLoggedIn = user !== null;

  const fetchUserProfileData = async () => {
    if (user && user.username) {
      const userProfileData = await fetchUserProfile(user.username);
      return userProfileData;
    }
    return null;
  };

  const refreshToken = async () => {
    try {
      // Refresh the user's tokens
      await Auth.refreshSession();
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    uploadImageToS3,
    populateTagSet,
    updateUserProfileTable,
    fetchUserProfileData,
    refreshToken,
    isUserLoggedIn
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
