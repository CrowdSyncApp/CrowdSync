import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles, { palette, fonts } from "./style";
import CrowdSyncLogo from "../images/Crowdsync_Logo.png";

const LoadingScreen = () => {
  const navigation = useNavigation();

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

export default LoadingScreen;
