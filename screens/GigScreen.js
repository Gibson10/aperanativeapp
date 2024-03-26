/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react"
import {
	View,
	Text,
	Alert,
	Button,
	Platform,
	StatusBar,
	PermissionsAndroid,
	TextInput,
	StyleSheet,
	ActivityIndicator,
	TouchableOpacity,
	KeyboardAvoidingView,
	ScrollView,
	SafeAreaView,
	YellowBox,
	LogBox,
	Picker,
} from "react-native"
import Toast from 'react-native-root-toast';
import * as Animatable from "react-native-animatable"
import { LinearGradient } from "expo-linear-gradient"
// import Geolocation from "react-native-geolocation-service"
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
// import Geocoder from "react-native-geocoding"
// import { GOOGLE_MAPS_KEY } from "../utils/map"
// import * as Location from "expo-location"
import Loader from "../components/Loader"
import {specialities} from '../utils/data'
import DatePicker from "./DatePicker"
import { createGigs } from "../services/api"
import TimePicker from "./TimePicker"

import MultiSelect from "react-native-multiple-select"
import {
	AntDesign,
	Feather,
	FontAwesome,
	MaterialIcons,
} from "@expo/vector-icons"
import SearchBar from "../components/SearchBar"
import { connect } from "react-redux"
import GoogleAutoComplete from "./components/GooglePlaceAutocomplete"

Feather.loadFont()
FontAwesome.loadFont()

class GigScreen extends Component {
	constructor(props) {
		super()
		this.state = {
			gigName: "",
			address: "",
			instructions: "",
			additionalRequest: "",
			wage: "",
			date: "",
			startTime: "",
			gigDescription: "",
			description: "",
			endTime: "",
			loading: false,
			operatives: "0",
			breakTime: "",
			addressLocation: "",
			lat_long: {},
			selectedItems: [],
			emailError: {status: false, message: ""}
		}

		this.textInputChange = (event, name) => {
			const { text } = event.nativeEvent

			this.setState({
				[name]: text,
			})
		}

		this.createGig = async () => {
			const {
				gigName,
				address,
				instructions,
				wage,
				date,
				startTime,
				endTime,
				operatives,
				breakTime,
				selectedItems,
				gigLocation,
				gigDescription,
				lat_long,
			} = this.state
			if (
				gigName.trim() &&
				instructions.trim() &&
				wage.trim() &&
				gigDescription.trim() &&
				date.trim() &&
				startTime.trim() &&
				endTime.trim() &&
				operatives.trim() &&
				breakTime.trim()
			) {
				if (lat_long) {
					if (selectedItems.length > 0) {
						const data = {
							gigName: gigName,
							instructions: instructions,
							hourWage: wage,
							gigCreator: this.props.currentUser._id,
							shiftDate: date,
							preferredSkills: selectedItems,
							startTime: startTime,
							endTime: endTime,
							gigDescription: gigDescription,
							gigLocation: this.state.lat_long,
							operatives: operatives,
							breakTime: breakTime,
						}
						//console.log("data", data)
						this.setState({ loading: true })
						const newGig = await createGigs(data)
						if (newGig) {
							Toast.show(
								`${newGig.message}, you can now post a new gig`,
								{
									position: Toast.positions.CENTER
								}
							)
							this.setState({
								loading: false,
								gigName: "",
								instructions: "",
								wage: "",
								preferredSkills: [],
								emailError: {status: false, message:''},
								gigDescription: "",
								operatives: "",
								breakTime: "",
								
							})
							this.props.navigation.navigate("CreatedGigsScreen")
						}else{
							Toast.show(
								`The was a problem creating your gig, please try again`,
								{
									position: Toast.positions.CENTER
								}
							)
							this.setState({loading:false})
						}
					} else {
						this.setState({
							emailError: {status: true, message: 	"You need to select atleast staff speciality",},			
						})
						
					}
				} else {
					this.setState({
						emailError: {status: true, message: "You have to allow permissions to access your location in order to proceed"},			
					})
					
					this.componentDidMount()
				}
			} else {
				this.setState({
					emailError: {status: true, message: "All fields are required, please cross-check that you have filled them all"},			
				})

			}
      this.setMessageToFalse()
		}
		this.onSelectedItemsChange = (selectedItems) => {
			this.setState({ selectedItems })
		}

		this.setMessageToFalse=()=>{
			setTimeout(() => {
			 this.setState({
						errorMessage: {
							status: false,
							message: '',
						},
					})
				}, 2000)
		}

		this.pickDate = (e) => {
			this.setState({
				date: e,
			})
		}
		this.pickTime = (e, status) => {
			if (status === "start") {
				this.setState({
					startTime: e,
				})
			} else {
				this.setState({
					endTime: e,
				})
			}
		}
		this.textInputChange = (event, name) => {
			const { text } = event.nativeEvent

			this.setState({
				[name]: text,
			})
		}
		this.formatDate = (date) => {
			return `${date.getDate()}/${
				date.getMonth() + 1
			}/${date.getFullYear()}`
		}

		this.currentCords = (lat_long) => {
			this.setState({
				lat_long: lat_long,
			})
		}
	}

