/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Alert } from "react-native";
import { Card } from "react-native-elements";
import { connect } from "react-redux";
import Geocoder from "react-native-geocoding";
import { GOOGLE_MAPS_KEY } from "../../utils/map";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
Geocoder.init(GOOGLE_MAPS_KEY);
class GoogleAutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressLocation: "",
      lat_long: {},
    };

    this.findCoords = (data) => {
      Geocoder.from(data.description)
        .then((json) => {
          var location = json.results[0].geometry.location;

          this.setState({
            addressLocation: data.description,
            lat_long: location,
          });
          this.props.currentCords(location);
        })
        .catch((error) => console.warn(error));
    };
  }

  async getCurrentLocation() {
    try {
      // await this.locationAlert()
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // setErrorMsg("Permission to access location was denied")
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      Geocoder.from(location.coords.latitude, location.coords.longitude)
        .then((json) => {
          console.log("json.results[0]", json.results[0].formatted_address);
          Geocoder.from(json.results[0].formatted_address)
            .then((json) => {
              var location = json.results[0].geometry.location;
              console.log("location", location);
              this.setState({
                addressLocation: json.results[0].formatted_address,
                lat_long: location,
              });
              this.props.currentCords(location);
            })
            .catch((error) => console.warn(error));
        })
        .catch((error) => console.warn(error));
    } catch (err) {
      console.warn(err);
    }
  }
  async componentDidMount() {
    this.getCurrentLocation();
  }

  async locationAlert() {
    console.log("locationAlert", this.props.profile);
    if (!this.props.profile) {
      Alert.alert(
        "Location",
        "This App uses location data to enable us to match you with the closest gigs ( merchants) or Aperatives ( Gig workers) near you, even when the App is closed or not in use",
        [
          {
            text: "Cancel",
            onPress: () => {
              this.setState({ permissionRead: true });
            },
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              this.setState({ permissionRead: true });
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      if (!this.props.currentUser.locationAccepted) {
        Alert.alert(
          "Location",
          "This App uses location data to enable us to match you with the closest gigs ( merchants) or Aperatives ( Gig workers) near you, even when the App is closed or not in use",
          [
            {
              text: "Cancel",
              onPress: () => {
                this.setState({ permissionRead: true });
              },
              style: "cancel",
            },
            {
              text: "OK",
              onPress: async () => {
                console.log(this.props.currentUser._id);
                const locationAccepted = await profilePut({
                  locationAccepted: true,
                });
                if (locationAccepted) {
                  console.log(locationAccepted.user);
                  const Token = {
                    userToken: locationAccepted.access_token,
                  };
                  this.props.dispatch(setUser(locationAccepted.user, Token));
                }

                this.setState({ permissionRead: true });
              },
            },
          ],
          { cancelable: true }
        );
      } else {
      }
    }
  }
  render() {
    console.log("this.state.addressLocation", this.state.addressLocation);

    return (
      <ScrollView
        keyboardShouldPersistTaps={"always"}
        list
        listViewDisplayed={false}
      >
        {/* <Text>Location</Text> */}
        <GooglePlacesAutocomplete
          placeholder={
            this.state.addressLocation
              ? this.state.addressLocation
              : "Your Location"
          }
          placeholderTextColor="#000000"
          styles={{
            zIndex: 3, // works on ios
            elevation: 3,
            placeholderTextColor: "#000000",
          }}
          listViewDisplayed="auto"
          autoFillOnNotFound={true}
          onPress={(data, _ = null) => {
            this.findCoords(data);
          }}
          query={{
            key: "",
            language: "en",
          }}
        />
      </ScrollView>
    );
  }
}

function mapStateToProps({ currentUser }) {
  return {
    currentUser: currentUser,
  };
}
export default connect(mapStateToProps)(GoogleAutoComplete);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
});
