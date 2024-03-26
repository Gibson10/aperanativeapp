/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react"

import {
	View,
	Text,
	Image,
	Platform,
	TextInput,
	StatusBar,
	ScrollView,
	StyleSheet,
	SafeAreaView,
	TouchableOpacity,
	ActivityIndicator,
	// YellowBox
} from "react-native"
import { connect } from "react-redux"
import { profilePut, updateUserImage } from "../services/api"
// import Toast from 'react-native-root-toast'
import Toast from 'react-native-root-toast';
import { logout } from "../screens/redux/actions/LoginActions"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons"


import { formatNumber } from "libphonenumber-js";

import {
	AntDesign,
	Feather,
	FontAwesome,
	FontAwesome5,
	MaterialIcons,
} from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { setUser } from "../screens/redux/actions/User"
import { LinearGradient } from "expo-linear-gradient"
import { OPERATIVE, BUSINESS } from "../utils/accountTypes"
import SearchBar from "../components/SearchBar"
import Loader from "../components/Loader"
import GoogleAutoComplete from "./components/GooglePlaceAutocomplete"


const STORAGE_KEY = "userToken"

class ProfileScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			photo: null,
			user: {},
			firstName: "",
			lastName: "",
			username: "",
			about: "",
			loading: false,
			email: "",
			phoneNumber: "",
			selectedItems: [],
			addressLocation: "",
			lat_long: {},
			updateProfile:true,
			errorMessage: { status: false, message: "",success:false },
		}

		this.handleChoosePhoto = async () => {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				allowsEditing: true,
				aspect: [1, 1],
				quality: 1,
			})
			if (!result.cancelled) {
				let localUri = result.uri
				let filename = localUri.split("/").pop()
				let match = /\.(\w+)$/.exec(filename)
				let type = match ? `image/${match[1]}` : `image`
				let formData = new FormData()
				formData.append("file", { uri: localUri, name: filename, type })
				this.setState({ photo: result.uri, loading: true })
				//console.log("formData", formData, this.props.currentUser._id)
				const userImage = await updateUserImage(
					this.props.currentUser._id,
					formData
				)
				if (userImage) {
					Toast.show(userImage.message, Toast.SHORT)
					const Token = {
						userToken: userImage.access_token,
					}
					this.props.dispatch(setUser(userImage.user, Token))
					this.setState({
						loading: false,
					})
				} else {
					this.setState({
						loading: false,
					})
				}
			}
		}

		this.onSelectedItemsChange = (selectedItems) => {
			this.setState({ selectedItems })
		}

		 this.onBlur = () => {
			const formattedNumber = formatNumber(`+1${this.state.phoneNumber.replace(/^\+1/, "")}`, "National")
			console.log("formattedNumber",formattedNumber)

			this.setState({phoneNumber:formattedNumber})

		  };
		this.textInputChange = (event, name) => {
			const { text } = event.nativeEvent
			this.setState({
				[name]: text,
			})
		}
		this.submitProfileDetails = async () => {
			const {
				firstName,
				lastName,
				email,
				phoneNumber,
				lat_long,
				about,
				username,
			} = this.state

			if (
				firstName.trim() &&
				lastName.trim() &&
				email.trim() &&
				about.trim() &&
				username.trim() &&
				lat_long &&
				phoneNumber.trim()
			) {
				this.setState({ loading: true })
				const data = {
					firstName: firstName,
					lastName: lastName,
					email: email,
					about: about,
					username:username,
					// locationAccepted:false,
					phoneNumber: phoneNumber,
					location: lat_long,
				}
				const updatedAccount = await profilePut(
					data
				)

				if (updatedAccount) {
				
					this.setState({
						errorMessage: {
							status: true,
							message: updatedAccount.message,
							success:true,
						},
						loading: false,
						// updateProfile:false
					})
	
					const Token = {
						userToken: updatedAccount.access_token,
					}
					console.log("updatedAccount",updatedAccount.user)
					Toast.show("Profile updated",{position: Toast.positions.CENTER})

					this.props.dispatch(setUser(updatedAccount.user, Token))
			   

				} else {
					this.setState({
						loading: false,
					})
				}
			} else {
				this.setState({
					errorMessage: {
						status: true,
						message: "All fields are required",
					},
				})
			}
			this.setMessageToFalse()

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
		this.currentCords = (lat_long) => {
			this.setState({
				lat_long: lat_long,
			})
		}

		this.logout=async()=>{
			await AsyncStorage.removeItem(STORAGE_KEY)
			this.props.dispatch(logout())
		}
	}

	async componentDidMount() {
	    
		this.setState({
			photo: this.props.currentUser.image,
			user: this.props.currentUser,
			firstName: this.props.currentUser.firstName,
			lastName: this.props.currentUser.lastName,
			email: this.props.currentUser.email,
			about: this.props.currentUser.about
				? this.props.currentUser.about
				: "",
			errorMessage: { status: false, message: "" },
			phoneNumber: this.props.currentUser.phoneNumber,
			username: this.props.currentUser.username
				? this.props.currentUser.username
				: "",
			photo: this.props.currentUser.profilePhoto,
		})
	}


	render() {
	const {errorMessage}=this.state
		return (
			<SafeAreaView style={styles.container}>
				{/* <Loader loading={this.state.loading} /> */}
				<KeyboardAwareScrollView
					style={styles.containerView}
					resetScrollToCoords={{ x: 0, y: 0 }}
					scrollEnabled={true}
				>
				<View>
					<SearchBar
						navigation={this.props.navigation}
						componentText='Profile'
						backarrow={true}
						notification={true}
						updateProfile={this.state.updateProfile}
						profileUpdate={()=>this.submitProfileDetails()}
					/>
				</View>

				{/* <ScrollView
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps='always'
				> */}
					<View style={styles.parentSec}>
						<View style={styles.pictureSec}>
							<View>
								<TouchableOpacity
									onPress={() => this.handleChoosePhoto()}
								>
									<View
										style={[
											styles.coverImage,
											{
												backgroundColor:
													this.props.currentUser
														.accountType ===
													OPERATIVE
														? "#ff4c00"
														: "#006dff",
												opacity: 0.1
											},
										]}
									></View>
								</TouchableOpacity>
							</View>
							<View style={{ alignSelf: "center" }}>
								<TouchableOpacity
									onPress={() => this.handleChoosePhoto()}
								>
									<View style={styles.profileImage}>
										<Image
											source={
												this.state.photo
													? { uri: this.state.photo }
													: require("../assets/profile.png")
											}
											style={styles.image}
											resizeMode='cover'
										/>
									</View>
									<View style={styles.editIcon}>
										<Feather onPress={() => this.handleChoosePhoto()} name="edit" size={16} color="#ffffff" />
										</View>
								</TouchableOpacity>
							</View>
						</View>
						{errorMessage.status ? (
						<Text style={errorMessage.success?styles.successMsg:styles.errorMsg}>
							{errorMessage.message}
						</Text>
					) : (
						<Text style={styles.errorMsg}></Text>
					)}   
					{
						this.state.loading?
						<ActivityIndicator size="small" color="#0000ff" />:<View></View>
					}



						<View style={styles.address}>
							<View style={(styles.action, { width: "49%" })}>
								<Text style={styles.label}>First Name</Text>
								<TextInput
									name='firstName'
									placeholder='Racheal'
							        placeholderTextColor='grey'
									value={this.state.firstName.charAt(0).toUpperCase() + this.state.firstName.slice(1)}
									style={styles.textInput}
									autoCapitalize='words'
									returnKeyType='done'
									onChange={(event) =>
										this.textInputChange(event, "firstName")
									}
								/>
							</View>
							<View style={(styles.action, { width: "49%" })}>
							<Text style={styles.label}>Last Name</Text>

								<TextInput
									name='lastName'
									placeholderTextColor='grey'
									value={this.state.lastName.charAt(0).toUpperCase() + this.state.lastName.slice(1)}
									placeholder='Jones'
									style={styles.textInput}
									autoCapitalize='words'
									returnKeyType='done'
									onChange={(event) =>
										this.textInputChange(event, "lastName")
									}
								/>
							</View>
						</View>
						<View style={styles.action}>
						<Text style={styles.label}>E-mail Address</Text>

						<TextInput
							name='email'
							value={this.state.email}
							placeholderTextColor='grey'
							placeholder='racheal.seattle.barrr@gmail.com'
							style={styles.textInput}
							autoCapitalize='none'
							returnKeyType='done'
							onChange={(event) =>
								this.textInputChange(event, "email")
							}
						/>
							{/* <TextInput
								name='about'
                                placeholderTextColor='grey'
								value={this.state.about.charAt(0).toUpperCase() + this.state.about.slice(1)}
								placeholder='About'
								style={styles.textInput}
								autoCapitalize='none'
								returnKeyType='done'
								// multiline='true'
								// numberOfLines='4'
								onChange={(event) =>
									this.textInputChange(event, "about")
								}
							/> */}
						</View>

						{/* <TextInput
							name='username'
							placeholderTextColor='grey'
							value={this.state.username}
							placeholder='@username'
							style={styles.textInput}
							autoCapitalize='none'
							returnKeyType='done'
							onChange={(event) =>
								this.textInputChange(event, "username")
							}
						/> */}
                        <View>
						<Text style={styles.label}>Phone Number</Text>
						<TextInput
							name='phoneNumber'
							onBlur={this.onBlur}
							placeholderTextColor='grey'
							placeholder='+1 110 - 333 - AAAA'
							value={this.state.phoneNumber}
							style={styles.textInput}
							autoCapitalize='none'
							onChange={(event) =>
								this.textInputChange(event, "phoneNumber")
							}
						/>

						</View>

						{/* <Text style={{paddingBottom:5}}>Your Location</Text>
						<View style={{ marginBottom: 20, borderRadius: 10, borderWidth: 1, borderColor:'#000000',color:'#000000' ,backgroundColor: '#ffffff', paddingTop: 5 }}>
							
							<GoogleAutoComplete
								currentCords={(e) => this.currentCords(e)}
								profile={true}
							/>
						</View> */}

						
			
						{this.props.currentUser.accountType === OPERATIVE ? (
							<>
								<Text style={styles.title}></Text>
								<View style={styles.buttonSubmit}>
									<TouchableOpacity
										style={{ width: "100%",flexDirection: "row", justifyContent: "center", alignItems: "center" }}
										onPress={() =>
											this.props.navigation.navigate(
												"Speciality"
											)
										}
									>
										<LinearGradient
											colors={["#f4f4f4", "#f4f4f4"]}
											style={styles.signInSubmit}
										>
											{/* <View style={styles.IconBackground}> */}
											{/* <FontAwesome
												name='plus'
												color='#ffffff'
												size={16}
											/> */}
									{/* <Image source={require("../assets/plus.png")} /> */}
									<Image source={require("../assets/icons2.0/plusIcon.png")} style={{width:40,height:40}} />


											{/* </View> */}

											<Text
												style={[
													styles.textSign,
													{ color: "#000000" },
												]}
											>
												Add your specialties
											</Text>
										</LinearGradient>
										<MaterialIcons name="keyboard-arrow-right" size={24} color="#484747" />
									</TouchableOpacity>
								</View>
							</>
						) : (
							<View  style={styles.buttonSubmit}>
                             		<TouchableOpacity
										style={{ width: "100%",flexDirection: "row", justifyContent: "center", alignItems: "center" }}
										onPress={() =>
											this.props.navigation.navigate(
												"MatchedGigs"
											)
										}
									>
										<LinearGradient
											colors={["#f4f4f4", "#f4f4f4"]}
											style={styles.signInSubmit}
										>
							                <View style={styles.IconBackground}>
											<Entypo
											name='box'
											size={16}
											color='#ffffff'
										/>
										</View>
											<Text
												style={[
													styles.textSign,
													{ color: "#000000" },
												]}
											>
												Matched Gigs
											</Text>
										</LinearGradient>
										<MaterialIcons name="keyboard-arrow-right" size={24} color="#484747" />

									</TouchableOpacity>
								

							</View>
						)}
						{
							this.props.currentUser.accountType != OPERATIVE ? (
								<TouchableOpacity
								style={{ width: "100%",flexDirection: "row", justifyContent: "center", alignItems: "center" }}
								onPress={() =>
									this.props.navigation.navigate(
										"CreatedGigsScreen"
									)
								}
							>
								<LinearGradient
									colors={["#f4f4f4", "#f4f4f4"]}
									style={styles.signInSubmit}
								>
					
					<View style={styles.IconBackground}>
											<Entypo
											name='box'
											size={16}
											color='#ffffff'
										/>
										</View>
									<Text
										style={[
											styles.textSign,
											{ color: "#000000" },
										]}
									>
										Created Gigs
									</Text>
								</LinearGradient>
								<MaterialIcons name="keyboard-arrow-right" size={24} color="#484747" />

							</TouchableOpacity>) : (
								<View></View>
							)
						}
                     {this.props.currentUser.accountType === BUSINESS ? 
                       <Text style={styles.title}> </Text>:<View></View>
					   }
						<View>
							<View style={styles.buttonSubmit}>
								<TouchableOpacity
									style={{ width: "100%",flexDirection: "row", justifyContent: "center", alignItems: "center" }}
									onPress={
										this.props.currentUser.accountType ===
										OPERATIVE
											? () =>
													this.props.navigation.navigate(
														"UploadDoc"
													)
											: () =>
													this.props.navigation.navigate(
														"BusinessLicence"
													)
									}
								>
									<LinearGradient
										colors={["#f4f4f4", "#f4f4f4"]}
										style={styles.signInSubmit}
									>
										<Image source={require("../assets/icons2.0/documents.png")} style={{width:40,height:40}} />

										<Text
											style={[
												styles.textSign,
												{ color: "#000000" },
											]}
										>
											Documents
										</Text>
									</LinearGradient>
									<MaterialIcons name="keyboard-arrow-right" size={24} color="#484747" />

								</TouchableOpacity>
							</View>
							{this.props.currentUser.accountType ===
							OPERATIVE ? (
								<View style={styles.buttonSubmit}>
									<TouchableOpacity
										style={{ width: "100%",flexDirection: "row", justifyContent: "center", alignItems: "center"  }}
										onPress={() =>
											this.props.navigation.navigate(
												"Payments"
											)
										}
									>
										<LinearGradient
											colors={["#f4f4f4", "#f4f4f4"]}
											style={styles.signInSubmit}
										>

											<Image source={require("../assets/icons2.0/cardIcon.png")} style={{width:40,height:40}} />

											<Text
												style={[
													styles.textSign,
													{ color: "#000000" },
												]}
											>
												Mobile payment handler
												{/* Payment Wallet */}
											</Text>
										</LinearGradient>
										<MaterialIcons name="keyboard-arrow-right" size={24} color="#484747" />

									</TouchableOpacity>
								</View>
							) : (
								<View></View>
							)}

							<View style={styles.buttonSubmit}>
								<TouchableOpacity
									style={{ width: "100%",flexDirection: "row", justifyContent: "center", alignItems: "center"  }}
									onPress={() =>
										this.props.navigation.navigate(
											"ChangePassword"
										)
									}
								>
									<LinearGradient
										colors={["#f4f4f4", "#f4f4f4"]}
										style={styles.signInSubmit}
									> 
									 {/* <View style={styles.IconBackgroundSignOut}>
					
										<Image source={require("../assets/password.png")} style={{height:20,width:20}}/>

										</View> */}
										<Image source={require("../assets/icons2.0/passwordIcon.png")} style={{width:40,height:40}} />

										<Text
											style={[
												styles.textSign,
												{ color: "#ff4c00" },
											]}
										>
											Change Password
										</Text>
									</LinearGradient>
									<MaterialIcons name="keyboard-arrow-right" size={24} color="#484747" />
								</TouchableOpacity>
							</View>
							<View style={styles.logoutView}>
							<TouchableOpacity onPress={this.logout}>
							<Text style={styles.logout}>Signout</Text>
							</TouchableOpacity>
							</View>
						</View>
					</View>
					
					<View
						style={[
							styles.button,
							{
								marginBottom: 0,
								marginRight: 20,
								marginLeft: 20,
								paddingBottom: 20,
								paddingTop: 20,
								alignItems: "center",
							},
						]}
					>
						
					</View>
				</KeyboardAwareScrollView>
			</SafeAreaView>
		)
	}
}

