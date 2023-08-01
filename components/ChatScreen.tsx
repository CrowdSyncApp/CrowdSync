import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';

const ChatScreen = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Function to handle sending a new message
  const handleSend = () => {
    if (newMessage.trim() !== '') {
      // Append the new message to the messages array
      setMessages([...messages, newMessage.trim()]);
      // Clear the text input after sending the message
      setNewMessage('');
    }
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5, marginBottom: 10 }}>
            <Text>{item}</Text>
          </View>
        )}
      />

      {/* New Message Text Input */}
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Type your message..."
        style={{ fontSize: 16, borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      {/* Send Button */}
      <TouchableOpacity
        onPress={handleSend}
        style={{ backgroundColor: '#007bff', borderRadius: 5, padding: 10 }}
      >
        <Text style={{ fontSize: 18, color: 'white', textAlign: 'center' }}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatScreen;
