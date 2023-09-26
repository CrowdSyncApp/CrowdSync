import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import { useNavigation, StackActions } from "@react-navigation/native";
import { useAuth } from "../QueryCaching";
import styles, { palette, fonts } from "./style";
import CrowdSyncLogo from "../images/Crowdsync_Logo.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLog } from "../CrowdSyncLogManager";

const SplashScreen = () => {
  const navigation = useNavigation();
  const { isLoading, isUserLoggedIn } = useAuth();
  const log = useLog();

  log.debug("Entering splash screen...");

  useEffect(() => {
    async function checkLogin() {
    // Check if isLoading is false and isUserLoggedIn has a value
    log.debug("isLoading: ", JSON.stringify(isLoading));
    log.debug("isUserLoggedIn: ", JSON.stringify(isUserLoggedIn));
    if (!isLoading && isUserLoggedIn !== undefined) {
      if (isUserLoggedIn) {
      await AsyncStorage.removeItem("userProfileData");
        navigation.dispatch(
          StackActions.replace("FindSession")
        );
      } else {
        navigation.dispatch(
          StackActions.replace("Login")
        );
      }
    }
    }
    checkLogin();
  }, [isLoading, isUserLoggedIn, navigation]);

  useEffect(() => {
          navigation.addListener('beforeRemove', nav => {
              // Prevent going back
              if (nav.data.action.type === 'GO_BACK') {
                nav.preventDefault();
              }
            });
     }, [navigation]);

  return (
    <View style={styles.splash}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={CrowdSyncLogo}
          resizeMode="contain"
          style={styles.splashLogo}
        />
        <Text style={styles.splashTitle}>CrowdSync</Text>
      </View>
    </View>
  );
};

export default SplashScreen;
