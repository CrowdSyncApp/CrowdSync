import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Button } from 'react-native';
import { useAuth } from "../QueryCaching";
import { useNavigation } from "@react-navigation/native";

const AddTags = ({ route }) => {
    const { userProfileData } = route.params;
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { getTagSets } = useAuth();
  const [allTags, setAllTags] = useState([]);
  const navigation = useNavigation();
  const [currentTags, setCurrentTags] = useState(userProfileData.tags);

  useEffect(() => {
    const fetchTagSet = async () => {
        const fetchedTags = await getTagSets();
        setAllTags(fetchedTags);
     };
     fetchTagSet();
  }, []);

  // Implement the logic to search for tags based on the searchText
  const handleSearchTextChange = (text) => {
    const filteredTags = allTags.filter((tag) =>
      tag.tag.toLowerCase().includes(text.toLowerCase())
    );

    // Extract tag names from filteredTags array
    const tagNames = filteredTags.map((tag) => tag.tag);

    setSearchResults(tagNames);
    setSearchText(text);
  };

  const handleAddTag = (tag) => {
    const matchingTag = allTags.find((tagData) => tagData.tag.toLowerCase() === tag.toLowerCase());

    if (matchingTag) {
      const tagId = matchingTag.tagId;
      const updatedTag = { tagId, tag };

      if (!currentTags.some((existingTag) => existingTag.tagId === tagId)) {
        setCurrentTags([...currentTags, updatedTag]);
      }
    }

    // Clear search results and search text after adding a tag
    setSearchResults([]);
    setSearchText('');
  };

  // Implement the logic to remove a tag from the currentTags state
  const handleRemoveTag = (tag) => {
    const updatedTags = currentTags.filter((currentTag) => currentTag !== tag);
    setCurrentTags(updatedTags);
  };

  const handleSaveChanges = async () => {
    navigation.navigate('EditProfile', { userProfileData, updatedTags: currentTags });
  };

  return (
    <View>
      {/* Display the current tags */}
      <FlatList
        data={currentTags}
        keyExtractor={(item) => item.tagId}
        renderItem={({ item }) => (
          <View>
            <Text>{item.tag}</Text>
            <TouchableOpacity onPress={() => handleRemoveTag(item)}>
              <Text>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Search input */}
      <TextInput
        value={searchText}
        onChangeText={handleSearchTextChange}
        placeholder="Search for tags"
      />

      {/* Display search results */}
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleAddTag(item)}>
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Save button */}
      <Button title="Save Changes" onPress={handleSaveChanges} />
    </View>
  );
};

export default AddTags;
