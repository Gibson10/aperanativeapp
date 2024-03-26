/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from "react";
import {
  View,
  Text,
  Platform,
  StatusBar,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import Loader from "../components/Loader";
import Toast from "react-native-root-toast";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import {
  PhoneNumberVerification,
  EXPO_ONLINE_CLIENT,
  EXPO_STANDALONE_CLIENT,
  EXPO_IOS_CLIENT,
} from "../utils/strings";
import { Ionicons } from "@expo/vector-icons";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

import { AuthContext } from "../components/context";
WebBrowser.maybeCompleteAuthSession();
Feather.loadFont();
FontAwesome.loadFont();

const SigninScreen = ({ navigation }) => {
  const { signIn } = React.useContext(AuthContext);

  const [loading, setLoading] = React.useState(false);
  const [token, setToken] = React.useState(null);
  const [user, setUserInfo] = React.useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    // responseType: "id_token",
    expoClientId: EXPO_ONLINE_CLIENT,
    iosClientId: EXPO_IOS_CLIENT,
    androidClientId: EXPO_STANDALONE_CLIENT,
    webClientId:
      "902398275906-0240s767fe2129h71qr5pe3np8e6hed5.apps.googleusercontent.com",
    scopes: ["profile", "email"],
  });

  //   responseType:'id_token',
  const [data, setData] = React.useState({
    username: "",
    password: "",
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
    emailError: { status: false, message: "" },
  });

  const textInputChange = (val) => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        username: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
  };

  const handlePasswordChange = (val) => {
    if (val.trim().length >= 8) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const handleValidUser = (val) => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        isValidUser: false,
      });
    }
  };
  const formatString = (string) => {
    let temp = string;
    temp = temp.replace(/\s+/g, "");
    return temp;
  };

  const validateEmail = (email) => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const changeEyeIcon = () => {
    const secureTextEntry = data.secureTextEntry;
    setData({
      ...data,
      secureTextEntry: !secureTextEntry,
    });
  };

  const loginHandle = async () => {
    try {
      const { username, password } = data;
      if (username.trim() && password.trim()) {
        const newUserName = formatString(username);
        const newPassWord = formatString(password);
        if (!validateEmail(newUserName.trim())) {
          setData({
            ...data,
            emailError: { status: true, message: "Invalid Email" },
          });
          return null;
        }
        setLoading(true);
        const loginData = {
          email: newUserName,
          password: newPassWord,
        };
        const loginStatus = await signIn(loginData);

        if (!loginStatus.status) {
          setLoading(false);
          setData({
            ...data,
            emailError: { status: true, message: loginStatus.data },
          });
        }
      } else {
        setData({
          ...data,
          emailError: { status: true, message: "All fields are required" },
        });
      }
    } catch (error) {
      console.log("Error during signUpResponse:", error);
      console.error("Error details:", error.message, error.stack);
    }
  };
  const signInResponse = async () => {
    console.log(EXPO_ONLINE_CLIENT);
    if (response?.type === "success") {
      console.log("result", response);
      const { authentication, params } = response;
      var decoded = await jwt_decode(params.id_token);
      console.log("login page", decoded);
      const loginData = {
        email: decoded.email,
        password: decoded.sub,
        firstName: decoded.given_name,
        lastName: decoded.family_name,
        profilePicture: decoded.picture,
        status: "google",
      };
      setLoading(true);
      const loginResponse = await signIn(loginData);
      console.log("loginResponse", loginResponse);
      if (!loginResponse.status) {
        setLoading(false);
        setData({
          ...data,
          emailError: { status: true, message: loginResponse.data },
        });
      }
    }
  };

  const getUserInfo = async () => {
    try {
      console.log("tarting Google authentication23");
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      setUserInfo(user);
    } catch (error) {
      // Add your own error handler here
    }
  };
  useEffect(() => {
    // console.log("tarting Google authentication");
    // if (response?.type === "success") {
    //   setToken(response.authentication.accessToken);
    //   getUserInfo();
    // }
  }, []);
  //   useEffect(() => {
  //     async function signIn() {
  //       await signInResponse();
  //     }

  //     signIn();
  //   }, []);
  return (
    <View style={styles.container}>
      {/* <Loader loading={loading} /> */}
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.close}>
        <TouchableOpacity onPress={() => navigation.navigate("SplashScreen")}>
          <MaterialIcons name="clear" color="#000000" size={20} />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={styles.text_header}>Login</Text>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        {data.emailError.status ? (
          <Text style={styles.errorMsg}>{data.emailError.message}</Text>
        ) : (
          <Text style={styles.errorMsg}></Text>
        )}
        <View style={styles.action}>
          <TextInput
            placeholder="Email"
            style={styles.textInput}
            onChangeText={(val) => textInputChange(val)}
            placeholderTextColor="grey"
            onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
            autoCapitalize="none"
          />
        </View>

        <View
          style={[
            styles.action,
            {
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#000000",
              borderBottomColor: "#000000",
              borderBottomWidth: 1,
              alignItems: "center",
              justifyContent: "space-between",
              paddingRight: 10,
            },
          ]}
        >
          <TextInput
            placeholder="Password"
            secureTextEntry={data.secureTextEntry}
            placeholderTextColor="grey"
            style={styles.passwordInput}
            onChangeText={(val) => handlePasswordChange(val)}
            autoCapitalize="none"
          />

          {data.secureTextEntry ? (
            <Ionicons
              name="md-eye-off"
              size={24}
              color="black"
              onPress={changeEyeIcon}
            />
          ) : (
            <Ionicons
              name="md-eye"
              size={24}
              color="black"
              onPress={changeEyeIcon}
            />
          )}

          {/* <Ionicons name="md-eye-off" size={24} color="black" /> */}
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
          {/* <Text style={styles.errorMsg}>Error</Text> */}
          <Text style={{ color: "#FF0000", marginTop: 15 }}>
            Forgot password?
          </Text>
        </TouchableOpacity>

        <View style={styles.button}>
          <TouchableOpacity
            style={{ width: "100%" }}
            onPress={() => loginHandle(data.username, data.password)}
          >
            <LinearGradient
              colors={["#ffffff", "#ffffff"]}
              style={styles.signIn}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <Text
                  style={[styles.textSign, { color: "#006dff", paddingTop: 3 }]}
                >
                  Sign In
                </Text>
                {loading ? (
                  <ActivityIndicator
                    style={{ paddingLeft: 10 }}
                    size="small"
                    color="#0000ff"
                  />
                ) : (
                  <View></View>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        {/* <View style={{ paddingTop: 30 }}>
          <TouchableOpacity onPress={promptAsync} style={styles.googleBtn}>
            <Image
              style={{ height: 40, width: 40 }}
              source={require("../assets/google1.png")}
            ></Image>
            <Text style={styles.googlebtnText}>Sign in with google</Text>
          </TouchableOpacity>
        </View> */}
      </Animatable.View>
    </View>
  );
};
export default SigninScreen;

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 4,
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  close: {
    alignItems: "flex-end",
    width: "100%",
    paddingRight: 20,
    paddingTop: 40,
  },
  text_header: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    padding: 10,
    color: "#05375a",
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#000000",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 0.1,
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 12,
    fontWeight: "bold",
  },
  passwordInput: {
    padding: 10,
    width: "95%",
  },
  errorMsg: {
    color: "red",
    padding: 10,
  },
  googleBtn: {
    display: "flex",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  googlebtnText: {
    color: "#979797",
    fontSize: 23,
    fontWeight: "bold",
    marginLeft: 30,
  },
});
