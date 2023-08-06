import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../QueryCaching";

const LoadingScreen = ({ isUserLoggedIn }) => {
  const navigation = useNavigation();
  const { fetchUserProfileData  } = useAuth();

  useEffect(() => {
    // Navigate based on user's login status
    if (isUserLoggedIn === true) {

      // Fetch user data from DynamoDB
      await fetchUserProfileData();

      // User is logged in, navigate to FindSession screen or other screens
      navigation.navigate("FindSession");
    } else if (isUserLoggedIn === false) {
      // User is not logged in, navigate to Login screen or other screens
      navigation.navigate("Login");
    }
  }, [isUserLoggedIn, navigation]);

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

export default LoadingScreen;
