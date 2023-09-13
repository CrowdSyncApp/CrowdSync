import React, { useEffect, useState } from "react";
import { View, PermissionsAndroid, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles, { palette, fonts } from "./style";
import { API, graphqlOperation } from "aws-amplify";
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { getLocations } from "../src/graphql/queries";

const UserLocation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userData, sessionId } = route.params;
  const [location, setLocation] = useState();

useEffect(() => {
    // Replace this with your actual GraphQL query
    const fetchUserLocations = async () => {
      try {
       const userId = userData.userId;
       console.log("userId", userId);
       console.log("sessionId", sessionId);
        const response = await API.graphql(
          graphqlOperation(getLocations, { userId: userId, sessionId: sessionId })
        );

        const userLocation = response.data.getLocations;
        setLocation({
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error("Error fetching user locations:", error);
      }
    };

    fetchUserLocations(); // Call the GraphQL operation to fetch user locations
  }, []);

  return (
      <View style={styles.index}>
        <View style={styles.div}>
            {location ? (
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={location}
                >
                  <Marker
                    coordinate={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                    }}
                    title="Your Location"
                    description="This is your current location"
                  />
                </MapView>
              ) : (
                <Text>Loading...</Text> // Display a loading indicator while waiting for location
              )}
        </View>
      </View>
  );
};

export default UserLocation;
