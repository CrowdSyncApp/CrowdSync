import React from 'react';
import { View, Text, Button } from 'react-native';

const FindSessionScreen = () => {
  const handleStartSession = () => {
    // Handle logic for starting a new session
    // For this example, let's just print a message to the console
    console.log('Starting your own session...');
  };

  return (
    <View>
      <Text>Find Session Screen</Text>
      <Button title="Start Your Own Session" onPress={handleStartSession} />
    </View>
  );
};

export default FindSessionScreen;
