import React from "react";
import { View, Image, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BackArrow from "../images/CrowdSync_Back_Arrow.png";
import styles, { palette, fonts } from "./style";

const SimplifiedHeader = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
  <View style={{backgroundColor: palette.primaryBgColor}}>
  <SafeAreaView style={{marginTop: StatusBar.currentHeight }}>
    <View style={styles.header}>
      <TouchableOpacity onPress={handleGoBack}>
        <Image
          source={BackArrow}
          style={{
            width: 50,
            height: 50,
          }}
        />
      </TouchableOpacity>
    </View>
   </SafeAreaView>
   </View>
  );
};

export default SimplifiedHeader;
