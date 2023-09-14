import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles, { palette, fonts } from "./style";
import { API, graphqlOperation } from "aws-amplify";
import { useAuth } from "../QueryCaching";
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { getLocations } from "../src/graphql/queries";

const UserLocation = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const route = useRoute();
  const { userData, sessionId } = route.params;
  const [location, setLocation] = useState(null);
  const [otherUserLocation, setOtherUserLocation] = useState(null);

  useEffect(() => {
    const fetchUserLocations = async () => {
      try {
        let userId;
        if (userData.userId === "1" || userData.userId === "2" || userData.userId === "3" || userData.userId === "4" || userData.userId === "5") {
          userId = "0949d9ce-b0b1-7019-0aba-062ae33bdd92";
        } else {
          userId = userData.userId;
        }
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

        const otherresponse = await API.graphql(
              graphqlOperation(getLocations, { userId: user?.username, sessionId: sessionId })
            );

          const otherUserLocation = otherresponse.data.getLocations;
          setOtherUserLocation({
            latitude: otherUserLocation.latitude,
            longitude: otherUserLocation.longitude,
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
        {location && otherUserLocation ? (
          <MapView
            style={{ flex: 1 }}
            initialRegion={location}
          >
            {/* Your Marker */}
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Your Location"
              description="This is your current location"
            />

            {/* Other User's Marker */}
            <Marker
              coordinate={{
                latitude: otherUserLocation.latitude,
                longitude: otherUserLocation.longitude,
              }}
              title="Other User's Location"
              description="This is the other user's location"
            />

            {/* Polyline to show path */}
            <Polyline
              coordinates={[
                {
                  latitude: location.latitude,
                  longitude: location.longitude,
                },
                {
                  latitude: otherUserLocation.latitude,
                  longitude: otherUserLocation.longitude,
                },
              ]}
              strokeColor="#000" // color of the path
              strokeWidth={2} // width of the path
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
