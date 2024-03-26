import React, { useState, useEffect } from "react"
import {
	Button,
	View,
	TouchableOpacity,
	StyleSheet,
	Platform,
	Text,
} from "react-native"
// import DateTimePickerModal from "react-native-modal-datetime-picker"
import DateTimePicker from '@react-native-community/datetimepicker';


const DatePicker = (props) => {
	const [isDatePickerVisible, setTimePickerVisibility] = useState(false)
	const [time, setTime] = useState(new Date())
	const [show, setShow] = useState(false);

	const showDatePicker = () => {
		setTimePickerVisibility(true);
	}

	const hideDatePicker = () => {
		setTimePickerVisibility(false)
	}

	const formatDate = (time) => {
	const hours=time.getHours()
	const ampm = hours >= 12 ? 'pm' : 'am';
	const minutes=time.getMinutes() <10? `0${time.getMinutes()}`:`${time.getMinutes()}`
		return `${hours}:${minutes} ${ampm}`
	}
	const handleConfirm = (date) => {

		setTime(date)
		if (props.status === "start") {
			props.onPickTime(formatDate(date), props.status)
		} else {
			props.onPickTime(formatDate(date), props.status)
		}
		hideDatePicker()
	}

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setTime(currentDate)
		console.log(formatDate(currentDate))
		if (props.status === "start") {
		props.onPickTime(formatDate(currentDate), props.status)
		} else {
	 	props.onPickTime(formatDate(currentDate), props.status)
}

	  };

	return (
		<View>
			<View style={styles.btn}>


			{
          Platform.OS === 'ios' ?
            <DateTimePicker
              testID="dateTimePicker"
              value={time}
              mode='time'
              is24Hour={true}
              display="default"
              onChange={onChange}
            /> :
            <>
              {isDatePickerVisible ?
                 <View></View>
                // <DateTimePickerModal
                //   isVisible={isDatePickerVisible}
                //   mode="time"
                //   onConfirm={handleConfirm}
                //   onCancel={hideDatePicker}
                // />
                :
                <TouchableOpacity style={{ color: "#000000" }} onPress={() => showDatePicker()} >
                  <Text>{formatDate(time)}</Text>
                </TouchableOpacity>
              }
            </>

        }

			</View>

		</View>
	)
}

export default DatePicker

const styles = StyleSheet.create({
	btn: {
		paddingLeft: 10,
		alignContent: "center",
		justifyContent: "center",
		color: "#000000",
	},
})
