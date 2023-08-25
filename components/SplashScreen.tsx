import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../QueryCaching';
import styles, { palette, fonts } from './style';
import CrowdSyncLogo from "../images/Crowdsync_Logo.png";

const SplashScreen = () => {
  const navigation = useNavigation();
  const { isLoading, isUserLoggedIn } = useAuth();

    useEffect(() => {
      // Check if isLoading is false and isUserLoggedIn has a value
      if (!isLoading && isUserLoggedIn !== undefined) {
        if (isUserLoggedIn) {
          navigation.navigate("FindSession");
        } else {
          navigation.navigate("Login");
        }
      }
    }, [isLoading, isUserLoggedIn, navigation]);

  return (
  <View style={styles.splash}>
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image source={CrowdSyncLogo} resizeMode="contain" style={styles.splashLogo} />
      <Text style={styles.headerTitle}>CrowdSync</Text>
    </View>
    </View>
  );
};

export default SplashScreen;
