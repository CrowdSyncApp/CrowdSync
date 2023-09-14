import React, { useEffect, useState } from "react";
import { Text, View, Image, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { Auth } from "aws-amplify";
import { useAuth } from "../QueryCaching";
import { useNavigation } from "@react-navigation/native";
import styles, { palette, fonts } from "./style";
import participantsData from "../dummies/dummy_accounts.json";
import CrowdSyncBackArrow from "../images/CrowdSync_Back_Arrow.png";
import { getSessionData } from "./SessionManager";

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

  const handleTitlePress = async () => {
       const sessionData = await getSessionData();

       if (sessionData) {
          navigation.navigate("SessionHome", { sessionData: sessionData });
       } else {
          navigation.navigate("FindSession");
       }
    };

  const handleProfilePress = async () => {
    // Navigate to the ProfileScreen and pass the user profile data as params
    navigation.navigate("Profile", { userProfileData });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
  <View style={{backgroundColor: palette.primaryBgColor}}>
  <SafeAreaView style={{marginTop: StatusBar.currentHeight }}>
    <View style={styles.header}>
      <TouchableOpacity onPress={handleGoBack}>
        <Image
          source={CrowdSyncBackArrow}
          style={{
            width: 50,
            height: 50,
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleTitlePress}>
      <Text style={styles.headerTitle}>CrowdSync</Text>
      </TouchableOpacity>
      <View style={{width: 50, height: 50}}/>
    </View>
   </SafeAreaView>
   </View>
  );
};

export default Header;