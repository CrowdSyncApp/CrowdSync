import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { createChats } from "../src/graphql/mutations";
import { listChats } from "../src/graphql/queries";
import "react-native-get-random-values";
import { v4 } from "uuid";
import { useAuth } from "../QueryCaching";
import styles, { palette, fonts } from "./style";

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [senderId, setSenderId] = useState("");
  const [participantsList, setParticipantsList] = useState("");
  const [ttlExpiration, setTtlExpiration] = useState(0);
  const { user, fetchUserProfileData } = useAuth();
  const { participants, chatType } = route.params;

  useEffect(() => {
    setSenderId(user?.attributes.sub);
    setParticipantsList(participants);
  }, []);

  useEffect(() => {
    // Fetch chat messages when senderId is set
    if (senderId) {
      fetchChatMessages();
    }
  }, [senderId]);

  const renderChatBubble = (item, isUser) => {
    const chatBubbleStyle = {
      backgroundColor: isUser ? "#DCF8C6" : "#F0F0F0",
      alignSelf: isUser ? "flex-end" : "flex-start",
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
    };

    const textStyle = {
      color: isUser ? "#000" : "#000",
    };

    return (
      <View style={chatBubbleStyle}>
        <Text style={textStyle}>{item.messageContent}</Text>
        <Text style={styles.detailText}>
          {formatTimestamp(item.senderIdReceiverIdTimestamp.split("#")[2])}
        </Text>
      </View>
    );
  };

  // Function to handle sending a new message
  const handleSend = async () => {
    if (newMessage.trim() !== "") {
      const now = new Date().toISOString();
      const chatId = v4();

      try {
        let chatTypeStatus = `${chatType}#ACTIVE`;

        // Send chat messages to all visible participants
        const sendMessagePromises = participantsList.map(
          async (participant) => {
            if (
              (participant.visibility === "VISIBLE" && chatType === "GROUP") ||
              chatType === "INDIVIDUAL"
            ) {
              await API.graphql(
                graphqlOperation(createChats, {
                  input: {
                    chatId,
                    senderIdReceiverIdTimestamp: `${senderId}#${participant.userId}#${now}`,
                    messageContent: newMessage.trim(),
                    ttlExpiration,
                    chatTypeStatus,
                  },
                })
              );
            }
          }
        );

        // Wait for all messages to be sent
        await Promise.all(sendMessagePromises);

        // Fetch updated chat messages after sending the new message
        fetchChatMessages();

        // Clear the text input after sending the message
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
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
          const [senderId, receiverId] =
            chat.senderIdReceiverIdTimestamp.split("#");
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
              (isReceiverInParticipants &&
                senderId === user?.attributes.sub)) &&
            chat.chatTypeStatus === "GROUP#ACTIVE" &&
            !isChatAlreadyDisplayed;

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
            (chat.senderIdReceiverIdTimestamp.startsWith(
              `${senderId}#${receiverId}`
            ) ||
              chat.senderIdReceiverIdTimestamp.startsWith(
                `${receiverId}#${senderId}`
              )) &&
            chat.chatTypeStatus === "INDIVIDUAL#ACTIVE"
        );
      }

      filteredChatMessages.sort((a, b) => {
        const timestampA = new Date(
          a.senderIdReceiverIdTimestamp.split("#")[2]
        );
        const timestampB = new Date(
          b.senderIdReceiverIdTimestamp.split("#")[2]
        );
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
          const expirationDate = new Date(
            now.getTime() + 7 * 24 * 60 * 60 * 1000
          ); // 7 days in milliseconds
          setTtlExpiration(Math.floor(expirationDate.getTime() / 1000)); // Convert to seconds
        }
      }

      // Update your state with the fetched chat messages
      const updatedMessages = filteredChatMessages.map((item) => ({
        ...item, // Copy existing message properties
        senderId: item.senderIdReceiverIdTimestamp.split("#")[0], // Extract senderId
      }));
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }} // Set the flex property to 1 to fill the available space
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior based on platform
      keyboardVerticalOffset={50}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.index}>
          <View style={styles.div}>
            <View
              style={{
                backgroundColor: "#FFF", // White background
                flex: 1, // Fill available space
                padding: 20, // Add padding to create the white box
                marginTop: 5, // Top margin
                marginBottom: 20, // Bottom margin
                borderRadius: 10,
              }}
            >
              {/* Chat Messages */}
              <ScrollView>
                {messages.map((message, index) => (
                  <View key={index}>
                    {senderId === message.senderId
                      ? renderChatBubble(message, true)
                      : renderChatBubble(message, false)}
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* New Message Text Input */}
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type your message..."
              style={styles.textInput}
              placeholderTextColor="#2a2e30"
            />
            <View style={{ paddingVertical: 5 }} />

            {/* Send Button */}
            <View style={{ marginBottom: 0 }}>
              <Pressable style={styles.basicButton} onPress={handleSend}>
                <Text style={styles.buttonText}>Send</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
