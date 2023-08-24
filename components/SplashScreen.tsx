import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../QueryCaching';

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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SplashScreen;
