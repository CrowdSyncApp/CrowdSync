import React from "react";
import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getSessionData } from "./SessionManager";
import styles, { palette, fonts } from "./style";

const OtherUserProfileScreen = () => {
  const navigation = useNavigation(); // Get navigation instance
  const route = useRoute(); // Get route object

  const { userData, sessionId } = route.params;
  const myimage = Image.resolveAssetSource(userData.profilePicture);

  const [showLocationButton, setShowLocationButton] = useState(false);

useEffect(() => {
    async function checkSessionId() {
      try {
        const currentUserSessionId = await getSessionData(); // Assuming getSessionData returns the current user's sessionId
        if (sessionId === currentUserSessionId && sessionId !== "INACTIVE") {
          setShowLocationButton(true);
        } else {
          setShowLocationButton(false);
        }
      } catch (error) {
        console.error("Error fetching current user's sessionId:", error);
        setShowLocationButton(false); // Handle the error by not showing the button
      }
    }

    checkSessionId();
  }, [sessionId]);

  const renderSocialLinks = (socialLinks) => {
    if (socialLinks && socialLinks.length > 0) {
      return socialLinks.map((link, index) => (
        <TouchableOpacity key={index} onPress={() => handleLinkPress(link)}>
          <Text style={styles.detailText}>{link}</Text>
        </TouchableOpacity>
      ));
    } else {
      return <Text style={styles.detailText}>No social links available.</Text>;
    }
  };

  // Function to handle opening the chat (you can implement your chat logic here)
  const handleChatPress = () => {
    // Implement your chat logic here
    navigation.navigate("ChatScreen", {
      participants: [userData],
      chatType: "INDIVIDUAL",
    });
  };

  const handleLocationPress = () => {
      // Implement your chat logic here
      navigation.navigate("UserLocation", { userData: userData, sessionId: sessionId });
    };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.index}>
        <View style={styles.div}>
          {/* Profile Picture */}
          <Image
            source={{ uri: userData.profilePicture }}
            style={{
              width: 350,
              height: 350,
              borderRadius: 100,
              resizeMode: "contain",
            }}
          />

          {/* User's Name */}
          <View style={{ alignItems: "center" }}>
            <Text style={styles.headerTitle}>{userData.fullName}</Text>
          </View>

          {/* Job Title and Company */}
          {userData.jobTitle || userData.company ? (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.secondaryHeaderTitle}>
                {userData.jobTitle}
                {userData.jobTitle && userData.company ? ", " : ""}
                {userData.company}
              </Text>
            </View>
          ) : null}

          {/* Location and Phone Number */}
          {userData.jobTitle || userData.company ? (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.secondaryHeaderTitle}>
                {userData.address}
                {userData.address && userData.phoneNumber ? ", " : ""}
                {userData.phoneNumber}
              </Text>
            </View>
          ) : null}

          {/* Social URLs */}
          <View style={styles.linksContainer}>
            <Text style={styles.secondaryHeaderTitle}>Social Links:</Text>
            {renderSocialLinks(userData.socialLinks)}
          </View>

          {/* User's Tags */}
          <View>
            <Text style={styles.secondaryHeaderTitle}>My Tags:</Text>
            <Text style={styles.detailText}>
              {userData.tags && userData.tags.length > 0
                ? userData.tags.map((tag, index) =>
                    index === userData.tags.length - 1
                      ? tag.tag
                      : tag.tag + ", "
                  )
                : "No tags available."}
            </Text>
          </View>

          {/* Chat Button */}
          <View style={{ paddingVertical: 10 }} />
          <Pressable style={styles.basicButton} onPress={handleChatPress}>
            <Text style={styles.buttonText}>Chat</Text>
          </Pressable>

            {showLocationButton && userData.visibility === "VISIBLE" && (
                <View style={{ paddingVertical: 10 }}>
                  <Pressable style={styles.basicButton} onPress={handleLocationPress}>
                    <Text style={styles.buttonText}>Location</Text>
                  </Pressable>
                </View>
              )}
        </View>
      </View>
    </ScrollView>
  );
};

export default OtherUserProfileScreen;
