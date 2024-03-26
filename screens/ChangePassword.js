/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react"
import {
	View,
	Text,
	Platform,
	StatusBar,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator
} from "react-native"
import Toast from 'react-native-root-toast'
import * as Animatable from "react-native-animatable"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { changePassword } from "../services/api"
import Loader from "../components/Loader"
import {
	AntDesign,
	Feather,
	FontAwesome,
	MaterialIcons,
} from "@expo/vector-icons"

import { AuthContext } from "../components/context"
import SearchBar from "../components/SearchBar"
import { connect } from "react-redux"

Feather.loadFont()
FontAwesome.loadFont()
class ChangePassword extends Component {
	constructor(props) { 
		super()
		this.state = {
			currentpassword: "",
			newpassword: "",
			confirmpassword: "",
			loading: false,
			isValidPassword: false,
			errorMessage: { status: false, message: "",success:false },
			secureTextEntry: true,
			secureTextEntryConfirm: true,
			secureTextEntryCurrent: true,
			// emailError: {status: false, message: ""},
			passwordError: { status: false, message: "" }
		}

		this.textInputChange = (event, name) => {
			const { text } = event.nativeEvent

			this.setState({
				[name]: text,
			})
		}

		this.handlePasswordChange = (event, name) => {
			const { text } = event.nativeEvent

			if (text.trim().length >= 8) {
				this.setState({
					[name]: text,
					isValidPassword: true,
				})
			} else {
				this.setState({
					[name]: text,
					isValidPassword: false,
				})
			}
		}
		this.submitNewPassword = async () => {
			const { currentpassword, newpassword, confirmpassword } = this.state
			if (
				(currentpassword.trim(),
				currentpassword.trim(),
				confirmpassword.trim())
			) {
				if (confirmpassword === newpassword) {
					this.setState({ loading: true })
					const data = {
						currentPassword: currentpassword,
						newPassword: newpassword,
					}
                    console.log(data)
					const updatedPassword = await changePassword(
						this.props.currentUser._id,
						data
					)

					if (!updatedPassword.status) {
						if (updatedPassword.message.message) {
							updatedPassword.message.message.map((item) => {
								this.setState({
									errorMessage: {
										status: true,
										message: item,
										success:true
									},
								})
							})
						} else {
							this.setState({
								errorMessage: {
									status: true,
									message: updatedPassword.message,
									success:true
								},
							})
						}

						this.setState({ loading: false })
					} else {
						this.setState({
							loading: false,
							currentpassword: "",
							password: "",
							confirmpassword: "",
							errorMessage: {
								status: true,
								message: updatedPassword.message,
								success:true
							},
						})
					}
				} else {
					this.setState({
						errorMessage: {
							status: true,
							message: "Please use matching passwords",
						},
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


		 this.changeEyeIcon = () => {
			const secureTextEntry = this.state.secureTextEntry
			this.setState({ secureTextEntry: !secureTextEntry })
		}
	
		 this.changeEyeIconConfirm = () => {
			const secureTextEntryConfirm = this.state.secureTextEntryConfirm
			this.setState({ secureTextEntryConfirm: !secureTextEntryConfirm })
		}
		this.changeEyeIconCurrent= () => {
			const secureTextEntryCurrent = this.state.secureTextEntryCurrent
			this.setState({ secureTextEntryCurrent: !secureTextEntryCurrent })
		}
		
	}
	
	componentDidMount() {
		this.setState({
			errorMessage: { status: false, message: "" },
		})
	}

	render() {
	const {errorMessage,secureTextEntry,secureTextEntryConfirm,secureTextEntryCurrent}=this.state
		return (
			<View style={styles.container}>

				<View>
					<SearchBar
						navigation={this.props.navigation}
						componentText='Back'
						{...this.props}
					/>
				</View>
				<View style={styles.header}></View>
				<View style={styles.footer}>
					<ScrollView showsVerticalScrollIndicator={false}>
                       <Text style={styles.changePasswordHeader}>Change Password</Text>
					   <Text style={styles.changePasswordSubHeader}>Please enter your new password. confirm it to enjoy much security.</Text>

						{errorMessage.status ? (
							<Text style={errorMessage.success?styles.successMsg:styles.errorMsg}>
								{this.state.errorMessage.message}
							</Text>
						) : (
							<Text style={styles.errorMsg}></Text>
						)}

					<Text style={styles.label}>Current  Password</Text>
						<View style={[styles.action, {
						borderRadius: 10,
						borderWidth: 1,
						borderColor: "#000000",
						borderBottomColor: "#000000",
						borderBottomWidth: 1,
						// alignItems:"center",
						justifyContent: "space-between", padding: 10
					}]}>

						<TextInput
							name='password'
							placeholder='Current Password'
							secureTextEntry={
								secureTextEntryCurrent
							}
							style={styles.passwordInput}
							onChange={(event) =>
								this.handlePasswordChange(event, "currentpassword")
							}
							autoCapitalize='none'
						/>

						{
							secureTextEntryCurrent ? <Ionicons name="md-eye-off" size={24} color="#ff4c00" onPress={this.changeEyeIconCurrent} /> : <Ionicons name="md-eye" size={24} color="#ff4c00" onPress={this.changeEyeIconCurrent} />
						}

					</View>


						<Text style={styles.label}>New  Password</Text>

						<View style={[styles.action, {
						borderRadius: 10,
						borderWidth: 1,
						borderColor: "#000000",
						borderBottomColor: "#000000",
						borderBottomWidth: 1,
						// alignItems:"center",
						justifyContent: "space-between", padding: 10
					}]}>
						<TextInput
							name='password'
							placeholder='New Password'
							secureTextEntry={
								secureTextEntry
							}
							style={styles.passwordInput}
							onChange={(event) =>
								this.handlePasswordChange(event, "newpassword")
							}
							autoCapitalize='none'
						/>

						{
							secureTextEntry ? <Ionicons name="md-eye-off" size={24} color="#ff4c00" onPress={this.changeEyeIcon} /> : <Ionicons name="md-eye" size={24} color="#ff4c00" onPress={this.changeEyeIcon} />
						}

					</View>


					<Text style={styles.label}>Confirm New Password</Text>
					<View style={[styles.action,
					{
						borderRadius: 10,
						borderWidth: 1,
						borderColor: "#000000",
						borderBottomColor: "#000000",
						borderBottomWidth: 1,
						// alignItems:"center",s
						justifyContent: "space-between", padding: 10
					}
					]}>
						<TextInput
							name='confirmpassword'
							placeholder='Confirm Password'
							secureTextEntry={
								secureTextEntryConfirm
							}
							style={styles.passwordInput}
							// onChangeText={(val) => handlePasswordChange(val)}
							onChange={(event) =>
								this.handlePasswordChange(event, "confirmpassword")
							}
							autoCapitalize='none'
						/>

						{
							secureTextEntryConfirm ? <Ionicons name="md-eye-off" size={24} color="#ff4c00" onPress={this.changeEyeIconConfirm} /> : <Ionicons name="md-eye" size={24} color="#ff4c00" onPress={this.changeEyeIconConfirm} />
						}

					</View>



						<View style={styles.button}>
					<TouchableOpacity
						style={{ width: "100%" }}
						onPress={() => this.submitNewPassword()}
					>
						<LinearGradient
							colors={["#0074EF", "#0074EF"]}
							style={styles.signIn}
						>

									<View style={{flexDirection:'row',justifyContent:'center',alignContent:'center'}}>
									<Text
										style={[
											styles.textSign,
											{ color: "#ffffff",paddingTop:3 },
										]}
									>
										Change Password
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
				</View>
			</View>
		)
	}
}

const mapStateToProps = ({ currentUser }) => {
	return {
		currentUser,
	}
}

export default connect(mapStateToProps)(ChangePassword)

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
		marginLeft: "22%",
	},
	changePasswordHeader: {
		fontSize:24,
		fontWeight:'bold',
		marginBottom:10,
		fontFamily:'Poppins_700Bold',

	},
	changePasswordSubHeader: {
		fontSize:14,
		fontFamily:'Poppins_400Regular'

	},
	text_footer: {
		color: "#05375a",
		fontSize: 18,
	},
	action: {
		flexDirection: "row",
		marginTop: 10,
		marginBottom:10,
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
		color: "red",
		padding: 10,
		textAlign: "center",
	},
	successMsg: {
		color: "green",
		padding: 10,
		textAlign: "center",
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
	passwordInput: {
		// padding: 10,
		width: "95%"
	},
	label:{
		fontSize: 14,
		// paddingBottom: 10,
	},
})
