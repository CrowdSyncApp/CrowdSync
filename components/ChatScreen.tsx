import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Auth, API, graphqlOperation } from "aws-amplify";
import { createChats } from '../src/graphql/mutations';
import { listChats } from '../src/graphql/queries';
import 'react-native-get-random-values';
import { v4 } from 'uuid';
import { useAuth } from '../QueryCaching';

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderId, setSenderId] = useState('');
  const [participantsList, setParticipantsList] = useState('');
  const [ttlExpiration, setTtlExpiration] = useState(0);
  const { user, fetchUserProfileData } = useAuth();
  const { participants, chatType } = route.params;

  useEffect(() => {
          setSenderId(user?.attributes.sub);
          setParticipantsList(participants);

          // Fetch chat messages on initial load
          fetchChatMessages();
        }, []);

  // Function to handle sending a new message
  const handleSend = async () => {
    if (newMessage.trim() !== '') {
      const now = new Date().toISOString();
      const chatId = v4();

      try {
        let chatTypeStatus = `${chatType}#ACTIVE`;

        // Send chat messages to all participants
        const sendMessagePromises = participantsList.map(async (participant) => {
          await API.graphql(graphqlOperation(createChats, {
            input: {
                  chatId,
                  senderIdReceiverIdTimestamp: `${senderId}#${participant.userId}#${now}`,
                  messageContent: newMessage.trim(),
                  ttlExpiration,
                  chatTypeStatus,
                },
          }));
        });

        // Wait for all messages to be sent
        await Promise.all(sendMessagePromises);

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

      // Filter chat messages based on chatTypeStatus
      let filteredChatMessages = [];
      if (chatType === "GROUP") {
        // Group chat: Get messages for the group by checking senderIdReceiverIdTimestamp
        filteredChatMessages = chatMessages.filter(
          (chat) =>
            chat.senderIdReceiverIdTimestamp.split('#').some((id) =>
              participantsList.map((participant) => participant.userId).includes(id)
            ) &&
            chat.chatTypeStatus === 'GROUP#ACTIVE'
        );
      } else {
        const receiverId = participants[0].userId;
        // Individual chat: Get messages for the receiver
        filteredChatMessages = chatMessages.filter(
          (chat) =>
            (chat.senderIdReceiverIdTimestamp.startsWith(`${senderId}#${receiverId}`) ||
              chat.senderIdReceiverIdTimestamp.startsWith(`${receiverId}#${senderId}`)) &&
            chat.chatTypeStatus === 'INDIVIDUAL#ACTIVE'
        );
      }

      // Find the latest chat message with a valid ttlExpiration
      const latestChatWithExpiration = filteredChatMessages.find(
        (chat) => chat.ttlExpiration > 0
      );

      if (latestChatWithExpiration) {
        // Use the ttlExpiration from the latest chat message
        const ttlExpiration = latestChatWithExpiration.ttlExpiration;
        setTtlExpiration(ttlExpiration); // Update your state with ttlExpiration
      } else {
        // Set ttlExpiration to 7 days after now in epoch format
        const now = new Date();
        const expirationDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
        setTtlExpiration(Math.floor(expirationDate.getTime() / 1000)); // Convert to seconds
      }

      // Update your state with the fetched chat messages
      setMessages(filteredChatMessages.map((item) => item.messageContent));
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