	async componentDidMount() {
		LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        
		const date = this.formatDate(new Date())
		this.setState({
			date: date,
		})
	}

	render() {
		const { selectedItems } = this.state
		return (
			<View style={styles.container}>
				{/* <Loader loading={this.state.loading} /> */}
				<View>
					<SearchBar
						navigation={this.props.navigation}
						componentText='Post a Gig'
						backarrow={true}
					/>
				</View>

				<View style={styles.header}></View>

				<View animation='fadeInUpBig' style={styles.footer}>
				<KeyboardAvoidingView
				   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				>
					<ScrollView
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps='always'
					>

						<Text style={styles.text_title}>What kind of staff speciality do you need</Text>

						<View style={{ flex: 1 }}>
							<MultiSelect
							hideTags
							items={specialities}
							uniqueKey="id"
							ref={(component) => { this.multiSelect = component }}
							onSelectedItemsChange={this.onSelectedItemsChange}
							selectedItems={selectedItems}
							styleListContainer={{height: 206}}
							selectText="Select Multiple Specialties"
							searchInputPlaceholderText="Search Items..."
							onChangeInput={ (text)=> console.log(text)}
							tagRemoveIconColor="#CCC"
							tagBorderColor="#CCC"
							tagTextColor="#CCC"
							selectedItemTextColor="#CCC"
							selectedItemIconColor="#CCC"
							itemTextColor="#000"
							displayKey="name"
							searchInputStyle={{ color: '#CCC' }}
							submitButtonColor="#CCC"
							submitButtonText="Hide Select"
							/>
							</View>

						<Text style={styles.text_title_empty}></Text>
						<View style={styles.action}>
							<TextInput
								name='gigName'
								placeholder='Event Title'
								value={this.state.gigName}
								style={styles.textInput}
								placeholderTextColor='grey'
								onChange={(event) =>
									this.textInputChange(
										event,
										"gigName"
									)
								}
								autoCapitalize='none'
							/>
							<Feather icon='eye-off' color='grey' size={20} />
						</View>
						

						
						

						<View style={styles.divide}>
							<Text
								style={
									(styles.text_title,
									{ width: "49%", marginBottom: 20 })
								}
							>
								Shift date
							</Text>
							<Text
								style={
									(styles.text_title,
									{ width: "49%", marginBottom: 20 })
								}
							>
								Operatives
							</Text>
						</View>
						<View style={styles.divide}>
							<View style={styles.smallpicker}>
								<DatePicker
									onPickDate={(e) => this.pickDate(e)}
								/>
							</View>
							<TextInput
								name='operatives'
								placeholder='No of operatives'
								keyboardType='numeric'
								value={this.state.operatives}
								style={styles.textInput}
								placeholderTextColor='grey'
								onChange={(event) =>
									this.textInputChange(event, "operatives")
								}
								autoCapitalize='none'
							/>
						</View>
						<View style={styles.divide}>
							<Text
								style={
									(styles.text_title,
									{ width: "49%", marginBottom: 20 })
								}
							>
								Start time
							</Text>
							<Text
								style={
									(styles.text_title,
									{ width: "49%", marginBottom: 20 })
								}
							>
								End time
							</Text>
						</View>
						<View style={styles.divide}>
							<View style={styles.smallpicker}>
								<TimePicker
									status='start'
									onPickTime={(e, status) =>
										this.pickTime(e, status)
									}
								/>
								<Feather
									icon='eye-off'
									color='grey'
									size={20}
								/>
							</View>
							<View style={styles.smallpicker}>
								<TimePicker
									status='end'
									onPickTime={(e, status) =>
										this.pickTime(e, status)
									}
								/>
								<FontAwesome
									icon='check-circle'
									color='green'
									size={20}
								/>
							</View>
						</View>
						<View style={styles.divide}>
							<Text
								style={
									(styles.text_title,
									{ width: "49%", marginBottom: 20 })
								}
							>
								Break(minutes)
							</Text>
							<Text
								style={
									(styles.text_title,
									{ width: "49%", marginBottom: 20 })
								}
							>
								Wages per hour(in $)
							</Text>
						</View>
						<View style={styles.divide}>
							<TextInput
								name='breakTime'
								placeholder='Break time'
								keyboardType='numeric'
								value={this.state.breakTime}
								style={styles.textInput}
								placeholderTextColor='grey'
								onChange={(event) =>
									this.textInputChange(event, "breakTime")
								}
								autoCapitalize='none'
							/>
							<Feather icon='eye-off' color='grey' size={20} />

							<TextInput
								name='wage'
								placeholder='Wages per hour ($)'
								keyboardType='numeric'
								value={this.state.wage}
								style={styles.textInput}
								placeholderTextColor='grey'
								onChange={(event) =>
									this.textInputChange(event, "wage")
								}
								autoCapitalize='none'
							/>

							<FontAwesome
								icon='check-circle'
								color='green'
								size={20}
							/>
						</View>
						<Text style={styles.text_title}>Event location</Text>

						<View
							style={{
								borderWidth: 1,
								borderColor: "#000000",
								backgroundColor: "#ffffff",
								borderRadius: 10,
								marginBottom:13,
								paddingTop: 2,
							}}
						>
							<GoogleAutoComplete
								currentCords={(e) => this.currentCords(e)}
								profile={true}
							/>
						</View>
						<Text style={styles.text_title}>
							Instructions for the operative/professionals
						</Text>

						<View style={styles.action}>
							<TextInput
								name='instructions'
								placeholder='Enter any instructions'
								style={styles.textInput}
								value={this.state.instructions}
								placeholderTextColor='grey'
								onChange={(event) =>
									this.textInputChange(event, "instructions")
								}
								autoCapitalize='none'
							/>
							<Feather icon='eye-off' color='grey' size={20} />
						</View>

						<Text style={styles.text_title}>
							Description 
						</Text>
						<View style={styles.action}>
							<TextInput
								name='gigDescription'
								placeholder='Add anything eg. dress code, able to lift 20lbs, etc.'
								// multiline
								// numberOfLines={5}
								value={this.state.gigDescription}
								placeholderTextColor='grey'
								style={styles.textInput}
								onChange={(event) =>
									this.textInputChange(
										event,
										"gigDescription"
									)
								}
								autoCapitalize='none'
							/>
							<Feather icon='eye-off' color='grey' size={20} />
						</View>
						{
							this.state.emailError.status ? <Text style={styles.errorMsg}>{ this.state.emailError.message }</Text> : <Text style={styles.errorMsg}></Text>
						}
						<View style={styles.button}>
							<TouchableOpacity
								style={{ width: "100%" }}
								onPress={() => this.createGig()}
							>
								<LinearGradient
									colors={["#ffffff", "#ffffff"]}
									style={styles.signIn}
								>
									<View style={{flexDirection:'row',justifyContent:'center',alignContent:'center'}}>
									<Text
										style={[
											styles.textSign,
											{ color: "#006dff",paddingTop:3 },
										]}
									>
										Post
									</Text>
									{
										this.state.loading?
										<ActivityIndicator style={{paddingLeft:10}} size="small" color="#0000ff" />:<View></View>
									}
									
									</View>
								</LinearGradient>
							</TouchableOpacity>
						</View>
					</ScrollView>
					</KeyboardAvoidingView>
				</View>
			</View>
		)
	}
}

