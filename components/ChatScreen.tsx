import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Auth, API, graphqlOperation } from "aws-amplify";
import { createChats } from '../src/graphql/mutations';
import { listChats } from '../src/graphql/queries';
import 'react-native-get-random-values';
import { v4 } from 'uuid';
import { useAuth } from '../QueryCaching';

const ChatScreen = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [ttlExpiration, setTtlExpiration] = useState(0);
  const { user, fetchUserProfileData } = useAuth();

  const route = useRoute();

  useEffect(() => {
          const { receiverData } = route.params;
          setSenderId(user?.attributes.sub);
          setReceiverId(receiverData.userId);

          // Fetch chat messages on initial load
          fetchChatMessages();
        }, []);

  // Function to handle sending a new message
  const handleSend = async () => {
        if (newMessage.trim() !== '') {
          const now = new Date().toISOString();
          const senderIdtimestamp = `${senderId}#${now}`;
          const chatId = v4();

          try {
            await API.graphql(graphqlOperation(createChats, {
                      input: {
                        chatId,
                        senderIdtimestamp,
                        receiverId,
                        messageContent: newMessage.trim(),
                        ttlExpiration,
                        status: 'ACTIVE',
                      }
                    }));

            // Fetch updated chat messages after sending the new message
            fetchChatMessages();

            // Clear the text input after sending the message
            setNewMessage('');
          } catch (error) {
            console.error('Error sending message:', error);
          }
        }
      };

  const fetchChatMessages = async () => {
    try {
      const response = await API.graphql(graphqlOperation(listChats));
      const chatMessages = response.data.listChats.items;

      // Find the latest chat message with a valid ttlExpiration
      const latestChatWithExpiration = chatMessages.find(
        (chat) => chat.senderIdtimestamp.startsWith(`${senderId}#`) &&
                   chat.receiverId === receiverId &&
                   chat.ttlExpiration > 0
      );

      if (latestChatWithExpiration) {
        // Use the ttlExpiration from the latest chat message
        const ttlExpiration = latestChatWithExpiration.ttlExpiration;
        setTtlExpiration(ttlExpiration); // Update your state with ttlExpiration
      } else {
        // Set ttlExpiration to 14 days after now in epoch format
          const now = new Date();
          const expirationDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days in milliseconds
          setTtlExpiration(Math.floor(expirationDate.getTime() / 1000)); // Convert to seconds
      }

      // Update your state with the fetched chat messages
      setMessages(chatMessages.map((item) => item.messageContent));
    } catch (error) {
      console.error('Error fetching chat messages:', error);
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
