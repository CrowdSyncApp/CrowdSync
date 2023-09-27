import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
  TouchableWithoutFeedback, Animated,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../QueryCaching";
import { startSession, removeSessionData } from "./SessionManager";
import styles, { palette, fonts } from "./style";
import { useHeaderHeight } from "@react-navigation/elements";
import { StatusBar } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import { useLog } from "../CrowdSyncLogManager";
import LoadingScreen from "./LoadingScreen";

import SampleFindSessionMap from "../images/sample_find_session.png";
import SearchIcon from "../images/icons/search_icon.png";
import QRCodeIcon from "../images/icons/scan_qr_icon.png";
import CreateSessionIcon from "../images/icons/create_session_icon.png";
import MenuIcon from "../images/icons/menu_icon.png";

const FindSessionScreen = () => {
  const headerHeight = useHeaderHeight();
  const keyboardVerticalOffset = StatusBar.currentHeight + headerHeight;
  const navigation = useNavigation();
  const {
    user,
    fetchUserProfileData,
    populateTagSet,
    refreshLocation,
    storeInterval,
  } = useAuth();
  const [sessionTitle, setSessionTitle] = useState("General");
  const [location, setLocation] = useState();
  const log = useLog();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollViewRef, setScrollViewRef] = useState(null);
  const [targetIndex, setTargetIndex] = useState(-1);
  const [itemHeights, setItemHeights] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState({
      title: 'General',
    });

    const nearbySessions = [
      {
        title: "Entrepreneur",
        description: "Learn about startups and entrepreneurship",
        tags: ["Entrepreneur", "Founders"],
      },
      {
        title: "Cryptocurrency",
        description: "Discuss the world of cryptocurrencies",
        tags: ["Block chain", "Bitcoin"],
      },
      {
        title: "Machine Learning",
        description: "Explore machine learning technologies",
        tags: ["AI", "ChatGPT"],
      },
    ];

  useFocusEffect(
    React.useCallback(() => {
      log.debug("Entering FindSessionScreen screen...");
      removeSessionData(log); // Should never have session data on this screen
    }, [])
  );

  useEffect(() => {
    removeSessionData(log);

    const requestLocationPermission = async () => {
      try {
        const currLocation = await refreshLocation(log);
        log.debug("location: ", JSON.stringify(currLocation));
        setLocation(currLocation);
      } catch (error) {
        console.error("Error requesting location permission:", error);
        log.error(
          "Error requesting location permission:",
          JSON.stringify(error)
        );
      }
    };

    requestLocationPermission();

    const locationUpdateInterval = setInterval(async () => {
      try {
        requestLocationPermission();
      } catch (error) {
        console.error("Error refreshing location:", error);
        log.error("Error refreshing location:", JSON.stringify(error));
      }
    }, 5 * 60 * 1000); // 5 minutes

    const storeLocationIntervalId = async () => {
      await storeInterval(locationUpdateInterval, log);
    };
    storeLocationIntervalId();
  }, []);

  useEffect(() => {
    if (targetIndex !== -1 && scrollViewRef) {
        console.log("targetIndex changed");
      const targetOffset = targetIndex * 150; // Adjust based on your item height
      scrollViewRef.scrollTo({ y: targetOffset, animated: true });
    }
  }, [targetIndex, scrollViewRef]);

  useEffect(() => {
    navigation.addListener("beforeRemove", (nav) => {
      if (nav.data.action.type === "GO_BACK") {
        nav.preventDefault();
      }
    });
  }, [navigation]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCreateSession = async () => {
      // Toggle the visibility of the modal
        setIsModalVisible(false);
        await handleStartSession();
    };

  const handleCancel = () => {
      // Close the modal and clear the results
      setIsModalVisible(false);
      setModalData({
        title: 'General',
      });
    };

  const handleModalInputChange = (field, text) => {
      // Update the modal data based on the input field
      setModalData({
        ...modalData,
        [field]: text,
      });
    };

  const handleQRCodeScan = () => {
    log.debug("handleQRCodeScan...");
    navigation.navigate("QRScanner");
    setIsMenuOpen(false); // Close the menu after selection
  };

  const handleSessionSearch = () => {
    // Get the search text from the TextInput
    const searchText = searchQuery.toLowerCase(); // Convert to lowercase for case-insensitive search

    // Filter the nearbySessions based on session titles that begin with the search text
    const filteredSessions = nearbySessions.filter(session =>
      session.title.toLowerCase().startsWith(searchText)
    );

    // Set the filtered sessions as the search results
    setSearchResults(filteredSessions);

    // Close the menu after selection
    setIsMenuOpen(false);
  };

  const handleCreateSessionRequest = () => {
    // Function to handle when the "Create Session" is pressed
    // Define the logic for creating a new session here
    setIsMenuOpen(false); // Close the menu after selection
    setIsModalVisible(!isModalVisible);
  };

  const handleStartSession = async () => {
    const userProfileData = await fetchUserProfileData();
    const newSession = await startSession(userProfileData, modalData.title, log);
    log.debug(
      "handleStartSession with userProfileData: " +
        JSON.stringify(userProfileData) +
        " and newSession: " +
        JSON.stringify(newSession)
    );

    if (newSession) {
      navigation.navigate("SessionHome", { sessionData: newSession });
    }
  };

  const handlePopulateTagSet = async () => {
    log.debug("handlePopulateTagSet...");
    try {
      await populateTagSet(log);
    } catch (error) {
      console.error("Error populating TagSet table:", error);
      log.error("Error populating TagSet table:", JSON.stringify(error));
    }
  };

  const renderSessionButtons = () => {
    log.debug("renderSessionButtons...");
    const userGroups =
      user?.signInUserSession?.idToken?.payload["cognito:groups"] || [];
    log.debug("userGroups: ", JSON.stringify(userGroups));

    if (userGroups.includes("CrowdSync_UserPool_Admin")) {
      return (
        <View style={styles.textInputContainer}>
          <View style={{ marginTop: 30 }} />
          <TextInput
            style={styles.textInput}
            placeholder="General"
            placeholderTextColor="black"
            color="black"
            value={sessionTitle}
            onChangeText={(text) => setSessionTitle(text)}
          />
          <View style={{ paddingVertical: 10 }} />
          <Pressable style={styles.basicButton} onPress={handleStartSession}>
            <Text style={styles.buttonText}>Start Session</Text>
          </Pressable>
        </View>
      );
    }

    return null;
  };

  const renderMenu = () => {
    return (
      <View style={overlayStyles.menuContainer}>
        <Pressable style={overlayStyles.menuItem} onPress={handleQRCodeScan}>
          <Image source={QRCodeIcon} style={overlayStyles.menuIcon} />
          <Text style={overlayStyles.menuText}>Scan QR Code</Text>
        </Pressable>
        <Pressable style={overlayStyles.menuItem} onPress={handleCreateSessionRequest}>
          <Image source={CreateSessionIcon} style={overlayStyles.menuIcon} />
          <Text style={overlayStyles.menuText}>Create Session</Text>
        </Pressable>
      </View>
    );
  };

  const handleNearbySessionPress = async (sessionText) => {
    log.debug("handleNearbySessionPress on sessionText: ", sessionText);

    const userProfileData = await fetchUserProfileData();
    const newSession = await startSession(userProfileData, sessionText, log);
    log.debug(
      "handleStartSession with userProfileData: " +
        JSON.stringify(userProfileData) +
        " and newSession: " +
        JSON.stringify(newSession)
    );

    if (newSession) {
      navigation.navigate("SessionHome", { sessionData: newSession });
    }
  };

    const renderSearchResultsDropdown = () => {
        if (searchResults.length === 0) {
          return (
            <View style={overlayStyles.searchResultsContainer}>
              <Text style={overlayStyles.searchResultText}>No results found</Text>
            </View>
          );
        }

        return (
          <View style={overlayStyles.searchResultsContainer}>
            {searchResults.map((result, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSearchResultPress(result)}
              >
                <Text style={overlayStyles.searchResultText}>{result.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      };

    const handleSearchQueryChange = (query) => {
        setSearchQuery(query);
      };

    const handleSearchResultPress = (result) => {
        // Handle the selection of a search result
        // For example, you can navigate to a specific screen or perform an action based on the selected result
      };

  const renderNearbySessions = () => {

  const handleSessionPress = async (session) => {
      // Handle session press here with the session data
      // This function will be defined later
      const userProfileData = await fetchUserProfileData();
          const newSession = await startSession(userProfileData, session.title, log);
          log.debug(
            "handleSessionPress with userProfileData: " +
              JSON.stringify(userProfileData) +
              " and newSession: " +
              JSON.stringify(newSession)
          );

          if (newSession) {
            navigation.navigate("SessionHome", { sessionData: newSession });
          }
    };

    const handleItemLayout = (index, event) => {
        const { height } = event.nativeEvent.layout;
        const updatedItemHeights = [...itemHeights];
        updatedItemHeights[index] = height;
        console.log("updatedItemHeights: ", updatedItemHeights);
        setItemHeights(updatedItemHeights);
      };

    const handleScroll = (event) => {
    console.log("itemHeights: ", itemHeights);
        const { contentOffset, layoutMeasurement } = event.nativeEvent;
        const scrollViewCenterY = contentOffset.y + layoutMeasurement.height / 2;

        let minDistance = Infinity;
        let nearestIndex = -1;

        nearbySessions.forEach((session, index) => {
          const itemLayout = index < itemHeights.length ? itemHeights.slice(0, index).reduce((acc, height) => acc + height, 0) : 0;
          const itemCenterY = itemLayout - scrollViewCenterY;
          const distance = Math.abs(scrollViewCenterY - itemCenterY);

          if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = index;
          }
        });

        console.log("nearestIndex: ", nearestIndex);

        setTargetIndex(nearestIndex);
      };

    return (
        <ScrollView
          ref={(ref) => setScrollViewRef(ref)}
          scrollEventThrottle={16}
          contentContainerStyle={overlayStyles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginBottom: -10 }}>
            {nearbySessions.map((session, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSessionPress(session)}
              >
                <View
                  style={overlayStyles.nearbySessionContainer}
                  onLayout={(event) => handleItemLayout(index, event)}
                >
                  <View style={overlayStyles.sessionInfoContainer}>
                    <Text style={overlayStyles.sessionTitle}>{session.title}</Text>
                    <Text style={overlayStyles.sessionDescription}>
                      {session.description}
                    </Text>
                  </View>
                  <View style={overlayStyles.sessionDetailsContainer}>
                    <View style={overlayStyles.sessionDetailSection}>
                      <Text style={overlayStyles.sessionDetailText}>
                        Your Connections:
                      </Text>
                      <Text style={overlayStyles.sessionDetailText}>Jane Smith, Emily Brown, Michael Wilson</Text>
                    </View>
                    <View style={overlayStyles.sessionDetailSection}>
                      <Text style={overlayStyles.sessionDetailText}>
                        Compatibility:
                      </Text>
                      <Text style={overlayStyles.sessionDetailText}>90%</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      );
    };

  return (
      <>
        {location ? (
          <View style={StyleSheet.absoluteFillObject}>
            <MapView
              style={StyleSheet.absoluteFillObject}
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
            <View style={overlayStyles.topRightContainer}>
            <View style={overlayStyles.circleContainer}>
              <Pressable onPress={handleQRCodeScan}>
                <Image source={QRCodeIcon} style={overlayStyles.qrCodeIcon} />
              </Pressable>
            </View>
              <View style={overlayStyles.circleContainer}>
                <Pressable onPress={handleCreateSessionRequest}>
                  <Image
                    source={CreateSessionIcon}
                    style={overlayStyles.createSessionIcon}
                  />
                </Pressable>
              </View>
              </View>
            <View style={overlayStyles.topLeftButtonContainer}></View>
            <View style={overlayStyles.buttonContainer}>
              <Text style={styles.tertiaryHeaderTitle}>Nearby Sessions</Text>
              {renderNearbySessions()}
            </View>
            {isMenuOpen && renderMenu()}
          </View>
      ) : (
        <LoadingScreen />
      )}
    <Modal visible={isModalVisible} transparent animationType="slide">
            <View style={overlayStyles.modalContainer}>
              <View style={overlayStyles.modalContent}>
                <TextInput
                  style={overlayStyles.modalInput}
                  placeholder="Title"
                  placeholderTextColor="black"
                  onChangeText={(text) => handleModalInputChange('title', text)}
                  value={modalData.title}
                />
                <View style={overlayStyles.modalButtons}>
                  <TouchableOpacity onPress={handleCancel}>
                    <Text style={overlayStyles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleCreateSession}>
                    <Text style={overlayStyles.modalButtonText}>Create Session</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      );
    };

const overlayStyles = StyleSheet.create({
  topBar: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    color: "black", // Set text color to black
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  qrCodeIcon: {
    width: 20,
    height: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 10,
    maxHeight: 200,
    overflow: "hidden",
  },
  scrollViewContent: {
    paddingTop: 20,
  },
  nearbySessionContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  sessionInfoContainer: {
    flex: 1,
    marginRight: 10,
  },
  sessionDetailsContainer: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },
  sessionDescription: {
    fontSize: 14,
    color: "black",
  },
  sessionDetailSection: {
    marginBottom: 10,
  },
  sessionDetailText: {
    color: "black",
  },
  topLeftButtonContainer: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    tintColor: "black", // Adjust the icon color as needed
  },
  menuContainer: {
    position: "absolute",
    top: 80, // Adjust the top position to shift it down
    right: 20, // Position on the right side
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  menuIcon: {
    width: 20,
    height: 20,
  },
  menuText: {
    color: "black",
    fontSize: 16,
  },
  searchResultsContainer: {
      position: "absolute",
      top: 80,
      left: 20,
      right: 20,
      backgroundColor: "white",
      borderRadius: 10,
      elevation: 5,
      maxHeight: 150,
      overflow: "hidden",
    },
    searchResultText: {
      padding: 10,
      fontSize: 16,
      color: "black"
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',
      },
      modalInput: {
        width: '100%',
        borderBottomWidth: 1,
        borderColor: 'black',
        marginVertical: 10,
        padding: 10,
        color: "black",
      },
      modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
      },
      modalButtonText: {
        color: 'black',
        fontSize: 16,
      },
      topRightContainer: {
          position: 'absolute',
          top: 20,
          right: 20,
          flexDirection: 'row',
        },
      circleContainer: {
          width: 40,
          height: 40,
          borderRadius: 20, // Half of the width and height for a circle
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 5, // Add some margin between the circles
              borderWidth: 1, // Add a 1-pixel border
              borderColor: 'black', // Border color
        },
        qrCodeIcon: {
            width: 20,
            height: 20,
          },

          createSessionIcon: {
            width: 20,
            height: 20,
          },
});

export default FindSessionScreen;
