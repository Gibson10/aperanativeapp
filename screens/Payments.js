import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import * as Linking from "expo-linking";
import { connect } from "react-redux";
import Constants from "expo-constants";
import { profilePut } from "../services/api";
import { stripeAccount } from "../services/api";
import { WebView } from "react-native-webview";
import SearchBar from "../components/SearchBar";
import Loader from "../screens/components/Loader";
import { setUser } from "../screens/redux/actions/User.js";
import stripeconnect from "../assets/stripeconnect.jpeg";
import Toast from "react-native-root-toast";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";

import { StripeProvider } from "@stripe/stripe-react-native";
// import DateTimePickerModal from "react-native-modal-datetime-picker"

const Payments = (props) => {
  const [isStripePaymentVisible, setTimePickerVisibility] = useState(false);
  const [time, setTime] = useState(new Date());
  const [result, setResult] = useState(null);
  const [newData, setNewData] = useState(null);
  const [isUrl, setIsUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [onboardingUrl, setOnboardingUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const _openBrowserAsync = async () => {
    const link = {
      link: Linking.createURL(""),
      stripeId: props.currentUser.stripeExpressAccount,
    };
    setLoading(true);
    const stripeAccountDetails = await stripeAccount(link);
    setLoading(false);
    setOnboardingUrl(stripeAccountDetails.account.url);
    setIsUrl(true);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setIsUrl(false);
    setOnboardingUrl(null);
  };

  const updateStripePaymentOnboard = async () => {
    const stripeOnboarding = {
      stripeOnboarding: true,
    };
    const updatedAccount = await profilePut(stripeOnboarding);

    if (updatedAccount) {
      const Token = {
        userToken: updatedAccount.access_token,
      };
      Toast.show("Payment added", { position: Toast.positions.CENTER });

      props.dispatch(setUser(updatedAccount.user, Token));
    } else {
    }
    setIsUrl(false);
    setOnboardingUrl(null);
  };

  if (isUrl) {
    return (
      <View>
        <Modal
          visible={showModal}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.modal}>
            <View style={styles.modalContainer}>
              <View style={styles.close}>
                <TouchableOpacity onPress={() => closeModal()}>
                  <MaterialIcons name="clear" color="#000000" size={20} />
                </TouchableOpacity>
              </View>
              <WebView
                styles={styles.container}
                onNavigationStateChange={(e) => {
                  if (e.url == "https://www.apera.us/home")
                    updateStripePaymentOnboard();
                }}
                source={{ uri: onboardingUrl }}
                style={styles.WebView}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {/* <Loader loading={loading}/> */}
        <View>
          <SearchBar
            navigation={props.navigation}
            componentText="Wallet"
            notification={true}
            {...props}
          />
        </View>
        {props.currentUser.stripeOnboarding ? (
          <View style={styles.imageView}>
            <Image
              style={{
                height: 230,
                width: "100%",
                marginTop: 10,
                marginBottom: 10,
              }}
              source={require("../assets/undraw_attached_file_re_0n9b.png")}
            ></Image>

            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                width: 250,
                fontWeight: "600",
              }}
            >
              Payment Information Already Attached
            </Text>

            <View style={[styles.buttonOne, { borderColor: "#FF4000" }]}>
              <TouchableOpacity onPress={() => this.updateCurrentGig()}>
                <Text style={styles.textSign}>Delete Account</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: "40%", alignItems: "center" }}>
              <Image
                style={{ paddingTop: 30 }}
                height={20}
                width={50}
                source={require("../assets/stripeimage1.png")}
              ></Image>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  justifyContent: "center",
                  width: 350,
                }}
              >
                {" "}
                Apera uses Stripe secure payment solutions. We don’t store you
                credit or bank information
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.imageView}>
            <Text
              styles={{
                fontSize: 20,
                fontWeight: "bold",
                fontFamily: "Poppins_700Bold",
                marginBottom: 10,
              }}
            >
              Please add card or bank info to get paid
            </Text>
            {loading ? (
              <ActivityIndicator
                style={{ paddingTop: 20 }}
                size="small"
                color="#0000ff"
              />
            ) : (
              <View></View>
            )}
            <Image
              style={{ height: 220, width: "100%" }}
              source={require("../assets/undraw_Profile_data_re_v81r.png")}
            ></Image>
            <View style={[styles.buttonOne, { borderColor: "#0074EF" }]}>
              <TouchableOpacity onPress={() => _openBrowserAsync()}>
                <Text style={styles.textSignCard}>+ Add Card</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: "40%", alignItems: "center" }}>
              <Image
                style={{ paddingTop: 30 }}
                height={20}
                width={50}
                source={require("../assets/stripeimage1.png")}
              ></Image>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  justifyContent: "center",
                  width: 350,
                }}
              >
                {" "}
                Apera uses Stripe secure payment solutions. We don’t store you
                credit or bank information
              </Text>
            </View>
            {/* </View> */}
          </View>
        )}
      </View>
    );
  }
};

// export default Payments
function mapStateToProps({ status, currentUser }) {
  return {
    status,
    currentUser,
  };
}
export default connect(mapStateToProps)(Payments);

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    // backgroundColor: "#F6F8FA",
  },
  btn: {
    paddingLeft: 10,
    color: "#000000",
    justifyContent: "center",
  },
  button: {
    padding: 15,
    alignItems: "center",
    marginTop: 50,
  },
  WebView: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  signIn: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  imageView: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    // fontSize:20,
  },
  stripeText: {
    fontSize: 20,
    color: "#ff4c00",
  },
  buttonOne: {
    marginTop: 40,
    marginBottom: 40,
    borderWidth: 1,
    margin: 10,
    width: "80%",
    borderRadius: 10,
  },
  textSign: {
    color: "#FF4000",
    fontSize: 16,
    width: "100%",
    textAlign: "center",
    padding: 12,
  },
  textSignCard: {
    color: "#0074EF",
    fontWeight: "bold",
    fontSize: 16,
    width: "100%",
    textAlign: "center",
    padding: 10,
  },
  paymentText: {
    paddingTop: 30,
    fontSize: 30,
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    width: "90%",
    height: "80%",
  },
  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: "center",
  },
  close: {
    alignItems: "flex-end",
    width: "100%",
    paddingRight: 20,
    paddingTop: 40,
  },
});
