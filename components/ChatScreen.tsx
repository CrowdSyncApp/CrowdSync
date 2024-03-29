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
import { useFocusEffect } from "@react-navigation/native";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { createChats } from "../src/graphql/mutations";
import { listChats } from "../src/graphql/queries";
import { onCreateChats } from "../src/graphql/subscriptions";
import "react-native-get-random-values";
import faker from 'faker';
import { useAuth } from "../QueryCaching";
import styles, { palette, fonts } from "./style";
import { useLog } from "../CrowdSyncLogManager";
import { getSessionData } from "./SessionManager";

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState("");
  const [participantIdsList, setParticipantIdsList] = useState("");
  const [recIds, setRecIds] = useState([]);
  const log = useLog();
  const [ttlExpiration, setTtlExpiration] = useState(0);
  const { user, getUserProfileFromId } = useAuth();
  const { participants, chatType } = route.params;

  const fakeChats = ["Hey everyone! I just got to the event",
                     "Where's everyone standing? I'm in Building B by the water fountain",
                     "I'm looking forward to the next speaker in 15 minutes!",
                     "Heading to a different session now - nice chatting with you all!",
                     "Hi, where can I find the session on Web3?"];

  log.debug(
    "Entering ChatScreen with participants: " +
      JSON.stringify(participants) +
      " and chatType: " +
      JSON.stringify(chatType)
  );

  useFocusEffect(
      React.useCallback(() => {
        async function setIdReceiverAndParticipantsList() {
            let id;
            let receiver;

            log.debug("senderId: ", JSON.stringify(user?.attributes.sub));
            log.debug("participantsList: ", JSON.stringify(participants));
            let participantIds = participants.map(
              (participant) => participant.userId
            );
            log.debug("participantIdsList: ", JSON.stringify(participantIds));
            setParticipantIdsList(participantIds);

              if (chatType === "GROUP") {
                   const sessionData = await getSessionData(log);
                   log.debug("Creating chatId with sessionData: ", sessionData);
                   id = sessionData.sessionId + sessionData.creatorId;
                   receiver = participantIds;
              } else {
                const userList: string[] = [user?.username, participants[0].userId];
                userList.sort();  // Sort the user IDs

                log.debug("Creating chatId with userList: ", userList);

                // Combine the sorted user IDs
                id = userList[0] + userList[1];
                receiver = [participants[0].userId];
              }
              log.debug('chatId: ', JSON.stringify(id));
              log.debug('ReceiverIds: ', JSON.stringify(receiver));
              setChatId(id);
              setRecIds(receiver);
        }

        setIdReceiverAndParticipantsList();
      }, [])
    );

  useEffect(() => {

    log.debug("Subscribing to onCreateChats with chatId: ", JSON.stringify(chatId));
    const subscription = API.graphql(
      graphqlOperation(onCreateChats, {
        chatId: chatId,
      })
    ).subscribe({
      next: (data) => {
        // Handle incoming subscription data (new chat messages)
        const newChatMessage = data.value.data.onCreateChats;
        log.debug("newChatMessage: ", JSON.stringify(newChatMessage));

          setMessages((prevMessages) => [...prevMessages, newChatMessage]);
          log.debug("messages: ", JSON.stringify(messages));
      },
      error: (error) => {
        console.error("Subscription error:", error);
        log.error("Subscription error:", JSON.stringify(error));
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [chatId]);

  const renderChatBubble = (item, isUser) => {
    const chatBubbleStyle = {
      backgroundColor: isUser ? "#DCF8C6" : "#F0F0F0",
      alignSelf: isUser ? "flex-end" : "flex-start",
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
    };

    let senderName;
    console.log("item", JSON.stringify(item));

    const textStyle = {
      color: isUser ? "#000" : "#000",
    };

    return (
      <View style={chatBubbleStyle}>
      <Text style={styles.detailText}>
        {item.senderName}
      </Text>
        <Text style={textStyle}>{item.messageContent}</Text>
        <Text style={styles.detailText}>
          {formatTimestamp(item.timestamp)}
        </Text>
      </View>
    );
  };

  // Function to handle sending a new message
  const handleSend = async () => {
    log.debug("handleSend...");
    if (newMessage.trim() !== "") {
      const now = new Date().toISOString();

      try {
        const chatTypeStatus = `${chatType}#ACTIVE`;
        const senderName = await getUserProfileFromId(user?.attributes.sub, log);

          const input = {
            chatId: chatId,
            timestamp: now,
            messageContent: newMessage.trim(),
            senderId: user?.attributes.sub,
            senderName: senderName.fullName,
            receiverId: recIds,
            chatTypeStatus,
          };
          log.debug("createChats input: ", JSON.stringify(input));

          await API.graphql(
            graphqlOperation(createChats, { input: input })
          );

        // Clear the text input after sending the message
        setNewMessage("");

        if (chatType === "INDIVIDUAL" && recIds.length === 1 && (recIds[0] !== "2" && recIds[0] !== "4" && recIds[0] !== "5" && recIds[0] !== "3")) {
            return;
        }

      // Randomly select a message and user
      let randomMessage, randomUserId, randomSenderName, randomTimestamp;

      if (chatType === "INDIVIDUAL" && recIds.length === 1) {
        if (recIds[0] === "2") {
            randomUserId = 2;
            randomSenderName = "Jane Smith";
        } else if (recIds[0] === "4") {
            randomUserId = 4;
            randomSenderName = "Emily Brown";
        } else if (recIds[0] === "5") {
            randomUserId = 5;
            randomSenderName = "Michael Wilson";
        } else if (recIds[0] === '3') {
            randomUserId = 3;
            randomSenderName = "Alex Johnson";
        } else {
            randomUserId = 1;
            randomSenderName = "John Doe";
        }
        randomMessage = fakeChats[Math.floor(Math.random() * fakeChats.length)];
        randomTimestamp = new Date(new Date().getTime() + 1).toISOString();
      } else {
        // For other cases, pick random values as before
        randomMessage = fakeChats[Math.floor(Math.random() * fakeChats.length)];
        randomUserId = recIds[Math.floor(Math.random() * recIds.length)];
        randomSenderName = ['Jane Smith', 'Emily Brown', 'Michael Wilson'][Math.floor(Math.random() * 3)];
        randomTimestamp = new Date(new Date().getTime() + 1).toISOString();
      }

      // Create a new message with random content and sender
      const randomMessageInput = {
        chatId: chatId,
        timestamp: randomTimestamp,
        messageContent: randomMessage,
        senderId: randomUserId,
        senderName: randomSenderName,
        receiverId: [...recIds, user?.attributes.sub],
        chatTypeStatus,
      };
      log.debug('createChats input for random message: ', JSON.stringify(randomMessageInput));

      // Send the randomly generated message
      await API.graphql(graphqlOperation(createChats, { input: randomMessageInput }));
      } catch (error) {
        console.error("Error sending message:", error);
        log.error("Error sending message:", JSON.stringify(error));
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

  React.useEffect(() => {
    if (chatId) {
      fetchChatMessages();
    }
  }, [chatId]);

  const fetchChatMessages = async () => {
    log.debug('fetchChatMessages...');
    try {
      const userId = user?.attributes.sub;
      const chatTypeStatus = `${chatType}#ACTIVE`;
      log.debug('userId: ', JSON.stringify(userId));
      log.debug('chatId: ', JSON.stringify(chatId));
      log.debug('chatTypeStatus: ', JSON.stringify(chatTypeStatus));

      let allMessages = [];
      let nextToken = null;

      do {
        const filter = {
          chatId: { eq: chatId },
        };
        const response = await API.graphql(
          graphqlOperation(listChats, { filter, nextToken })
        );
        const chatMessages = response.data.listChats.items;

        if (chatMessages.length > 0) {
          allMessages = allMessages.concat(chatMessages);
        }

        nextToken = response.data.listChats.nextToken;
      } while (nextToken);

      setMessages(allMessages);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      log.error('Error fetching chat messages:', JSON.stringify(error));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }} // Set the flex property to 1 to fill the available space
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior based on platform
      keyboardVerticalOffset={90}
    >
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
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {messages.map((message, index) => (
                  <View key={index}>
                    {user?.attributes.sub === message.senderId
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
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
