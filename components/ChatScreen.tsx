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
import { listChatsBetweenUsers } from "../src/graphql/queries";
import { onCreateChats } from '../src/graphql/subscriptions';
import "react-native-get-random-values";
import { v4 } from "uuid";
import { useAuth } from "../QueryCaching";
import styles, { palette, fonts } from "./style";

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [senderId, setSenderId] = useState("");
  const [participantsList, setParticipantsList] = useState("");
  const [participantIdsList, setParticipantIdsList] = useState("");
  const [ttlExpiration, setTtlExpiration] = useState(0);
  const { user, fetchUserProfileData } = useAuth();
  const { participants, chatType } = route.params;

  useEffect(() => {
    setSenderId(user?.attributes.sub);
    setParticipantsList(participants);
    const participantIds = participants.map(participant => participant.userId);
    setParticipantIdsList(participantIds);
  }, []);

  useEffect(() => {
    // Fetch chat messages when senderId is set
    if (senderId) {
      fetchChatMessages();
    }

    const subscription = API.graphql(
          graphqlOperation(onCreateChats, {
            senderId: user?.attributes.sub
          })
        ).subscribe({
          next: (data) => {
            // Handle incoming subscription data (new chat messages)
            const newChatMessage = data.value.data.onCreateChats;
            console.log("newChatMessage", newChatMessage);
            setMessages((prevMessages) => [...prevMessages, newChatMessage]);
          },
          error: (error) => {
            console.error('Subscription error:', error);
          },
        });

    return () => {
        subscription.unsubscribe();
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
          {formatTimestamp(item.timestamp)}
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
                    senderId: senderId,
                    timestamp: now,
                    receiverId: participant.userId,
                    messageContent: newMessage.trim(),
                    chatTypeStatus,
                  },
                })
              );
            }
          }
        );

        // Wait for all messages to be sent
        await Promise.all(sendMessagePromises);

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

    const userId = user?.attributes.sub;
    const chatTypeStatus = `${chatType}#ACTIVE`;

      const response = await API.graphql(
        graphqlOperation(listChatsBetweenUsers, {
            userId: userId,
            otherUserIds: participantIdsList,
            chatTypeStatus: chatTypeStatus,
        })
      );
      const chatMessages = response.data.listChatsBetweenUsers.items;

      chatMessages.sort((a, b) => {
        const timestampA = new Date(
          a.timestamp
        );
        const timestampB = new Date(
          b.timestamp
        );
        return timestampA - timestampB;
      });

      setMessages(chatMessages);
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
