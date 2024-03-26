/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import {
  View,
  Text,
  Platform,
  StatusBar,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-root-toast";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { acceptGig } from "../services/api";
import Loader from "../components/Loader";
import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";

import { AuthContext } from "../components/context";
import SearchBar from "../components/SearchBar";
import { connect } from "react-redux";

Feather.loadFont();
FontAwesome.loadFont();
class BusinessProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  async acceptGig() {
    const businessProfile = this.props.gig;
    const gig = {
      gigId: businessProfile._id,
      gigCreator: businessProfile.gigCreator,
    };
    this.setState({ loading: true });
    const acceptedGig = await acceptGig(this.props.currentUser._id, gig);
    if (acceptedGig) {
      this.setState({ loading: false });
      Toast.show(acceptedGig.message, Toast.SHORT);
      this.props.closeModal();
      this.props.navigation.navigate("CurrentGig");
    }
  }

  render() {
    const { gig } = this.props;
    const businessProfile = gig;
    //  console.log(businessProfile)
    return (
      <View style={styles.container}>
        {/* <Loader loading={this.state.loading} /> */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.close}>
            <TouchableOpacity onPress={() => this.props.closeModal()}>
              <MaterialIcons name="clear" color="#000000" size={20} />
            </TouchableOpacity>
          </View>

          {this.state.loading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <View></View>
          )}
          <View style={styles.detailscard}>
            <View>
              <TouchableOpacity>
                <View style={styles.profileImage}>
                  <Image
                    source={
                      businessProfile.gigCreator.profilePhoto
                        ? {
                            uri: businessProfile.gigCreator.profilePhoto,
                          }
                        : require("../assets/profile.png")
                    }
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.details}>
              <View>
                <Text style={styles.name}>
                  {businessProfile.gigCreator.firstName}{" "}
                  {businessProfile.gigCreator.lastName}
                </Text>
              </View>
              <View style={styles.rating}>
                <Text style={styles.ratingTitle}>Rating 4.0</Text>
                <View></View>
              </View>
            </View>
          </View>

          <Text style={styles.title}>Hiring (Skills)</Text>
          <View style={styles.skills}>
            {businessProfile.preferredSkills.map((item) => (
              <View style={{ borderRadius: 10 }} key={item}>
                <Text style={styles.skillSet}>{item}</Text>
              </View>
            ))}
          </View>
          <View style={styles.taskDetails}>
            <View style={styles.calenderTitle}>
              <Image source={require("../assets/calendar.png")} />
              <Text style={styles.ctitle}>Available to work</Text>
            </View>
            <Text style={styles.timing}>{businessProfile.shiftDate}</Text>
            <Text style={styles.timing}>
              {businessProfile.startTime} to {businessProfile.endTime}
            </Text>
            <View style={styles.wages}>
              <Text style={styles.ctitle}>Wages:</Text>
              <Text style={styles.price}>
                ${Math.round(businessProfile.hourWage * 0.9)}
                /hr
              </Text>
            </View>
          </View>

          <View style={styles.about}>
            <Text style={styles.atitle}>About the work</Text>
            <Text style={styles.aboutDetails}>{businessProfile.gigName}</Text>
          </View>
          <View style={styles.about}>
            <Text style={styles.atitle}>Special Instructions</Text>
            <Text style={styles.aboutDetails}>
              {businessProfile.instructions}
            </Text>
          </View>

          <View style={styles.button}>
            <TouchableOpacity onPress={() => this.acceptGig()}>
              <View>
                <Text style={styles.btnTitle}>Accept</Text>
                <View style={styles.btnTick}>
                  <Image source={require("../assets/check.png")} />
                </View>
              </View>
            </TouchableOpacity>

            <View>
              <TouchableOpacity onPress={() => this.props.closeModal()}>
                <Text style={styles.btnTitle}>Reject</Text>
                <View style={styles.btnCross}>
                  <Image source={require("../assets/cross.png")} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ currentUser, login }) => {
  return {
    currentUser,
    login,
  };
};

export default connect(mapStateToProps)(BusinessProfile);

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // paddingTop: 50,
  },
  detailscard: {
    margin: 16,
    height: 94,
    flexDirection: "row",
  },
  profileImage: {
    width: 83,
    height: 83,
    borderRadius: 100,
    overflow: "hidden",
    marginRight: 15,
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
    backgroundColor: "gray",
  },
  details: {
    marginTop: 15,
    marginRight: 15,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  rating: {
    flexDirection: "row",
  },
  ratingTitle: {
    fontSize: 10,
    marginRight: 15,
  },
  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 16,
    marginLeft: 25,
  },
  skillSet: {
    backgroundColor: Platform.OS === "ios" ? "#ffffff" : "#ededed",
    color: "#006dff",
    fontSize: 10,
    fontWeight: "bold",
    borderRadius: 50,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 8,
    marginLeft: 0,
  },
  close: {
    alignItems: "flex-end",
    width: "100%",
    paddingRight: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 25,
    marginTop: 16,
  },
  taskDetails: {
    borderColor: "#c4c4c4",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    margin: 16,
  },
  calenderTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  ctitle: {
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 10,
  },
  timing: {
    fontSize: 10,
    marginTop: 10,
    marginLeft: 30,
  },
  wages: {
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 10,
  },
  price: {
    fontSize: 12,
    fontWeight: "bold",
    color: "green",
    marginLeft: 5,
  },
  openGig: {
    fontSize: 12,
    fontWeight: "bold",
    color: "green",
    marginLeft: 5,
  },
  closeGig: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#f64f4f",
    marginLeft: 5,
  },
  about: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 10,
  },
  atitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  aboutDetails: {
    fontSize: 10,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#ffffff",
    height: 130,
    // margin: 60,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 100 },
    shadowOpacity: 0.15,
    borderRadius: 10,
  },
  btnTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  btnTick: {
    backgroundColor: "#3eb770",
    width: 86,
    height: 60,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnCross: {
    backgroundColor: "#f64f4f",
    width: 86,
    height: 60,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
