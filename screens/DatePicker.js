
import React, { useState, useEffect } from "react";
import { Button, View, TouchableOpacity, StyleSheet, Platform, Text } from "react-native";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePicker = (props) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(new Date());
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const formatDate = (date) => {

    return `${date.getDate()}/${date.getMonth() +
      1}/${date.getFullYear()}`;
  };
  const handleConfirm = (date) => {
    setDate(date)
    props.onPickDate(formatDate(date))
    hideDatePicker();
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate)
    setDatePickerVisibility(false)
    console.log(formatDate(currentDate))
    props.onPickDate(formatDate(date))

  };

  return (
    <View>
      <View style={styles.btn}>
        {
          Platform.OS === 'ios' ?
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode='date'
              is24Hour={true}
              display="default"
              onChange={onChange}
            /> :
            <>
              {isDatePickerVisible ?
              <View></View>

                // <DateTimePickerModal
                //   isVisible={isDatePickerVisible}
                //   mode="date"
                //   onConfirm={handleConfirm}
                //   onCancel={hideDatePicker}
                // />
                :
                <TouchableOpacity style={{ color: "#000000" }} onPress={() => showDatePicker()} >
                  <Text>{formatDate(date)}</Text>
                </TouchableOpacity>
              }
            </>

        }
        {/* <TouchableOpacity style={{color:"#000000"}} onPress={showDatePicker} >
           <Text>{formatDate(date)}</Text>
          </TouchableOpacity> */}
        {/* <DateTimePicker
					testID="dateTimePicker"
					value={date}
					mode='date'
					is24Hour={true}
					display="default"
					onChange={onChange}
					/> */}
      </View>
      {/* <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      /> */}
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  btn: {
    paddingLeft: 10,
    color: "#000000",
    justifyContent: "center"
  }
});