const mapStateToProps = ({ currentUser, login }) => {
	return {
		currentUser,
		login,
	}
}

export default connect(mapStateToProps)(GigScreen)

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
		marginTop: 20,
		flexDirection: "row",
		alignItems: "center",
	},
	footer: {
		flex: 0,
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
		marginLeft: "30%",
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
		// backgroundColor:'#ffffff'
		// paddingBottom: 5,
	},
	actionError: {
		flexDirection: "row",
		marginTop: 0,
		borderBottomWidth: 1,
		borderBottomColor: "#FF0000",
		paddingBottom: 5,
	},
	textInput: {
		flex: 1,
		marginTop: Platform.OS === "ios" ? 0 : -12,
		padding: 10,
		margin: 5,
		color: "#05375a",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#000000",
		marginBottom: 20,
		shadowColor: "#000",
		// shadowOffset: { width: 1, height: 5 },
		shadowOpacity: 0.1,
		backgroundColor:'#ffffff'
		// height: 50,
	},

	errorMsg: {
		color: "#FF0000",
		fontSize: 14,
	},
	button: {
		alignItems: "center",
		marginTop: 20,
		marginBottom: 100,
		paddingBottom: 30,
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
	text_title: {
		color: "#000000",
		fontWeight: '400',
		fontSize: 14,
		// marginTop:10,
		marginBottom: 10,
	},
	text_title_empty: {
		color: "#000000",
		fontWeight: "bold",
		fontSize: 16,
		marginBottom: 12,
	},
	picker: {
		borderRadius: 10,
		borderWidth: 0,
		borderColor: "#ffffff",
		marginBottom: 20,
		backgroundColor:'#ffffff',
		paddingTop: 10,
		height: 60,
	},
	smallpicker: {
		marginTop: Platform.OS === "ios" ? 0 : -12,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#000000",
		marginBottom: 20,
		backgroundColor:'#ffffff',
		paddingTop: 10,
		paddingBottom: 0,
		width: "49%",
		height: 50,
	},
	divide: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
})

