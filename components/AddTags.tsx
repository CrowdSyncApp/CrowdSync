import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { useAuth } from "../QueryCaching";
import { useNavigation } from "@react-navigation/native";
import styles, { palette, fonts } from "./style";
import { useLog } from "../CrowdSyncLogManager";

const AddTags = ({ route }) => {
  const { userProfileData, currTags } = route.params;
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { getTagSets } = useAuth();
  const log = useLog();
  const [allTags, setAllTags] = useState([]);
  const navigation = useNavigation();
  const [currentTags, setCurrentTags] = useState(currTags);

  log.debug("Entering AddTags screen with currTags: ", JSON.stringify(currTags));

  useEffect(() => {
    const fetchTagSet = async () => {
      const fetchedTags = await getTagSets(log);
      log.debug("allTags: ", JSON.stringify(fetchedTags));
      setAllTags(fetchedTags);
    };
    fetchTagSet();
  }, []);

  const handleSearchTextChange = (text) => {
    // Clear search results if search text becomes empty
    if (text === "") {
      setSearchResults([]);
    } else {
      const filteredTags = allTags.filter((tag) =>
        tag.tag.toLowerCase().startsWith(text.toLowerCase())
      );

      // Extract tag names from filteredTags array
      const tagNames = filteredTags.map((tag) => tag.tag);

      setSearchResults(tagNames);
    }

    setSearchText(text);
  };

  const handleAddTag = (tag) => {
    log.debug("Adding tag: ", JSON.stringify(tag));
    const matchingTag = allTags.find(
      (tagData) => tagData.tag.toLowerCase() === tag.toLowerCase()
    );

    if (matchingTag) {
      const tagId = matchingTag.tagId;
      const updatedTag = { tagId, tag };
      log.debug("updatedTag: ", JSON.stringify(updatedTag));

      if (!currentTags.some((existingTag) => existingTag.tagId === tagId)) {
        setCurrentTags([...currentTags, updatedTag]);
      }
    }

    // Clear search results and search text after adding a tag
    setSearchResults([]);
    setSearchText("");
  };

  // Implement the logic to remove a tag from the currentTags state
  const handleRemoveTag = (tag) => {
    const updatedTags = currentTags.filter((currentTag) => currentTag !== tag);
    log.debug("currentTags: ", JSON.stringify(updatedTags));
    setCurrentTags(updatedTags);
  };

  const handleSaveChanges = async () => {
    log.debug("handleSaveChanges on updatedTags: " + JSON.stringify(currentTags));
    navigation.navigate("EditProfile", {
      userProfileData,
      updatedTags: currentTags,
    });
  };

  return (
    <View style={styles.index2}>
      <View style={styles.div}>
        {/* Display the current tags */}
        <FlatList
          data={currentTags}
          keyExtractor={(item) => item.tagId}
          renderItem={({ item }) => (
            <View>
              <Text style={styles.detailText}>{item.tag}</Text>
              <TouchableOpacity onPress={() => handleRemoveTag(item)}>
                <Text
                  style={{
                    color: palette.tertiaryColor,
                    textAlign: "left",
                    marginTop: 3,
                  }}
                >
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Search input */}
        <View style={{ paddingVertical: 5 }} />
        <TextInput
          value={searchText}
          onChangeText={handleSearchTextChange}
          style={styles.textInput}
          placeholder="Search for tags"
          placeholderTextColor="#2a2e30"
        />
        <View style={{ paddingVertical: 5 }} />

        {/* Display search results */}
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleAddTag(item)}>
              <Text style={styles.detailText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Save button */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 20,
          width: "90%",
        }}
      >
        <View style={{ paddingVertical: 5 }} />
        <Pressable style={styles.basicButton} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AddTags;
