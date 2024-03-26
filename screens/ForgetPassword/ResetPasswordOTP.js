import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { verification } from "../../services/api";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { NewPassword } from "../../utils/strings";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Loader from "../../components/Loader";
import { LinearGradient } from "expo-linear-gradient";
import ErrorHandling from "../components/Errors/ErrorHandling";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "userToken";

const ResetPasswordOtp = (props) => {
  const CELL_COUNT = 5;
  const [value, setValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationComplete, setValidationComplete] = useState(true);
  const [user, setNewUser] = React.useState({});
  const [loading, setLoading] = useState(false);
  const [token, setNewToken] = React.useState("");

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [prop, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const setNewValue = async (value) => {
    console.log(value);
    setValue(value);
    if (value.length === CELL_COUNT) {
      const tagcode = {
        code: value,
      };

      const verifiedCode = await verification(tagcode);
      console.log(verifiedCode);
      if (verifiedCode.user) {
        props.navigation.navigate(NewPassword);
        await AsyncStorage.setItem(STORAGE_KEY, verifiedCode.token);
      } else {
        setValidationComplete(false);
        setErrorMessage(verifiedCode.error);
      }
    } else {
    }
  };



  const resendCode = async () => {

  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.loginWidget}>
          <View>
            <Text style={styles.title}>Verification</Text>
          </View>
          <Text style={styles.subTitle}>
            Check your email for a one-time verification code and enter it
            below.
          </Text>
          <ErrorHandling
            validationComplete={validationComplete}
            message={errorMessage}
          />
          <TouchableOpacity onPress={() => resendCode()}>
            <Text style={styles.instruction}>Didn’t get a code? Resend </Text>
          </TouchableOpacity>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setNewValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}

            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />

          <View style={styles.btnGroup}>
            <View style={styles.backBtn}>
              <Entypo name="chevron-left" size={20} color="black" />
              <Text style={styles.btnText}>Back</Text>
            </View>

            <TouchableOpacity>
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
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ResetPasswordOtp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  loginWidget: {
    alignItems: "center",
  },
  errorMsg: {
    color: "red",
    padding: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "500",
  },
  subTitle: {
    fontSize: 20,
    marginTop: 30,
    width: 235,
    textAlign: "center",
  },
  otpInput: {
    marginTop: 50,
    flexDirection: "row",
  },
  otpContainer: {
    width: 50,
    height: 75,
    backgroundColor: "#888888",
    margin: 5,
    padding: 10,
    borderRadius: 4,
  },
  otpCode: {
    fontWeight: "bold",
    fontSize: 38,
  },
  instruction: {
    fontSize: 16,
    marginTop: 50,
  },
  instructionResend: {
    fontSize: 16,
    marginTop: 50,
    color: "green",
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
    marginLeft: 5,
    marginRight: 5,
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
});
