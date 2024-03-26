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
import { updateAccountDetails } from "../services/api"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { setUser } from "../screens/redux/actions/User"
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

class AccountDetails extends Component {
	constructor(props) {
		super()
		this.state = {
			cardNumber: "",
			expiration: "",
			secretCode: "",
			loading: false,
		}

		this.textInputChange = (event, name) => {
			const { text } = event.nativeEvent

			this.setState({
				[name]: text,
			})
		}

		this.submitAccountDetails = async () => {
			const { cardNumber, expiration, secretCode } = this.state

			if (cardNumber.trim() && expiration.trim() && secretCode.trim()) {
				this.setState({ loading: true })
				const data = {
					cardNumber: cardNumber,
					expirationDate: expiration,
					secretCode: secretCode,
				}

				const updatedAccount = await updateAccountDetails(
					this.props.currentUser._id,
					data
				)
				//console.log("updatedAccount", updatedAccount)
				if (updatedAccount.status) {
					const Token = {
						userToken: updatedAccount.access_token,
					}
					this.props.dispatch(setUser(updatedAccount.user, Token))
					Toast.show(updatedAccount.message, Toast.SHORT)
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
	}

	componentDidMount() {
		this.setState({
			cardNumber:this.props.currentUser.cardDetails? this.props.currentUser.cardDetails.cardNumber:'',
			expiration:this.props.currentUser.cardDetails? this.props.currentUser.cardDetails.expirationDate:'',
			secretCode: this.props.currentUser.cardDetails?this.props.currentUser.cardDetails.secretCode:'',
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<Loader loading={this.state.loading} />

				<View>
					<SearchBar
						navigation={this.props.navigation}
						componentText='Bank Account Details'
					/>
				</View>
				<View style={styles.header}></View>
				<View style={styles.footer}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={styles.action}>
							<TextInput
								name='cardNumber'
								placeholder='Card Number'
								value={this.state.cardNumber}
								style={styles.textInput}
								onChange={(event) =>
									this.textInputChange(event, "cardNumber")
								}
								autoCapitalize='none'
							/>
							<Feather icon='eye-off' color='grey' size={20} />
						</View>

						<View style={styles.action}>
							<TextInput
								name='expiration'
								placeholder='Expiration. eg 01/24'
								value={this.state.expiration}
								style={styles.textInput}
								onChange={(event) =>
									this.textInputChange(event, "expiration")
								}
								autoCapitalize='none'
							/>
							<Feather icon='eye-off' color='grey' size={20} />
						</View>
						<View style={styles.action}>
							<TextInput
								name='secretCode'
								placeholder='Secret Code eg. 099'
								value={this.state.secretCode}
								style={styles.textInput}
								onChange={(event) =>
									this.textInputChange(event, "secretCode")
								}
								autoCapitalize='none'
							/>
							<Feather icon='eye-off' color='grey' size={20} />
						</View>

						<View style={styles.button}>
							<TouchableOpacity
								style={{ width: "100%" }}
								onPress={() => this.submitAccountDetails()}
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

const mapStateToProps = ({ currentUser }) => {
	return {
		currentUser,
	}
}

export default connect(mapStateToProps)(AccountDetails)

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
		marginTop: 15,
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
})
