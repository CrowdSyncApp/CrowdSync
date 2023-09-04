import React from "react";
import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles, { palette, fonts } from "./style";
import MapView, { Marker } from 'react-native-maps';

const UserLocation = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const initialRegion = {
    latitude: 37.78825, // Set to your desired latitude
    longitude: -122.4324, // Set to your desired longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
      <View style={styles.index}>
        <View style={styles.div}>
            <MapView
                style={{ flex: 1 }}
                initialRegion={initialRegion}>
              </MapView>
        </View>
      </View>
  );
};

export default UserLocation;
