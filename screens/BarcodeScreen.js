/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import {
  View,
  Text,
  Button,
  Platform,
  StatusBar,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { updateGigStatus } from "../services/api";
import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import Toast from "react-native-root-toast";

import SearchBar from "../components/SearchBar";
import { connect } from "react-redux";
import Loader from "../components/Loader";

Feather.loadFont();
FontAwesome.loadFont();

const BarcodeScreen = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loader, setLoader] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
      console.log(props.route.params.status);
      setStatus(props.route.params.status);
      // setStatus(props.route.params.status)
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    try {
      const gigdata = JSON.parse(data ? data : "");

      if (gigdata.gigStatus) {
        const status1 = {
          status: status,
        };
        setLoader(true);
        const gigStatus = await updateGigStatus(gigdata.gigId, status1);
        console.log("gigStatus", gigStatus);
        if (gigStatus) {
          Toast.show(`Successful ${status.status}`);
          setLoader(false);
          props.navigation.navigate("MatchedGigs");
        } else {
          setLoader(false);
          Toast.show(`There was an error, please try again `);
        }
      } else {
        Toast.show(`That is an invalid QR code`);
      }
    } catch (e) {}
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Loader loading={loader} />
      <View>
        <SearchBar
          navigation={props.navigation}
          componentText="Scan Gig"
          {...props}
        />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />

        {scanned && (
          <Button
            title={"Tap to Scan Again"}
            onPress={() => setScanned(false)}
          />
        )}
      </View>
    </View>
  );
};

export default BarcodeScreen;
// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    marginTop: 120,
    flexDirection: "row",
    alignItems: "center",
  },
  footer: {
    flex: 7,
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
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: "38%",
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
    borderWidth: 3,
    borderColor: "#ffffff",
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
});
