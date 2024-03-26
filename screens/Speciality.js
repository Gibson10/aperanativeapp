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
} from "react-native"
import Toast from 'react-native-root-toast'
import * as Animatable from "react-native-animatable"
import { updateBusinessDetails } from "../services/api"
import { LinearGradient } from "expo-linear-gradient"
import { setUser } from "../screens/redux/actions/User"
import { Ionicons } from "@expo/vector-icons"
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
class Speciality extends Component {
	constructor(props) {
		super()
		this.state = {
			about: "",
			businessLicense: "",
			street: "",
			isValidUser: false,
			loading: false,
			city: "",
			state: "",
			zipcode: "",
		}

		this.textInputChange = (event, name) => {
			const { text } = event.nativeEvent
			//console.log("state", name, text)
			this.setState({
				[name]: text,
			})
		}
		this.updateAccountDetails = async () => {
			const {
				about,
				businessLicense,
				street,
				city,
				state,
				zipcode,
			} = this.state

			if (
				// businessLicense.trim() &&
				street.trim() &&
				city.trim() &&
				state.trim() &&
				zipcode.trim() &&
				about.trim()
			) {
				this.setState({ loading: true })
				const data = {
					about: about,
					businessLicense: businessLicense,
					city: city,
					state: state,
					zipcode: zipcode,
				}

				const updatedAccount = await updateBusinessDetails(
					this.props.currentUser._id,
					data
				)

				if (updatedAccount) {
					Toast.show(updatedAccount.message, Toast.SHORT)
					const Token = {
						userToken: updatedAccount.access_token,
					}
					this.props.dispatch(setUser(updatedAccount.user, Token))
					this.setState({
						loading: false,
					})
				} else {
					this.setState({
						loading: false,
					})
				}
			} else {
				Toast.show("All fields are required", Toast.SHORT)
			}
		}

		this.handleValidUser = (val) => {
			if (val.trim().length >= 4) {
				this.setState({
					isValidUser: true,
				})
			} else {
				this.setState({
					isValidUser: false,
				})
			}
		}
	}
	componentDidMount() {
		this.setState({
			about: this.props.currentUser.businessProfile,
			businessLicense: "",
			street:this.props.currentUser.businessLocation? this.props.currentUser.businessLocation.street:"",
			city: this.props.currentUser.businessLocation?this.props.currentUser.businessLocation.city:"",
			state: this.props.currentUser.businessLocation?this.props.currentUser.businessLocation.state:"",
			zipcode: this.props.currentUser.businessLocation.zipcode,
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<Loader loading={this.state.loading} />

				<View>
					<SearchBar
						navigation={this.props.navigation}
						componentText='Update Business Profile'
						{...this.props}
					/>
				</View>
				<View style={styles.header}></View>
				<View animation='fadeInUpBig' style={styles.footer}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={styles.action}>
							<TextInput
								name='about'
								placeholder='About you'
								style={styles.textInput}
								multiline
								numberOfLines={4}
								autoCapitalize='none'
								onChange={(event) =>
									this.textInputChange(event, "about")
								}
								onEndEditing={(e) =>
									this.handleValidUser(e.nativeEvent.text)
								}
							/>
							<FontAwesome
								icon='check-circle'
								color='green'
								size={20}
							/>
						</View>
						{/* <View style={styles.action}>
            <TextInput
              name="businessLicense"
              placeholder="Business License"
              style={styles.textInput}
              autoCapitalize="none"
              onChange={(event) =>
                this.textInputChange(event, 'businessLicense')
              }
              onEndEditing={(e) =>
                this.handleValidUser(e.nativeEvent.text)
              }
            />
            <FontAwesome
              icon="check-circle"
              color="green"
              size={20}
            />
          </View> */}

						<Text style={styles.text_title}>Business Address</Text>
						<View style={styles.action}>
							<TextInput
								name='street'
								placeholder='Street'
								value={this.state.street}
								style={styles.textInput}
								autoCapitalize='none'
								onChange={(event) =>
									this.textInputChange(event, "street")
								}
								onEndEditing={(e) =>
									this.handleValidUser(e.nativeEvent.text)
								}
							/>
							<FontAwesome
								icon='check-circle'
								color='green'
								size={20}
							/>
						</View>

						<View style={styles.action}>
							<TextInput
								name='city'
								placeholder='City'
								value={this.state.city}
								style={styles.textInput}
								autoCapitalize='none'
								onChange={(event) =>
									this.textInputChange(event, "city")
								}
								onEndEditing={(e) =>
									this.handleValidUser(e.nativeEvent.text)
								}
							/>
							<FontAwesome
								icon='check-circle'
								color='green'
								size={20}
							/>
						</View>

						<View style={styles.address}>
							<View style={(styles.action, { width: "49%" })}>
								<TextInput
									name='state'
									placeholder='State'
									value={this.state.state}
									style={styles.textInput}
									autoCapitalize='none'
									onChange={(event) =>
										this.textInputChange(event, "state")
									}
									onEndEditing={(e) =>
										this.handleValidUser(e.nativeEvent.text)
									}
								/>
								<FontAwesome
									icon='check-circle'
									color='green'
									size={20}
								/>
							</View>
							<View style={(styles.action, { width: "49%" })}>
								<TextInput
									name='zipcode'
									placeholder='Zip code'
									style={styles.textInput}
									value={this.state.zipcode}
									autoCapitalize='none'
									onChange={(event) =>
										this.textInputChange(event, "zipcode")
									}
									onEndEditing={(e) =>
										this.handleValidUser(e.nativeEvent.text)
									}
								/>
								<FontAwesome
									icon='check-circle'
									color='green'
									size={20}
								/>
							</View>
						</View>

						<View style={styles.button}>
							<TouchableOpacity
								style={{ width: "100%" }}
								onPress={() => this.updateAccountDetails()}
							>
								<LinearGradient
									colors={["#ffffff", "#ffffff"]}
									style={styles.signIn}
								>
									<Text
										style={[
											styles.textSign,
											{ color: "#006dff" },
										]}
									>
										Update
									</Text>
								</LinearGradient>
							</TouchableOpacity>
						</View>
					</ScrollView>
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

export default connect(mapStateToProps)(Speciality)

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
	header: {
		flex: 1,
		justifyContent: "flex-start",
		paddingHorizontal: 20,
		marginTop: 20,
		flexDirection: "row",
		alignItems: "center",
	},
	text_header: {
		color: "#000000",
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 20,
		marginLeft: "35%",
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
})
