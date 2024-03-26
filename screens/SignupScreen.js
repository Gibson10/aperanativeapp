/* eslint-disable react-native/no-inline-styles */
import React, { Component, useEffect } from "react";
import {
  View,
  Text,
  Platform,
  StatusBar,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import Toast from "react-native-root-toast";
import * as Animatable from "react-native-animatable";
import {
  PhoneNumberVerification,
  EXPO_ONLINE_CLIENT,
  EXPO_STANDALONE_CLIENT,
  EXPO_IOS_CLIENT,
} from "../utils/strings";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import Loader from "../components/Loader";
import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import jwt_decode from "jwt-decode";
import PasswordStrengthMeterBar from "react-native-password-strength-meter-bar";

import { AuthContext } from "../components/context";

Feather.loadFont();
FontAwesome.loadFont();
const SignupScreen = ({ navigation }) => {
  const { signUp } = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: EXPO_ONLINE_CLIENT,
    iosClientId: EXPO_IOS_CLIENT,
    androidClientId: EXPO_STANDALONE_CLIENT,
    webClientId: "GOOGLE_GUID.apps.googleusercontent.com",
    scopes: ["profile", "email"],
  });

  const [data, setData] = React.useState({
    email: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    accountType: "operative",
    confirmpassword: "",
    check_textInputChange: false,
    secureTextEntry: true,
    secureTextEntryConfirm: true,
    isValidUser: true,
    isValidPassword: true,
    emailError: { status: false, message: "" },
    passwordError: { status: false, message: "" },
  });

  const textInputChange = (event, name) => {
    const { text } = event.nativeEvent;
    console.log(text);
    setData({
      ...data,
      [name]: text,
    });
  };

  const handlePasswordChange = (event, name) => {
    const { text } = event.nativeEvent;

    if (text.trim().length >= 8) {
      setData({
        ...data,
        [name]: text,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        [name]: text,
        isValidPassword: false,
      });
    }
  };
  const changeEyeIcon = () => {
    const secureTextEntry = data.secureTextEntry;
    setData({
      ...data,
      secureTextEntry: !secureTextEntry,
    });
  };

  const changeEyeIconConfirm = () => {
    const secureTextEntryConfirm = data.secureTextEntryConfirm;
    setData({
      ...data,
      secureTextEntryConfirm: !secureTextEntryConfirm,
    });
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

  const registerHandle = async () => {
    const { email, firstName, lastName, password, accountType } = data;
    if (
      email.trim() &&
      firstName.trim() &&
      lastName.trim() &&
      password.trim() &&
      accountType.trim()
    ) {
      if (!validateEmail(email.trim())) {
        setData({
          ...data,
          emailError: { status: true, message: "Invalid Email" },
        });
        return null;
      }
      data.email = formatString(email);
      data.firstName = formatString(firstName);
      data.lastName = formatString(lastName);
      data.password = formatString(password);
      if (data.confirmpassword === password) {
        setLoading(true);
        const registerStatus = await signUp(data, navigation);
        if (!registerStatus.status) {
          setLoading(false);
          setData({
            ...data,
            emailError: { status: true, message: registerStatus.data },
          });
        }
      } else {
        setData({
          ...data,
          passwordError: {
            status: true,
            message: "Please use matching passwords",
          },
        });
      }
    } else {
      setData({
        ...data,
        emailError: { status: true, message: "All fields are required" },
      });
    }
  };

  const signUpResponse = async () => {
    try {
      const result = await promptAsync();
      console.log("result", result);
      if (result.type === "success") {
        const { authentication, params } = result;
        var decoded = await jwt_decode(params.id_token);
        console.log("decoded", decoded);
        const registerData = {
          email: decoded.email,
          password: decoded.sub,
          firstName: decoded.given_name,
          lastName: decoded.family_name,
          accountType: "operative",
          profilePhoto: decoded.picture,
          status: "google",
        };
        setLoading(true);

        const registerStatus = await signUp(registerData, navigation);

        if (!registerStatus.status) {
          setLoading(false);
          setData({
            ...data,
            emailError: { status: true, message: registerStatus.data },
          });
        }
      }
    } catch (error) {
      //   console.log("error", error);
      console.log("Error during signUpResponse:", error);
      console.error("Error details:", error.message, error.stack);
    }
  };
  useEffect(() => {
    // async function signUp() {
    //   await signUpResponse();
    // }
    // signUp();
  }, []);

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
        <Text style={styles.text_header}>
          {" "}
          <FontAwesome name="user-o" color="#05375a" size={20} /> Get Started
          Quickly
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <Animatable.View animation="fadeInUpBig" style={styles.footer}>
            {data.emailError.status ? (
              <Text style={styles.errorMsg}>{data.emailError.message}</Text>
            ) : (
              <Text style={styles.errorMsg}></Text>
            )}

            <View style={styles.action}>
              <TextInput
                name="firstName"
                placeholder="First Name"
                style={styles.textInput}
                autoCapitalize="words"
                placeholderTextColor="grey"
                value={
                  data.firstName.charAt(0).toUpperCase() +
                  data.firstName.slice(1)
                }
                onChange={(event) => textInputChange(event, "firstName")}
                onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
              />
              <FontAwesome icon="check-circle" color="green" size={20} />
            </View>

            <View style={styles.action}>
              <TextInput
                name="lastName"
                placeholder="Last Name"
                style={styles.textInput}
                autoCorrect={true}
                autoCapitalize="words"
                value={
                  data.lastName.charAt(0).toUpperCase() + data.lastName.slice(1)
                }
                placeholderTextColor="grey"
                onChange={(event) => textInputChange(event, "lastName")}
                onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
              />
              <FontAwesome icon="check-circle" color="green" size={20} />
            </View>

            <View style={styles.action}>
              <TextInput
                name="email"
                placeholder="Email"
                style={styles.textInput}
                autoCapitalize="none"
                onChange={(event) => textInputChange(event, "email")}
                placeholderTextColor="grey"
                onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
              />
              <FontAwesome icon="check-circle" color="green" size={20} />
            </View>
            {data.passwordError.status ? (
              <Text style={styles.errorMsg}>{data.passwordError.message}</Text>
            ) : (
              <></>
            )}

            <View
              style={[
                styles.action,
                {
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#000000",
                  borderBottomColor: "#000000",
                  borderBottomWidth: 1,
                  // alignItems:"center",
                  justifyContent: "space-between",
                  padding: 10,
                },
              ]}
            >
              <TextInput
                name="password"
                placeholder="Password"
                secureTextEntry={data.secureTextEntry}
                placeholderTextColor="grey"
                style={styles.passwordInput}
                // onChangeText={(val) => handlePasswordChange(val)}
                onChange={(event) => handlePasswordChange(event, "password")}
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
            <PasswordStrengthMeterBar password={data.password} />

            <View
              style={[
                styles.action,
                {
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#000000",
                  borderBottomColor: "#000000",
                  borderBottomWidth: 1,
                  // alignItems:"center",
                  justifyContent: "space-between",
                  padding: 10,
                },
              ]}
            >
              <TextInput
                name="confirmpassword"
                placeholder="Confirm Password"
                secureTextEntry={data.secureTextEntryConfirm}
                placeholderTextColor="grey"
                style={styles.passwordInput}
                // onChangeText={(val) => handlePasswordChange(val)}
                onChange={(event) =>
                  handlePasswordChange(event, "confirmpassword")
                }
                autoCapitalize="none"
              />

              {data.secureTextEntryConfirm ? (
                <Ionicons
                  name="md-eye-off"
                  size={24}
                  color="black"
                  onPress={changeEyeIconConfirm}
                />
              ) : (
                <Ionicons
                  name="md-eye"
                  size={24}
                  color="black"
                  onPress={changeEyeIconConfirm}
                />
              )}

              {/* <Ionicons name="md-eye-off" size={24} color="black" /> */}
            </View>

            <View style={styles.button}>
              <TouchableOpacity
                style={{ width: "100%" }}
                onPress={() => registerHandle(data.username, data.password)}
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
                      style={[
                        styles.textSign,
                        { color: "#006dff", paddingTop: 3 },
                      ]}
                    >
                      Sign Up
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
                <Text style={styles.googlebtnText}>Sign Up with Google</Text>
              </TouchableOpacity>
            </View> */}
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignupScreen;

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
    paddingBottom: 20,
  },
  footer: {
    flex: 4,
    backgroundColor: "#f4f4f4",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 20,
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
    borderWidth: 1,
    borderColor: "#000000",
    marginBottom: 20,
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
    marginBottom: 20,
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
  passwordInput: {
    // padding: 10,
    width: "95%",
  },
});
