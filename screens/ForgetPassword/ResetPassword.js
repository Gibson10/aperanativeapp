import React, { Component } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { emailVerification } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ResetPasswordOTP } from "../../utils/strings";
import Loader from "../../components/Loader";
import CustomTextInput from "../components/CustomInput";
import { Entypo } from "@expo/vector-icons";
import ErrorHandling from "../components/Errors/ErrorHandling";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const STORAGE_KEY = "userToken"


export class ResetPasswordScreen extends Component {
  state = {
    email: "",
    phoneNumber: "",
    validationComplete: false,
    loading: false,
    errorMessage: "",
  };
  textInputChange = (event, name) => {
    console.log(event);
    this.setState({
      [name]: event,
    });
  };
  validationComplete = async () => {
    this.setState({ validationComplete: true });
  };

  async submitResetPasswordRequest() {
    const { email, phoneNumber, validationComplete } = this.state;
    if (email.trim() || phoneNumber.trim()) {
      const user = {
        email: email,
      };
      this.setState({ loading: true });
      const verifiedUser = await emailVerification(user);
      if (verifiedUser.user) {
        await AsyncStorage.setItem(STORAGE_KEY, verifiedUser.token);
        this.setState({ loading: false });
        this.props.navigation.navigate(ResetPasswordOTP,{user:verifiedUser.user._id});
      } else {
        this.setState({
          loading: false,
          validationComplete: false,
          errorMessage: verifiedUser.error,
        });
      }
    }
  }

  render() {
    return (
      <SafeAreaWrapper>
        <KeyboardAwareScrollView
					style={styles.containerView}
					resetScrollToCoords={{ x: 0, y: 0 }}
					scrollEnabled={true}
				>
          <View style={styles.loginWidget}>
            <View>
              <Text style={styles.title}>Reset Password</Text>
            </View>
            <Text style={styles.subTitle}>
              Confirm your email to receive a one-time verification code.
            </Text>
            <ErrorHandling
              validationComplete={this.state.validationComplete}
              message={this.state.errorMessage}
            />
            <CustomTextInput
              name="email"
              placeholder="Email"
              onChangeText={(e) => this.textInputChange(e, "email")}
              validationComplete={() => this.validationComplete()}
            />
            <View style={styles.btnGroup}>
              <View style={styles.backBtn}>
                <Entypo name="chevron-left" size={20} color="black" />
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}
                >
                  <Text style={styles.btnText}>Back</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => this.submitResetPasswordRequest()}
              >
                <View>

                  <LinearGradient
                    start={{ x: -1, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={["#0074ef", "#0074ef"]}
                    style={styles.button}
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
                          { color: "#ffffff", paddingTop: 3 },
                        ]}
                      >
                        Continue
                      </Text>
                      {this.state.loading ? (
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
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaWrapper>
    );
  }
}

const mapStateToProps = ({ currentUser }) => {
  return {
    currentUser,
  };
};

export default connect(mapStateToProps)(ResetPasswordScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  containerView: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    width: '100%',
    padding: 20,
},
  loginWidget: {
    alignItems: "center",
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
    width: 235,
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
    backgroundColor: "#95C6A9",
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
  codeFieldRoot: { marginTop: 20 },
  button: {
    marginTop: 40,
    marginBottom: 40,
    padding: 20,
    width: "100%",
    borderRadius: 14,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cell: {
    width: 50,
    height: 50,
    fontSize: 24,
    paddingTop: 10,
    borderWidth: 0.5,
    borderColor: "#45D036",
    textAlign: "center",
    textAlignVertical: "center",
    backgroundColor: "#ffffff",
    marginRight: 5,
  },
  focusCell: {
    borderColor: "#000",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold",
  },
});
