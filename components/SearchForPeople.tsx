import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { API, graphqlOperation } from "aws-amplify";
import { useNavigation } from "@react-navigation/native";
import { listParticipants, listTagSets, listUserTags } from "../src/graphql/queries";
import styles, { palette, fonts } from "./style";
import { useAuth } from "../QueryCaching";

const SearchForPeople = ({ route }) => {
const navigation = useNavigation();
const { sessionData } = route.params;
const { getUserProfileFromId } = useAuth();
  const [nameQuery, setNameQuery] = useState("");
const [tagQuery, setTagQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // Function to handle the search button press
  const handleSearch = async () => {
    try {
      // Split the tagQuery string into an array of tag strings
      const tagQueryArray = tagQuery.trim().split(',');

      let participants = [];
      let userTags = [];

      if (nameQuery.trim() !== '') {
        // Create a filter to match participants with the specified criteria
        const participantsFilter = {
          sessionId: { eq: sessionData.sessionId }, // Replace with your actual session ID
          visibility: { eq: 'VISIBLE' },
          fullName: { beginsWith: nameQuery.trim() }, // Match participants whose name starts with nameQuery
        };

        // Make the GraphQL API call to search for participants
        const participantsResponse = await API.graphql(
          graphqlOperation(listParticipants, { filter: participantsFilter })
        );

        // Extract the list of participants from the response
        participants = participantsResponse.data.listParticipants.items;
      }

      if (tagQuery.trim() !== '') {
        // Query for tagId values based on tag strings in tagQuery
        const tagIdPromises = tagQueryArray.map(async (tagString) => {
          // Create a filter to match tag sets with the specified tag string
          const tagSetFilter = {
            tag: { eq: tagString.trim() },
          };

          // Make the GraphQL API call to search for tag sets
          const tagSetResponse = await API.graphql(
            graphqlOperation(listTagSets, { filter: tagSetFilter })
          );

          // Extract the tagId value from the response
          const tagSet = tagSetResponse.data.listTagSets.items[0];
          return tagSet ? tagSet.tagId : null;
        });

        // Fetch all tagId values asynchronously
        const tagIdValues = await Promise.all(tagIdPromises);

        // Remove null values (tags not found)
        const validTagIds = tagIdValues.filter((tagId) => tagId !== null);

        if (validTagIds.length > 0) {
          // Create a filter to match user tags with the valid tagId values
          const userTagsFilter = {
            sessionId: { eq: sessionData.sessionId },
          };

          // Make the GraphQL API call to search for user tags
          const userTagsResponse = await API.graphql(
            graphqlOperation(listUserTags, { filter: userTagsFilter })
          );

          // Extract the list of user tags
          userTags = userTagsResponse.data.listUserTags.items;
          userTags = userTags.filter((userTag) =>
              validTagIds.includes(userTag.tagId)
            );
        }
      }

      // Combine the results of participants and user tags
      let results = [];

      if (nameQuery.trim() !== '' && tagQuery.trim() !== '') {
        const userTagIds = userTags.map((userTag) => userTag.userId);
        results = participants.filter((participants) => userTagIds.includes(participants.userId));
      } else if (tagQuery.trim() !== '') {
        results = userTags;
      } else {
        results = participants;
      }

      if (results.length === 0) {
        results = [{ userId: 0, fullName: "No results found..." }]
      }

      // Set the search results
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching for participants and user tags:", error);
    }
  };

  const handleUserProfileLinkPress = async (user) => {
    try {
      if (user.userId === 0) {
        return;
      }
      // Call the getUserProfileFromId function to fetch the user's profile data
      const userProfileData = await getUserProfileFromId(user.userId);

      navigation.navigate('OtherUserProfile', { userData: userProfileData, sessionId: sessionData.sessionId });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Handle the error as needed, e.g., show an error message to the user
    }
  };

  return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.index}>
          <View style={styles.div}>
            {/* Search by Name */}
            <TextInput
              value={nameQuery}
              onChangeText={setNameQuery}
              placeholder="Search by name..."
              style={styles.textInput}
              placeholderTextColor="#2a2e30"
            />

            {/* Search by Tag */}
            <View style={{ marginTop: 10 }}/>
            <TextInput
              value={tagQuery}
              onChangeText={setTagQuery}
              placeholder="Search by tag, separate with comma..."
              style={styles.textInput}
              placeholderTextColor="#2a2e30"
            />

            {/* Search Button */}
            <View style={{ marginTop: 10 }}/>
            <Pressable style={styles.basicButton} onPress={handleSearch}>
              <Text style={styles.buttonText}>Search</Text>
            </Pressable>

            {/* Search Results */}
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.userId}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleUserProfileLinkPress(item)}
                >
                  <Text style={styles.detailText}>{item.fullName}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };

export default SearchForPeople;
