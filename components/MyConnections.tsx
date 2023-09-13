import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../QueryCaching";
import participantsData from "../dummies/dummy_accounts.json";
import { getSessionIdForUser } from "./SessionManager";
import styles, { palette, fonts } from "./style";

const MyConnections = ({ route }) => {
  const navigation = useNavigation();
  const { fetchConnectionsAndProfiles } = useAuth();
  const { userProfileData } = route.params;
  const [connectionsData, setConnectionsData] = useState([]);

  useEffect(() => {
        const getConnections = async () => {
          const profiles = await fetchConnectionsAndProfiles(userProfileData.userId);
          const mergedData = [...participantsData, ...profiles];
          setConnectionsData(mergedData);
         }
         getConnections();
    }, []);

  const handleConnectionPress = async (connectionData: string) => {
    try {
      const sessionId = await getSessionIdForUser(connectionData.userId);

      navigation.navigate("OtherUserProfile", { userData: connectionData, sessionId: sessionId });
    } catch (error) {
      console.error("Error in handleConnectionPress:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.index}>
        <View style={styles.div}>
          {/* List of Connections */}
          <FlatList
            data={connectionsData}
            keyExtractor={(item) => item.userId} // Use a unique identifier from your data
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleConnectionPress(item)}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10,
                  }}
                >
                  <Text style={styles.secondaryHeaderTitle}>
                    {item.fullName}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MyConnections;
