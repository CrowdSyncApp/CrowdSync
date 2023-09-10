import React, { useEffect, useState } from "react";
import { Text, View, Image, TouchableOpacity, SafeAreaView } from "react-native";
import { Auth } from "aws-amplify";
import { useAuth } from "../QueryCaching";
import { useNavigation } from "@react-navigation/native";
import styles, { palette, fonts } from "./style";
import participantsData from "../dummies/dummy_accounts.json";
import CrowdSyncLogo from "../images/Crowdsync_Logo.png";

const Header = () => {
  const navigation = useNavigation();
  const { user, fetchUserProfileData } = useAuth();
  const [userProfileData, setUserProfileData] = useState(null);

  useEffect(() => {
    const getUserProfileData = async () => {
      if (user) {
        fetchedUserProfileData = await fetchUserProfileData(user?.username);
      } else {
        // Pick a random user from participantsData
        const randomIndex = Math.floor(Math.random() * participantsData.length);
        fetchedUserProfileData = participantsData[randomIndex];
      }
      setUserProfileData(fetchedUserProfileData);
    };
    getUserProfileData();
  }, [user]);

  const handleProfilePress = async () => {
    // Navigate to the ProfileScreen and pass the user profile data as params
    navigation.navigate("Profile", { userProfileData });
  };

  return (
  <SafeAreaView style={{backgroundColor: palette.primaryBgColor}}>
    <View style={styles.header}>
      <Image
        source={CrowdSyncLogo}
        style={{
          width: 50,
          height: 50,
        }}
      />
      <Text style={styles.headerTitle}>CrowdSync</Text>
      <TouchableOpacity onPress={handleProfilePress}>
        <Image
          source={{ uri: userProfileData?.profilePictureUri }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            resizeMode: "contain",
          }}
        />
      </TouchableOpacity>
    </View>
   </SafeAreaView>
  );
};

export default Header;
