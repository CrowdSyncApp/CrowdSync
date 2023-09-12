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
import styles, { palette, fonts } from "./style";

const SearchForPeople = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // Function to handle the search button press
  const handleSearch = () => {
    // Save the search query to search history
    if (searchQuery.trim() !== "") {
      setSearchHistory([...searchHistory, searchQuery.trim()]);
    }

    // Perform search logic here and update the search results
    // For now, we will just set the search results to the search history
    setSearchResults(searchHistory);
  };

  // Function to handle tapping on a user's profile link
  const handleUserProfileLinkPress = (user: string) => {
    // Implement your logic to navigate to the user's profile screen
    console.log("Open user profile of: ", user);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }} // Set the flex property to 1 to fill the available space
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior based on platform
    >
      <View style={styles.index}>
        <View style={styles.div}>
          {/* Search Text Input */}
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name, company, or tag..."
            style={styles.textInput}
            placeholderTextColor="#2a2e30"
          />

          {/* Search Button */}
          <View style={{ paddingVertical: 10 }} />

          <Pressable style={styles.basicButton} onPress={handleSearch}>
            <Text style={styles.buttonText}>Search</Text>
          </Pressable>

          {/* Search Results */}
          <FlatList
            data={searchResults}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleUserProfileLinkPress(item)}
              >
                <Text style={styles.detailText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SearchForPeople;
