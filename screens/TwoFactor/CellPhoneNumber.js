import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { VerifyCode } from "../../utils/strings";
import { phoneNumberVerification } from "../../services/api";
import { LinearGradient } from "expo-linear-gradient";
import PhoneInput from "react-native-phone-number-input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export const CellPhoneNumber = (props) => {
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationComplete, setValidationComplete] = useState(true);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  // const phoneInput = useRef<PhoneInput>(null);

  const submitPhoneNumber = async () => {
    console.log(value);
    if (value.length === 10) {
      const number = {
        phoneNumber: formattedValue,
      };
      console.log(number);
      setLoading(true);
      const phoneUpdate = await phoneNumberVerification(number);
      console.log(phoneUpdate);

      if (phoneUpdate.user) {
        setLoading(false);
        props.navigation.navigate(VerifyCode);
      }
    } else {
      setLoading(false);
      setErrorMessage("Please enter a valid phone number");
      setShowMessage(true);
    }
  };
  // console.log("formattedValue",formattedValue)
  return (
    <View style={styles.root}>
      {/* <BackButton /> */}
      <KeyboardAwareScrollView
        style={styles.container}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
      >
        <View style={styles.container}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 100,
            }}
          >
            {/* <Image style={styles.logo}  source={require("../assets/CelipaIcon.png")}></Image>  */}
          </View>
          <Text style={styles.title}>Enter your cellphone number </Text>
          <Text style={styles.subText}>
            Good to see you again. Enter your mobile number below to
            authenticate your account.{" "}
          </Text>
          {showMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : (
            <View></View>
          )}
          <View style={styles.phoneInput}>
            <PhoneInput
              // ref={phoneInput}
              defaultValue={value}
              defaultCode="US"
              layout="first"
              onChangeText={(text) => {
                setValue(text);
              }}
              onChangeFormattedText={(text) => {
                setFormattedValue(text);
              }}
              withDarkTheme
              withShadow
              autoFocus
            />
          </View>
          <Text style={styles.infoText}>
            We will send you a text with a verification code. Message and data
            rates may apply.
          </Text>
          <TouchableOpacity>
            <Text style={styles.infoTextUnderline}>
              Learn what happens when your number changes.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.phoneNumber}
            onPress={() => submitPhoneNumber()}
          >
            <LinearGradient
              start={{ x: -1, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={["#45D036", "#66DD0F"]}
              style={styles.btn}
            >
              {/* <Text style={styles.btnText}>Continue</Text> */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <Text style={[styles.btnText]}>Continue</Text>
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
      </KeyboardAwareScrollView>
    </View>
  );
};

export default CellPhoneNumber;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    width: "100%",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    width: "100%",
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    // textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    // textAlign: 'center',
    marginBottom: 40,
  },
  phoneNumber: {
    marginBottom: "25%",
    alignItems: "center",
  },
  btn: {
    zIndex: 1,
    padding: 15,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "10%",
    width: "65%",
  },
  btnText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
  },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 50,
    height: 50,
    // borderRadius: 15,
    fontSize: 24,
    borderWidth: 0.5,
    paddingTop: 10,
    borderColor: "#DFE2E5",
    textAlign: "center",
    textAlignVertical: "center",
    backgroundColor: "#ffffff",
  },
  focusCell: {
    borderColor: "#000",
  },
  infoText: {
    fontSize: 14,
    marginTop: 20,
    // marginHorizontal: 20
  },
  infoTextUnderline: {
    fontSize: 14,
    marginBottom: 30,
    // marginHorizontal: 20,
    textDecorationLine: "underline",
  },
  phoneInput: {
    width: "100%",
  },
});
