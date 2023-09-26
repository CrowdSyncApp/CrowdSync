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
import { useLog } from "../CrowdSyncLogManager";

const SearchForPeople = ({ route }) => {
const navigation = useNavigation();
const { sessionData } = route.params;
const { getUserProfileFromId } = useAuth();
  const [nameQuery, setNameQuery] = useState("");
const [tagQuery, setTagQuery] = useState("");
  const log = useLog();
  const [searchResults, setSearchResults] = useState<string[]>([]);

    log.debug('SearchForPeople with sessionData: ', JSON.stringify(sessionData));

  // Function to handle the search button press
  const handleSearch = async () => {
    log.debug('handleSearch...');
    try {
      // Split the tagQuery string into an array of tag strings
      const tagQueryArray = tagQuery.trim().split(',');
      log.debug('tagQueryArray: ', JSON.stringify(tagQueryArray));
      log.debug('nameQuery: ', JSON.stringify(nameQuery));

      let participants = [];
      let userTags = [];

      if (nameQuery.trim() !== '') {
        let nextToken = null;

        do {
          const participantsFilter = {
            sessionId: { eq: sessionData.sessionId }, // Replace with your actual session ID
            visibility: { eq: 'VISIBLE' },
            fullName: { beginsWith: nameQuery.trim() }, // Match participants whose name starts with nameQuery
          };
          log.debug('listParticipants with filter: ', JSON.stringify(participantsFilter));

          const participantsResponse = await API.graphql(
            graphqlOperation(listParticipants, { filter: participantsFilter, nextToken })
          );

          const { items, nextToken: newNextToken } = participantsResponse.data.listParticipants;

          // Concatenate the participants from this batch to the existing participants array
          participants = participants.concat(items);

          // Update the nextToken for the next iteration
          nextToken = newNextToken;
        } while (nextToken);

        log.debug('All participants: ', JSON.stringify(participants));
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
        log.debug('listTagSets returns: ', JSON.stringify(tagIdValues));

        // Remove null values (tags not found)
        const validTagIds = tagIdValues.filter((tagId) => tagId !== null);
        log.debug('validTagIds: ', JSON.stringify(validTagIds));

        if (validTagIds.length > 0) {
          // Create a filter to match user tags with the valid tagId values
          const userTagsFilter = {
            sessionId: { eq: sessionData.sessionId },
          };
          log.debug('listUserTags with filter: ', JSON.stringify(userTagsFilter));

          // Make the GraphQL API call to search for user tags
          const userTagsResponse = await API.graphql(
            graphqlOperation(listUserTags, { filter: userTagsFilter })
          );

          // Extract the list of user tags
          userTags = userTagsResponse.data.listUserTags.items;
          userTags = userTags.filter((userTag) =>
              validTagIds.includes(userTag.tagId)
            );
            log.debug('userTags: ', JSON.stringify(userTags));
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
      log.debug('handleSearch results: ', JSON.stringify(results));

      if (results.length === 0) {
        results = [{ userId: 0, fullName: "No results found..." }]
      }

      // Set the search results
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching for participants and user tags:", error);
      log.error("Error searching for participants and user tags:", JSON.stringify(error));
    }
  };

  const handleUserProfileLinkPress = async (user) => {
  log.debug('handleUserProfileLinkPress on user: ', JSON.stringify(user));
    try {
      if (user.userId === 0) {
        return;
      }
      // Call the getUserProfileFromId function to fetch the user's profile data
      const userProfileData = await getUserProfileFromId(user.userId, log);
      log.debug('Navigating to OtherUserProfile on userData: ' + JSON.stringify(userProfileData) + ' and sessionId: ' + JSON.stringify(sessionData.sessionId));

      navigation.navigate('OtherUserProfile', { userData: userProfileData, sessionId: sessionData.sessionId });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      log.error('Error fetching user profile:', JSON.stringify(error));
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
