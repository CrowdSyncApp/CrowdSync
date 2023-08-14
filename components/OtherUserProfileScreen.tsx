import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';

const OtherUserProfileScreen = () => {

  const navigation = useNavigation(); // Get navigation instance
  const route = useRoute(); // Get route object

  const { userData } = route.params;

  // Sample data for the user profile (you can replace this with actual data from your backend)
  const userProfile = {
    name: 'John Doe',
    jobTitle: 'Software Engineer',
    address: '123 Main St, City, State, Zip',
    phoneNumber: '555-123-4567',
    profilePicture: require('../images/profile_picture.png'),
    socialUrls: [
      'https://www.linkedin.com/in/johndoe',
      'https://github.com/johndoe',
      'https://twitter.com/johndoe',
    ],
    tags: ['React Native', 'JavaScript', 'Mobile Development'],
  };

  // Function to handle opening the chat (you can implement your chat logic here)
  const handleChatPress = () => {
    // Implement your chat logic here
    navigation.navigate('ChatScreen', { participants: [userData], chatType: "INDIVIDUAL" });
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Profile Picture */}
      <Image source={userProfile.profilePicture} style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginTop: 20 }} />

      {/* User's Name */}
      <Text style={{ fontSize: 24, fontWeight: 'bold', alignSelf: 'center', marginTop: 10 }}>{userProfile.name}</Text>

      {/* Job Title */}
      <Text style={{ fontSize: 18, alignSelf: 'center', marginTop: 5 }}>{userProfile.jobTitle}</Text>

      {/* Address */}
      <Text style={{ fontSize: 16, alignSelf: 'center', marginTop: 5 }}>{userProfile.address}</Text>

      {/* Phone Number */}
      <Text style={{ fontSize: 16, alignSelf: 'center', marginTop: 5 }}>{userProfile.phoneNumber}</Text>

      {/* Social URLs */}
      <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Social URLs:</Text>
        {userProfile.socialUrls.map((url, index) => (
          <TouchableOpacity key={index} onPress={() => console.log('Open URL: ', url)}>
            <Text style={{ fontSize: 16, color: 'blue', marginTop: 5 }}>{url}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* User's Tags */}
      <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>User's Tags:</Text>
        {userProfile.tags.map((tag, index) => (
          <Text key={index} style={{ fontSize: 16, marginTop: 5 }}>{tag}</Text>
        ))}
      </View>

      {/* Chat Button */}
      <TouchableOpacity
        onPress={handleChatPress}
        style={{ backgroundColor: '#007bff', borderRadius: 5, padding: 10, margin: 20 }}
      >
        <Text style={{ fontSize: 18, color: 'white', textAlign: 'center' }}>Chat</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default OtherUserProfileScreen;
