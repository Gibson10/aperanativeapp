import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  ActivityIndicator,
} from 'react-native';

const ErrorHandling = (props) => {
  const {validationComplete,message } = props;

  return (
      <View>
    {!validationComplete ? (
        <Text style={styles.errorMsg}>{message}</Text>
      ) : (
        <View></View>
      )}
 </View>
  );
};

const styles = StyleSheet.create({
    errorMsg: {
        color: "red",
        padding: 10,
      },
});

export default ErrorHandling;
