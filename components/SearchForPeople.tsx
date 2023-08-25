import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import styles, { palette, fonts } from "./style";

const SearchForPeople = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // Function to handle the search button press
  const handleSearch = () => {
    // Save the search query to search history
    if (searchQuery.trim() !== '') {
      setSearchHistory([...searchHistory, searchQuery.trim()]);
    }

    // Perform search logic here and update the search results
    // For now, we will just set the search results to the search history
    setSearchResults(searchHistory);
  };

  // Function to handle tapping on a user's profile link
  const handleUserProfileLinkPress = (user: string) => {
    // Implement your logic to navigate to the user's profile screen
    console.log('Open user profile of: ', user);
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
      {/* Search Text Input */}
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Enter search query"
        style={{ fontSize: 16, borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      {/* Search Button */}
      <TouchableOpacity
        onPress={handleSearch}
        style={{ backgroundColor: '#007bff', borderRadius: 5, padding: 10, marginBottom: 20 }}
      >
        <Text style={{ fontSize: 18, color: 'white', textAlign: 'center' }}>Search</Text>
      </TouchableOpacity>

      {/* Search History */}
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Search History:</Text>
      <Text style={{ fontSize: 16 }}>{searchHistory.join(', ')}</Text>

      {/* Search Results */}
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20 }}>Search Results:</Text>
      <FlatList
        data={searchResults}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleUserProfileLinkPress(item)}>
            <Text style={{ fontSize: 16, color: 'blue', marginTop: 5 }}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SearchForPeople;
