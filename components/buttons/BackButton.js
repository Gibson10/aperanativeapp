import React from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'; 

function BackButton(props) {
  return (
    <TouchableOpacity style={styles.container}
      onPress={() => props.navigation.goBack()}>
    <MaterialIcons name="arrow-back-ios" size={24} color="black" />
    </TouchableOpacity >
  );
}
export default BackButton;
const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: '2%'
    padding: 10,
  },
});
