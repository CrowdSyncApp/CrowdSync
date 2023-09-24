import React, { useEffect, useState } from "react";
import { Text, View, Image, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { Auth } from "aws-amplify";
import { useAuth } from "../QueryCaching";
import { useNavigation } from "@react-navigation/native";
import styles, { palette, fonts } from "./style";
import participantsData from "../dummies/dummy_accounts.json";
import CrowdSyncBackArrow from "../images/CrowdSync_Back_Arrow.png";
import { getSessionData } from "./SessionManager";
import { useLog } from "../CrowdSyncLogManager";

const HeaderWithBack = () => {
  const navigation = useNavigation();
  const { user, fetchUserProfileData, fetchUserProfileImage } = useAuth();
  const [userProfileData, setUserProfileData] = useState(null);
  const [profilePictureUri, setProfilePictureUri] = useState("");
  const log = useLog();

    useEffect(() => {
            async function getProfileImageUri() {
            try {
                const profilePicture = await fetchUserProfileImage(userProfileData.identityId, userProfileData.profilePicture, log);
            log.debug('HeaderWithBack profilePicture: ', JSON.stringify(profilePicture));
                setProfilePictureUri(profilePicture);
                } catch (error) {
                    log.error('Error saving profile picture in HeaderWithBack: ', JSON.stringify(error));
                }
            }
            getProfileImageUri();
        }, [userProfileData]);

  useEffect(() => {
    const getUserProfileData = async () => {
      if (user) {
        fetchedUserProfileData = await fetchUserProfileData();
      }
      log.debug('HeaderWithBack userProfileData: ', JSON.stringify(fetchedUserProfileData));
      setUserProfileData(fetchedUserProfileData);
    };
    getUserProfileData();
  }, [user]);

  const handleTitlePress = async () => {
       const sessionData = await getSessionData(log);
       log.debug('handleTitlePress on sessionData: ', JSON.stringify(sessionData));

       if (sessionData.sessionId !== 'INACTIVE') {
          navigation.navigate("SessionHome", { sessionData: sessionData });
       } else {
          navigation.navigate("FindSession");
       }
    };

  const handleProfilePress = async () => {
  log.debug('handleProfilePress on userProfileData: ', JSON.stringify(userProfileData));
    // Navigate to the ProfileScreen and pass the user profile data as params
    navigation.navigate("Profile", { userProfileData });
  };

  const handleGoBack = () => {
    log.debug('handleGoBack');
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
      <TouchableOpacity onPress={handleProfilePress}>
        {profilePictureUri !== '' ? (
            <Image
              source={{ uri: profilePictureUri }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                resizeMode: "contain",
              }}
            />
          ) : <View style={{ width: 50, height: 50 }}/>}
      </TouchableOpacity>
    </View>
   </SafeAreaView>
   </View>
  );
};

export default HeaderWithBack;
