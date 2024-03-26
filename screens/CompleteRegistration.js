/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from "react"
import {
	View,
	Text,
	Platform,
	StatusBar,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Alert,
	Image,
	ActivityIndicator	
} from "react-native"
import Toast from 'react-native-root-toast'
import * as Google from 'expo-google-app-auth';
import { formatNumber } from "libphonenumber-js";

import * as Animatable from "react-native-animatable"
import { LinearGradient } from "expo-linear-gradient"
// import NumberFormat from 'react-number-format';
import { default as NumberFormat } from 'react-number-format';



import Loader from "../components/Loader"
import {
	AntDesign,
	Feather,
	FontAwesome,
	MaterialIcons,
} from "@expo/vector-icons"
import { AuthContext } from "../components/context"
import GoogleAutoComplete from './components/GooglePlaceAutocomplete';

Feather.loadFont()
FontAwesome.loadFont()
const CompleteRegistration = (props) => {
	const { businessRegistration } = React.useContext(AuthContext)
	const [loading, setLoading] = React.useState(false)

	const [data, setData] = React.useState({
		email: "",
		username: "",
		password: props.route.params.password,
		firstName: props.route.params.firstName,
		lastName: props.route.params.lastName,
		email: props.route.params.email,
		profilePicture: props.route.params.profilePicture?props.route.params.profilePicture:"",
		businessName: "",
		phoneNumber:"",
		lat_long:null,
		accountType: "business",
		confirmpassword: "",
		check_textInputChange: false,
		secureTextEntry: true,
		isValidUser: true,
		isValidPassword: true,
		emailError: {status: false, message: ""}
	})

	const textInputChange = (event, name) => {
		const { text } = event.nativeEvent

		setData({
			...data,
			[name]: text,
		})
	}


	const handleValidUser = (val) => {
		if (val.trim().length >= 4) {
			setData({
				...data,
				isValidUser: true,
			})
		} else {
			setData({
				...data,
				isValidUser: false,
			})
		}
	}
	const currentCords = (lat_long) => {
			setData({
			   ...data,
				lat_long: lat_long,
			})
		}

	const registerBusiness = async () => {
		const {
			email,
			firstName,
			lastName,
			businessName,
			password,
			accountType,
			lat_long
		} = data
		if (
			email.trim() &&
			firstName.trim() &&
			lastName.trim() &&
			password.trim() &&
			accountType.trim() &&
			lat_long &&
			businessName.trim() 
		) {
			console.log(data)
			// 118089921979338253844
			// 118089921979338253844
			// 118089921979338253844
			// setLoading(true)
			const registerStatus = await businessRegistration(data,props.navigation)
			console.log("registerStatus",registerStatus)
			if (!registerStatus.status) {
				setLoading(false)
				setData({
					...data,		
					emailError: {status: true, message: registerStatus.data},			
				})
			}
		} else {
			setData({
				...data,		
				emailError: {status: true, message: "All fields are required"},			
			})
		}
	}
	// email: 'njine10@gmail.com',
	// password: '118089921979338253844',
	// email: 'njine10@gmail.com',
	// password: '118089921979338253844',
	useEffect(async() => {
		const data=props.route.params.data
		console.log("data",data)
		// if(data){

		// }
	  },[]);

	return (
		<View style={styles.container}>
			{/* <Loader loading={loading} /> */}
			<StatusBar backgroundColor='#009387' barStyle='light-content' />
			<View style={styles.close}>
				<TouchableOpacity
					onPress={() => props.navigation.navigate("SplashScreen")}
				>
					<MaterialIcons name='clear' color='#000000' size={20} />
				</TouchableOpacity>
			</View>
			
			<Animatable.View animation='fadeInUpBig' style={styles.footer}>
			<View style={styles.header}>
				<Text style={styles.text_header}>
					{" "}
					<FontAwesome
						name='briefcase'
						color='#05375a'
						size={20}
					/>{" "}
					Business Info
				</Text>
			</View>
				<ScrollView showsVerticalScrollIndicator={false} 	keyboardShouldPersistTaps='always'>
				{
						data.emailError.status ? <Text style={styles.errorMsg}>{ data.emailError.message }</Text> : <Text style={styles.errorMsg}></Text>
					}
					<View style={styles.action}>
						<TextInput
							name='businessName'
							placeholder='Business Name'
							style={styles.textInput}
							autoCapitalize='none'

							placeholderTextColor='grey'
							onChange={(event) =>
								textInputChange(event, "businessName")
							}
							onEndEditing={(e) =>
								handleValidUser(e.nativeEvent.text)
							}
						/>
						<FontAwesome
							icon='check-circle'
							color='green'
							size={20}
						/>
					</View>
				    <Text style={{paddingBottom:5}}>Your Location</Text>
					<View style={{ marginBottom: 20 }}>
							<GoogleAutoComplete
								currentCords={(e) => currentCords(e)}
								profile={false}
							/>
						</View>

					{/* <View style={styles.action}>
						 <TextInput
							name='phoneNumber'
							onBlur={onBlur}
							placeholder='Phone Number'
							style={styles.textInput}
							// keyboardType={'phone-pad'}
							autoCapitalize='none'
							value={data.phoneNumber}
							onChange={(event) =>
								textInputChange(event, "phoneNumber")
							}
							onEndEditing={(e) =>
								handleValidUser(e.nativeEvent.text)
							}
						/> 

						<FontAwesome
							icon='check-circle'
							color='green'
							size={20}
						/>
					</View> */}

				

					<View style={styles.button}>
						<TouchableOpacity
							style={{ width: "100%" }}
							onPress={() => registerBusiness()}
						>
							<LinearGradient
								colors={["#ffffff", "#ffffff"]}
								style={styles.signIn}
							>
								{/* <Text
									style={[
										styles.textSign,
										{ color: "#006dff" },
									]}
								>
									Complete Sign up
								</Text> */}

  <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center'}}>
									<Text
										style={[
											styles.textSign,
											{ color: "#006dff",paddingTop:3 },
										]}
									>
										Complete Sign up
									</Text>
									{
										loading?
										<ActivityIndicator style={{paddingLeft:10}} size="small" color="#0000ff" />:<View></View>
									}
									
									</View>
							</LinearGradient>
						</TouchableOpacity>
					</View>

				</ScrollView>
			</Animatable.View>
		</View>
	)
}

export default CompleteRegistration

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
		flex: 5,
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
		textAlign: "center",
	},
	text_title: {
		color: "#000000",
		fontWeight: "bold",
		fontSize: 16,
		marginBottom: 20,
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
		marginTop: 10,
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
	address: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	errorMsg:{
		color:"red",
		padding: 10
	},

})
