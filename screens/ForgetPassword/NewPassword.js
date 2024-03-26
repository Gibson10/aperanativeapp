import React, { Component } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  BackHandler,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { profilePut } from "../../services/api";
import CustomTextInput from "../components/CustomInput";
import {
  Signin,
  REQUIRED_INPUTS,
  SUCCESS_MESSAGE,
  PASSWORD_CONFIRMATION_ERROR,
} from "../../utils/strings";
import Loader from "../../components/Loader";
// import { BarPasswordStrengthDisplay } from "react-native-password-strength-meter";
import PasswordStrengthMeterBar from 'react-native-password-strength-meter-bar';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// import PasswordStrengthChecker from 'react-native-password-strength-checker';


import { Entypo } from "@expo/vector-icons";

export class NewPasswordScreen extends Component {
  state = {
    password: "",
    confirmPassword: "",
    successMessage: "",
    success: false,
    loading: false,
    errorMessage: "",
    error: false,
  };

  textInputChange = (event, name) => {
    this.setState({
      [name]: event,
    });
  };
  submitPassword = async () => {
    const { password, confirmPassword } = this.state;
    if (password.trim() && confirmPassword.trim()) {
      if (password === confirmPassword) {
        this.setState({ loading: true });
        const user = {
          password: this.state.password,
        };
        console.log(user);
        const updatedPassword = await profilePut(user);
        console.log(updatedPassword);
        if (updatedPassword.user) {
          this.setState({
            success: true,
            successMessage: SUCCESS_MESSAGE,
            loading: false,
          });
          this.redirectUser();
        }
      } else {
        this.setState({
          error: true,
          errorMessage: PASSWORD_CONFIRMATION_ERROR,
        });
      }
    } else {
      this.setState({ error: true, errorMessage: REQUIRED_INPUTS });
    }
  };
  redirectUser = () => {
    setTimeout(() => {
      this.props.navigation.navigate(Signin);
    }, 3000);
  };
  componentDidMount() {
    console.log("user", this.props.user);
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  handleBackButton() {
    ToastAndroid.show("Please complete the process", ToastAndroid.SHORT);
    return true;
  }
  render() {
    console.log(this.state.password);
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.loginWidget}>
            <View>
              <Text style={styles.title}>Reset Password</Text>
            </View>
            <Text style={styles.subTitle}>
              Choose a password that has at least 6 characters and a number or
              symbol.
            </Text>
            {this.state.success ? (
              <View>
                <Text style={styles.successMessage}>
                  {this.state.successMessage}
                </Text>
              </View>
            ) : (
              <View></View>
            )}
            {this.state.loading ? (
              <ActivityIndicator
                style={{ paddingLeft: 10 }}
                size="small"
                color="#0000ff"
              />
            ) : (
              <View></View>
            )}
            <CustomTextInput
              name="password"
              placeholder="New Password"
              secureTextEntry={true}
              showSecureEntry={true}
              onChangeText={(e) => this.textInputChange(e, "password")}
            />
            
            <CustomTextInput
              name="password"
              placeholder="Confirm Password"
              secureTextEntry={true}
              showSecureEntry={true}
              onChangeText={(e) => this.textInputChange(e, "confirmPassword")}
            />
              <PasswordStrengthMeterBar password={this.state.password} />
            <View style={{ paddingTop: 10 }}>
              {/* <BarPasswordStrengthDisplay
                width={300}
                password={this.state.password}
              /> */}
             
            </View>
            
            <View style={styles.btnGroup}>
              <View style={styles.backBtn}>
                <Entypo name="chevron-left" size={20} color="black" />
                <TouchableOpacity
                >
                  <Text style={styles.btnText}>Back</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => this.submitPassword()}>
                <View style={styles.cntBtn}>
                  <Text style={styles.btnText}>Submit</Text>
                  <Entypo name="chevron-right" size={20} color="black" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default NewPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "center",
    marginTop: 100,
  },
  successMessage: {
    color: "green",
    fontSize: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  messegeAlign: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginWidget: {
    // alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "500",
    marginTop: 30,
  },
  subTitle: {
    fontSize: 20,
    marginTop: 30,
    marginBottom: 30,
    // width: 235,
    textAlign: "center",
  },
  otpInput: {
    height: 75,
    marginTop: 50,
  },
  instruction: {
    fontSize: 16,
    marginTop: 50,
  },
  btnGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 40,
    marginRight: 40,
    marginTop: 100,
  },
  btnText: {
    fontSize: 18,
  },
  backBtn: {
    marginRight: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  cntBtn: {
    backgroundColor: "#0074ef",
    borderRadius: 50,
    paddingRight: 22,
    paddingLeft: 22,
    paddingTop: 16,
    paddingBottom: 16,
    marginLeft: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  btnImg: {
    // backgroundColor: '#000000',
    marginLeft: 5,
    marginRight: 5,
  },
  lineText: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  line: {
    borderTopWidth: 1,
    width: 30,
    borderColor: "#000000",
    marginLeft: 5,
    marginRight: 5,
    marginTop: 1,
  },
  passwordStrength: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
    alignItems: "center",
    width: 300,
  },
  strength: {
    width: "50%",
    height: 10,
    borderRadius: 10,
    backgroundColor: "green",
  },
  strengthText: {
    fontSize: 16,
  },
});
