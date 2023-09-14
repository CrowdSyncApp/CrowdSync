import { PermissionsAndroid, Platform } from 'react-native';
import { createContext, useContext, useEffect, useState } from "react";
import { Auth, API, Storage, Hub, graphqlOperation } from "aws-amplify";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getUserProfiles,
  listTagSets,
  listUserTags,
  getTagSet,
  listConnections,
} from "./src/graphql/queries";
import { getSessionIdForUser } from "./components/SessionManager";
import { v4 } from "uuid";
import {
getParticipants,
updateUserProfiles,
  createTagSet,
  createUserTags,
  deleteUserTags,
  createOrUpdateLocations,
} from "./src/graphql/mutations";
import Geolocation from 'react-native-geolocation-service';
import skillsJson from "./data/new_skills.json";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

async function storeInterval(intervalId) {
  try {
    // Retrieve the existing list of intervalIds from AsyncStorage (if any)
    const existingIntervalIdsJson = await AsyncStorage.getItem('intervalIds');
    const existingIntervalIds = existingIntervalIdsJson ? JSON.parse(existingIntervalIdsJson) : [];

    // Add the new intervalId to the list
    existingIntervalIds.push(intervalId);

    // Convert the updated list back to JSON and store it in AsyncStorage
    await AsyncStorage.setItem('intervalIds', JSON.stringify(existingIntervalIds));

    console.log(`Interval with ID ${intervalId} stored successfully.`);
  } catch (error) {
    console.error('Error storing interval ID:', error);
  }
}

async function clearAllIntervals() {
  try {
    // Retrieve the list of intervalIds from AsyncStorage
    const intervalIdsJson = await AsyncStorage.getItem('intervalIds');
    const intervalIds = intervalIdsJson ? JSON.parse(intervalIdsJson) : [];

    // Clear each interval using clearInterval
    intervalIds.forEach((intervalId) => {
      clearInterval(intervalId);
      console.log(`Interval with ID ${intervalId} cleared.`);
    });

    // Clear the list of intervalIds from AsyncStorage
    await AsyncStorage.removeItem('intervalIds');

    console.log('All intervals cleared.');
  } catch (error) {
    console.error('Error clearing intervals:', error);
  }
}

async function fetchUserProfileImage(identityId, profilePictureFilename) {
  let getLevel;
  try {
    getLevel = "protected";
    if (!profilePictureFilename) {
      // Default image
      profilePictureFilename = "CrowdSync_Temp_Profile.png";
      getLevel = "public";
    }
    const id = "us-west-1:" + identityId;  // TODO later might need to automate getting the region

    // Fetch the profile image URL from S3 using Amplify's Storage API
    const imageKey = await Storage.get(profilePictureFilename, {
      level: getLevel,
      validateObjectExistence: true,
      identityId: id,
    });

    return imageKey;
  } catch (error) {
    console.error("Error fetching profile image:", error);
    profilePictureFilename = "CrowdSync_Temp_Profile.png";
    const imageKey = await Storage.get(profilePictureFilename, {
          level: "public",
          validateObjectExistence: true,
        });
    return imageKey;
  }
}

