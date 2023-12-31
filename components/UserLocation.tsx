import React, { useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import styles, { palette, fonts } from "./style";
import { API, graphqlOperation } from "aws-amplify";
import { useAuth } from "../QueryCaching";
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { getLocations } from "../src/graphql/queries";
import { useLog } from "../CrowdSyncLogManager";

const UserLocation = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const route = useRoute();
  const log = useLog();
  const { userData, sessionId } = route.params;
  const [location, setLocation] = useState(null);
  const [otherUserLocation, setOtherUserLocation] = useState(null);

    log.debug("Entering UserLocation screen on userData: " + JSON.stringify(userData) + " and sessionId: " + JSON.stringify(sessionId));

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
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
          log.debug('getLocations response: ', JSON.stringify(response));

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

          log.debug('getLocations otherresponse', JSON.stringify(otherresponse));

          const otherUserLocation = otherresponse.data.getLocations;
          setOtherUserLocation({
            latitude: otherUserLocation.latitude,
            longitude: otherUserLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        } catch (error) {
          console.error("Error fetching user locations:", error);
          log.error("Error fetching user locations:", JSON.stringify(error));
        }
      };

      fetchData();
    }, [userData.userId, sessionId, setLocation, setOtherUserLocation])
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
      <Image
          source={{ uri: "https://www.thebalancemoney.com/thmb/OYJMT9EXjkDIQNx9k-McfXkwZ0Y=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/business-people-networking-in-office-lobby-719876715-5ae6212ceb97de0039a49a3c.jpg" }}
          style={{
            width: 350,
            height: 350,
            resizeMode: "contain",
            marginTop: -40,
            marginBottom: -40,
          }}
        />
        <View
          style={{
            backgroundColor: "#AAA", // White background
            padding: 10, // Add padding to create the white box
            borderRadius: 10,
          }}
        >
        <Text style={styles.buttonText}>I am near the front entrance!</Text>
        </View>
      </View>
    </View>
    </ScrollView>
  );
};

export default UserLocation;