const mapStateToProps = ({ currentUser, login }) => {
	return {
		currentUser,
		login,
	}
}

export default connect(mapStateToProps)(ProfileScreen)

// Styling
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f4f4f4",
	},
	containerView: {
		position: "absolute",
		height: "110%",
		paddingTop: 20,
		width: "100%",
	  },
	label:{
		fontSize: 14,
		paddingBottom: 10,
	},
	header: {
		flex: 1,
		justifyContent: "space-between",
		marginTop: 20,
		flexDirection: "row",
		alignItems: "center",
	},
	text_footer: {
		color: "#05375a",
		fontSize: 18,
	},
	parentSec: {
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 15,
	},
	coverImage: {
		width: "100%",
		height: 170,
		borderRadius: 20,
		overflow: "hidden",
		marginBottom: 30,
	},
	profileImage: {
		width: 100,
		height: 100,
		borderRadius: 100,
		overflow: "hidden",
		marginTop: -110,
	},
	editIcon:{
		width: 40,
		height: 40,
		padding:12,
		borderRadius: 20,
		backgroundColor:"#ff4c00",
		overflow: "hidden",
		marginTop: -50,
		marginLeft: 65,
		// marginTop: -180,
	},
	IconBackground:{
		width: 40,
		height: 40,
		padding:12,
		borderRadius: 5,
		backgroundColor:"#006dff",
		overflow: "hidden",
	},
	IconBackgroundSignOut:{
		width: 40,
		height: 40,
		padding:12,
		borderRadius: 5,
		backgroundColor:"#ff4c00",
		overflow: "hidden",
	},
	image: {
		flex: 1,
		height: undefined,
		width: undefined,
		backgroundColor: "gray",
	},
	cvrimage: {
		flex: 1,
		height: "100%",
		width: "100%",
		backgroundColor: "red",
	},
	text_header: {
		color: "#000000",
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 16,
		// marginLeft: '22%'
	},
	button: {
		// alignItems: "center",
		marginBottom: 20,
	},
	buttonSubmit: {
		// alignItems: "center",
		marginBottom: 20,
	},
	signIn: {
		width: "100%",
		height: 20,
		borderRadius: 10,
	},
	signInSubmit: {
		width: "100%",
		height: 40,
		borderRadius: 10,
		flexDirection: "row",
		alignItems: "center",
		paddingLeft: 10,
	},
	textSign: {
		fontSize: 12,
		fontWeight: "bold",
		padding: 10,
	},
	textInput: {
		flex: 1,
		marginTop: Platform.OS === "ios" ? 0 : -12,
		padding: 10,
		color: "#05375a",
		backgroundColor: '#ffffff',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#000000",
		marginBottom: 30,
		shadowColor: "#000",
		shadowOffset: { width: 1, height: 5 },
		shadowOpacity: 0.1,
	},
	errorMsg: {
		color: "#FF0000",
		fontSize: 14,
	},
	address: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 15
	},
	title: {
		fontSize: 16,
		marginBottom: 15,
	},
	errorMsg: {
		color: "red",
		padding: 0,
		textAlign: "center",
	},
	successMsg: {
		color: "green",
		padding: 10,
		textAlign: "center",
	},
	logoutView:{
		textAlign: "center",
		justifyContent:'center',
		alignItems:'center',
		paddingBottom: 20,
	},
	logout:{
		color: "#FF0000",
		fontSize: 16,
	}
})