async function fetchUserProfile(userId) {
  try {
    const cachedUserProfile = await AsyncStorage.getItem("userProfileData");
    if (cachedUserProfile) {
      return JSON.parse(cachedUserProfile);
    }

    const { data } = await API.graphql(
      graphqlOperation(getUserProfiles, { userId })
    );

    if (data && data.getUserProfiles) {

        let identityId;
      if (!data.getUserProfiles.identityId) {
          identityId = await Auth.currentCredentials();
          data.getUserProfiles.identityId = identityId;
            await API.graphql(
                graphqlOperation(updateUserProfiles, { userId, identityId: identityId })
            );
      }

      const currSessionId = await getSessionIdForUser(userId);
      data.getUserProfiles.sessionId = currSessionId;

      const userTags = await getAllUserTags(userId, currSessionId);
      data.getUserProfiles.tags = userTags;

      await AsyncStorage.setItem(
        "userProfileData",
        JSON.stringify(data.getUserProfiles)
      );

      return data.getUserProfiles;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

async function refreshLocation(sessionId) {
  try {
    // Fetch user data
    const user = await fetchUser();

    if (!user || !user.username) {
          console.error("User data or userId is missing.");
          return [];
        }

    const userId = user?.username;

    let granted = false;
    try {
        if (Platform.OS === 'ios') {
          const status = await Geolocation.requestAuthorization('whenInUse');

          if (status === "granted") {
            granted = true;
          } else {
            console.error("Location permission denied");
          }
        } else if (Platform.OS === 'android') {
          // Request location permission using PermissionsAndroid on Android.
          const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );

          if (status === PermissionsAndroid.RESULTS.GRANTED) {
            granted = true;
          } else {
            // Handle permission denied.
            console.error("Location permission denied");
          }
        }
      } catch (error) {
        console.error("Error requesting location permission:", error);
      }

    if (granted === true) {
      // Get current location
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(error),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      });

      const { latitude, longitude } = position.coords;
      const location = {
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      const now = new Date().toISOString();
      const input = {
          userId: userId,
          latitude: location.latitude,
          longitude: location.longitude,
          sessionId: sessionId,
          timestamp: now,
      };

      // Perform GraphQL update operation
      const response = await API.graphql(
        graphqlOperation(createOrUpdateLocations, { input: input })
      );

      return location;
    } else {
      // Handle permission denied
      console.error("Location permission denied");
      return [];
    }
  } catch (error) {
    console.error("Error refreshing location:", error);
    return [];
  }
}

async function getUserProfileFromId(userId) {
try {
    // Make the GraphQL API call to fetch the user profile
    const response = await API.graphql(
      graphqlOperation(getUserProfiles, { userId: userId })
    );

    // Extract the user profile from the response
    const userProfile = response.data.getUserProfiles;

    return userProfile;
  } catch (error) {
    console.error(`Error fetching user profile for userId ${userId}:`, error);
    throw error; // You can handle the error as needed
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
    if (error.message === "User is not confirmed.") {
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
    await AsyncStorage.removeItem("userProfileData");
    await clearAllIntervals();
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

const fetchConnectionsAndProfiles = async (userId) => {
    try {

      // Fetch all connections for the current user
      const connectionsResponse = await API.graphql(
        graphqlOperation(listConnections, {
            filter: {
                userId: { eq: userId },
            },
        })
      );

      // Extract the connections data
      const connections = connectionsResponse.data.listConnections.items;

      // Fetch user profiles for each connection
      const profilesPromises = connections.map(async (connection) => {
        const userProfileResponse = await API.graphql(
          graphqlOperation(getUserProfiles, { userId: connection.otherUserId })
        );

        return userProfileResponse.data.getUserProfiles;
      });

      // Wait for all profile fetches to complete
      const profiles = await Promise.all(profilesPromises);

      return profiles;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
}

const getUserTagsIds = async (userId, sessionId) => {
  try {
    const response = await API.graphql(
      graphqlOperation(listUserTags, {
        filter: {
          userId: { eq: userId },
          sessionId: { eq: sessionId },
        },
      })
    );

    const userTags = response.data.listUserTags.items || [];
    const tagIds = userTags.map((tag) => tag.tagId);
    return tagIds;
  } catch (error) {
    console.error("Error fetching user tags:", error);
    return [];
  }
};

const getAllUserTags = async (userId, sessionId) => {
  try {
    const tagIds = await getUserTagsIds(userId, sessionId);
    const tagSets = await getTagSets();

    const userTagsWithTags = tagIds
      .map((tagId) => tagSets.find((tag) => tag.tagId === tagId))
      .filter((tag) => tag);
    return userTagsWithTags;
  } catch (error) {
    console.error("Error fetching user tags with tags:", error);
    return [];
  }
};

const getTagSets = async () => {
  try {
    // Check if the tag set is already stored in AsyncStorage
    const storedTagSet = await AsyncStorage.getItem("tagSet");
    if (storedTagSet) {
      return JSON.parse(storedTagSet);
    }

    // If not stored, fetch from API and store in AsyncStorage
    const response = await API.graphql(graphqlOperation(listTagSets));
    const tagSets = response.data.listTagSets.items.map((item) => ({
      tag: item.tag,
      tagId: item.tagId,
    }));

    // Store the tag set in AsyncStorage
    await AsyncStorage.setItem("tagSet", JSON.stringify(tagSets));

    return tagSets;
  } catch (error) {
    console.error("Error listing TagSets:", error);
    return [];
  }
};

const populateTagSet = async () => {
  try {
    const batchSize = 25; // Set the batch size according to your needs

    const tagRows = skillsJson.map((row) => ({
      tag: row.tag.trim(),
      tagId: row.tagId.trim(),
    }));

    const existingTagsResponse = await API.graphql(
      graphqlOperation(listTagSets)
    );
    const existingTags = existingTagsResponse.data.listTagSets.items.map(
      (item) => item.tag
    );

    const newTags = tagRows.filter(
      (tagData) => !existingTags.includes(tagData.tag)
    );

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
          console.log(
            `Processing batch ${batchIndex + 1} of ${tagBatches.length}`
          );

          const batchCreatePromises = batch.map(async (tagData) => {
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

          console.log(
            `Batch ${batchIndex + 1} of ${tagBatches.length} completed`
          );

          // Add a delay between batches
          if (batchIndex < tagBatches.length - 1) {
            console.log(
              `Waiting for ${
                delayBetweenBatchesMs / 1000
              } seconds before the next batch...`
            );
            await new Promise((resolve) =>
              setTimeout(resolve, delayBetweenBatchesMs)
            );
          }

          break; // Exit the retry loop if successful
        } catch (error) {
          console.error(
            `Error processing batch ${batchIndex + 1}, retrying...`
          );
          retryAttempts++;
          await new Promise((resolve) =>
            setTimeout(resolve, delayBetweenBatchesMs)
          );
        }
      }

      if (retryAttempts === maxRetries) {
        console.error(
          `Max retries reached for batch ${batchIndex + 1}, skipping...`
        );
      }
    }

    console.log(`Successfully added ${newTags.length} new tags.`);
  } catch (error) {
    console.error("Error populating TagSet table:", error);
  }
};

const createUserTagsWithSession = async (userId, sessionId, tagIds, fullName) => {
  try {
    const batchCreatePromises = tagIds.map(async (tagId) => {
      const currTagId = tagId.tagId;
      const input = {
        userTagId: v4(),
        sessionId: sessionId,
        userId: userId,
        tagId: currTagId,
        fullName: fullName
      };
      await API.graphql(graphqlOperation(createUserTags, { input }));
      const tagSetResponse = await API.graphql(
        graphqlOperation(getTagSet, { tagId: currTagId })
      );
      const tag = tagSetResponse.data.getTagSet.tag;
      return { tagId: currTagId, tag: tag };
    });

    const addedTags = await Promise.all(batchCreatePromises);
    console.log("User tags batch added successfully.");
    return addedTags;
  } catch (error) {
    console.error("Error adding user tags:", error);
    return [];
  }
};

const removeUserTagsByTagId = async (userId, sessionId, tagIds) => {
  try {
    const deletePromises = [];

    for (const tagIdPair of tagIds) {
      const tagId = tagIdPair.tagId;

      // Fetch the userTagIds and sessionIds using the listUserTags query for the current tagId
      const response = await API.graphql(
        graphqlOperation(listUserTags, {
          filter: {
            userId: { eq: userId },
            tagId: { eq: tagId },
          },
        })
      );

      const userTags = response.data.listUserTags.items;

      // Create an array of promises to delete user tags in a batch for the current tagId
      const deleteTagPromises = userTags.map(async (userTag) => {
        try {
          const input = { userTagId: userTag.userTagId, sessionId: sessionId };
          return await API.graphql(graphqlOperation(deleteUserTags, { input }));
        } catch (error) {
          console.error("Error deleting user tag:", error);
          throw error;
        }
      });

      // Accumulate the delete tag promises for the current tagId
      deletePromises.push(deleteTagPromises);
    }

    // Execute the batch delete operation for all tagIds
    const deleteResults = await Promise.all(deletePromises);

    console.log("User tags removed successfully:", deleteResults);
    return deleteResults;
  } catch (error) {
    console.error("Error removing user tags:", error);
    return [];
  }
};

async function uploadImageToS3(profilePictureUri) {
  const filename = v4() + "_profilePhoto.jpeg";
  const response = await fetch(profilePictureUri);
  const blob = await response.blob();

  const profilePictureS3Uri = await Storage.put(filename, blob, {
    level: "protected",
    contentType: "image/jpeg",
  });

  return filename;
}

async function updateUserProfileTable(updatedFields) {
  const updatedUserProfile = await API.graphql(
    graphqlOperation(updateUserProfiles, { input: updatedFields })
  );
  await AsyncStorage.removeItem("userProfileData");
  return updatedUserProfile.data.updateUserProfiles;
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
        case "signIn":
          fetchUserData();
          break;
        case "signOut":
          setUser(null);
          break;
        default:
          break;
      }
    };

    Hub.listen("auth", authListener);

    return () => Hub.remove("auth", authListener);
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
    getTagSets,
    populateTagSet,
    updateUserProfileTable,
    removeUserTagsByTagId,
    fetchConnectionsAndProfiles,
    fetchUserProfileData,
    getUserProfileFromId,
    storeInterval,
    createUserTagsWithSession,
    fetchUserProfileImage,
    refreshLocation,
    refreshToken,
    isUserLoggedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
