// ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../auth';
import MyConnections from './MyConnections';

const ProfileScreen = ({ route }) => {
  // Extract the user information passed as props from the route object
  const { user } = route.params;
  const { logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    logout();
        navigation.navigate('Login');
  };

  const handleMyConnectionsPress = () => {
        // Navigate to the ProfileScreen and pass the user data as params
        navigation.navigate('MyConnections', { user });
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <View style={styles.profilePictureContainer}>
        {/* Add your profile picture component here */}
      </View>

      {/* Full Name */}
      <Text style={styles.fullName}>{user.fullName}</Text>

      {/* Job Title */}
      <Text style={styles.infoText}>Job Title: {user.jobTitle}</Text>

      {/* Address */}
      <Text style={styles.infoText}>Address: {user.address}</Text>

      {/* Phone Number */}
      <Text style={styles.infoText}>Phone Number: {user.phoneNumber}</Text>

      {/* Links to URLs */}
      <View style={styles.linksContainer}>
        {/* Add rows of links to URLs here */}
      </View>

      {/* My Tags */}
      <View style={styles.tagsContainer}>
        <Text style={styles.tagsHeader}>My Tags:</Text>
        {/* Add list of tags as Text components here */}
        {/* The last tag can be a button */}
        {/* For example: */}
        <View style={styles.tag}>
          <Text>Tag 1</Text>
        </View>
        <View style={styles.tag}>
          <Text>Tag 2</Text>
        </View>
        <View style={styles.tag}>
          <Text>Tag 3</Text>
        </View>
        <Button title="Add Tag" onPress={() => {}} />
      </View>

      {/* Go Invisible Button */}
      <Button title="Go Invisible" onPress={() => {}} />

      {/* My Connections Button */}
      <Button title="My Connections" onPress={handleMyConnectionsPress} />

      <Button title="Logout" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  linksContainer: {
    marginBottom: 16,
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
  },
});

export default ProfileScreen;
