import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../QueryCaching";
import participantsData from "../dummies/dummy_accounts.json";
import { getSessionIdForUser } from "./SessionManager";
import styles, { palette, fonts } from "./style";
import { useLog } from "../CrowdSyncLogManager";

const MyConnections = ({ route }) => {
  const navigation = useNavigation();
  const { fetchConnectionsAndProfiles, getUserProfileFromId } = useAuth();
  const { userProfileData } = route.params;
  const [connectionsData, setConnectionsData] = useState([]);
  const log = useLog();

  log.debug('MyConnections screen on userProfileData: ', JSON.stringify(userProfileData));

  useFocusEffect(
    React.useCallback(() => {
      const getConnections = async () => {
        const profiles = await fetchConnectionsAndProfiles(userProfileData.userId, log);
        log.debug('getConnections profiles: ', profiles);
        const mergedData = [...participantsData, ...profiles];
        log.debug('mergedData: ', mergedData);
        setConnectionsData(mergedData);
      };
      getConnections();
    }, [userProfileData.userId, participantsData])
  );

  const handleConnectionPress = async (connectionData) => {
    log.debug('handleConnectionPress on connectionData: ', JSON.stringify(connectionData));
    try {
    const userData = await getUserProfileFromId(connectionData.userId, log);
      const sessionId = await getSessionIdForUser(connectionData.userId, log);

        log.debug('Navigating to OtherUserProfile on userData: ' + JSON.stringify(userData) + ' and sessionId: ' + JSON.stringify(sessionId));
      navigation.navigate("OtherUserProfile", { userData: userData, sessionId: sessionId });
    } catch (error) {
      console.error("Error in handleConnectionPress:", error);
      log.error("Error in handleConnectionPress:", JSON.stringify(error));
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
