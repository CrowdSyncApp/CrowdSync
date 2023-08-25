import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Auth, API, graphqlOperation } from "aws-amplify";
import { createChats } from '../src/graphql/mutations';
import { listChats } from '../src/graphql/queries';
import 'react-native-get-random-values';
import { v4 } from 'uuid';
import { useAuth } from '../QueryCaching';
import styles, { palette, fonts } from "./style";

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [timestamps, setTimestamps] = useState<number[]>([]);
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

        // Send chat messages to all visible participants
        const sendMessagePromises = participantsList.map(async (participant) => {
          if (participant.visibility === 'VISIBLE') {
            await API.graphql(graphqlOperation(createChats, {
              input: {
                chatId,
                senderIdReceiverIdTimestamp: `${senderId}#${participant.userId}#${now}`,
                messageContent: newMessage.trim(),
                ttlExpiration,
                chatTypeStatus,
              },
            }));
          }
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

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${month}/${day}, ${hours}:${minutes}`;
  };

  const fetchChatMessages = async () => {
    try {
      const response = await API.graphql(graphqlOperation(listChats));
      const chatMessages = response.data.listChats.items;

      // Filter chat messages based on chatTypeStatus
      let filteredChatMessages = [];
      if (chatType === "GROUP") {
        // Group chat: Get messages for the group by checking senderIdReceiverIdTimestamp
        const displayedChatMessages = {};
        filteredChatMessages = chatMessages.filter((chat) => {
          const [senderId, receiverId] = chat.senderIdReceiverIdTimestamp.split('#');
          const senderIdString = senderId.toString();
          const receiverIdString = receiverId.toString();

          const isSenderInParticipants = participants
            .map((participant) => participant.userId.toString())
            .includes(senderIdString);

          const isReceiverInParticipants = participants
            .map((participant) => participant.userId.toString())
            .includes(receiverIdString);

          const isChatAlreadyDisplayed = displayedChatMessages[chat.chatId];

            const shouldDisplayChat =
              ((isSenderInParticipants && receiverId === user?.attributes.sub) ||
              (isReceiverInParticipants && senderId === user?.attributes.sub)) &&
              chat.chatTypeStatus === 'GROUP#ACTIVE' && !isChatAlreadyDisplayed;

            if (shouldDisplayChat) {
              displayedChatMessages[chat.chatId] = true; // Mark chat as displayed
            }

            return shouldDisplayChat;
        });

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

      filteredChatMessages.sort((a, b) => {
        const timestampA = new Date(a.senderIdReceiverIdTimestamp.split('#')[2]);
        const timestampB = new Date(b.senderIdReceiverIdTimestamp.split('#')[2]);
        return timestampA - timestampB;
      });

      if (!ttlExpiration) {
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
      }

      // Update your state with the fetched chat messages
      setMessages(filteredChatMessages.map((item) => item.messageContent));
      setTimestamps(filteredChatMessages.map((item) => parseInt(item.senderIdReceiverIdTimestamp.split('#')[2])));
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
          renderItem={({ item, index }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5 }}>
                <Text>{item}</Text>
              </View>
              <Text style={{ fontSize: 12, marginLeft: 5, color: 'gray' }}>
                {formatTimestamp(timestamps[index])}
              </Text>
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
