import React, { useEffect, useState } from "react";
import { Text, View, Image, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { Auth } from "aws-amplify";
import { useAuth } from "../QueryCaching";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import styles, { palette, fonts } from "./style";
import participantsData from "../dummies/dummy_accounts.json";
import CrowdSyncLogo from "../images/Crowdsync_Logo.png";
import { getSessionData } from "./SessionManager";
import { useLog } from "../CrowdSyncLogManager";

const Header = () => {
  const navigation = useNavigation();
  const { user, fetchUserProfileData, fetchUserProfileImage } = useAuth();
  const [userProfileData, setUserProfileData] = useState(null);
  const [profilePictureUri, setProfilePictureUri] = useState("");
  const log = useLog();

    useEffect(() => {
        async function getProfileImageUri() {
            try {
                log.debug("getProfileImageUri on userProfileData: ", JSON.stringify(userProfileData));
                const profilePicture = await fetchUserProfileImage(userProfileData.identityId, userProfileData.profilePicture, log);
                setProfilePictureUri(profilePicture);
            } catch (error) {
                log.error('Error saving profile picture in Header: ', JSON.stringify(error));
            }
        }

        getProfileImageUri();
    }, [userProfileData]);

useFocusEffect(
    React.useCallback(() => {
        const getUserProfileData = async () => {
          if (user) {
            fetchedUserProfileData = await fetchUserProfileData();
          }
          setUserProfileData(fetchedUserProfileData);
        };
        getUserProfileData();
    }, [])
  );

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
    log.debug('handleProfilePress...');
    // Navigate to the ProfileScreen and pass the user profile data as params
    navigation.navigate("Profile", { userProfileData });
  };

  return (
  <View style={{backgroundColor: palette.primaryBgColor}}>
  <SafeAreaView style={{marginTop: StatusBar.currentHeight }}>
    <View style={styles.header}>
      <Image
        source={CrowdSyncLogo}
        style={{
          width: 50,
          height: 50,
        }}
      />
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

export default Header;
