/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react"
import {
	View,
	Text,
	Platform,
	StatusBar,
	Image,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Pressable,
	Dimensions,
	ActivityIndicator,
} from "react-native"
// import Toast from 'react-native-root-toast'
import Toast from 'react-native-root-toast';

import { LinearGradient } from "expo-linear-gradient"
import * as DocumentPicker from "expo-document-picker"
import { setUser } from "../screens/redux/actions/User"

import { updateLicenceDetails, updateBusiness } from "../services/api"
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
import PdfModal from "./PdfModal"
import GoogleAutoComplete from "./components/GooglePlaceAutocomplete"

Feather.loadFont()
FontAwesome.loadFont()
class BusinessLicense extends Component {
	constructor(props) {
		super()
		this.state = {
			singleFile: null,
			file: null,
			fileSelected: false,
			loading: false,
			fileName: "",
			currentLicence: null,
			businessName: "",
			visible: false,
			uploading: false,
			addressLocation: "",
			updateProfile:false,
			lat_long: {},
		}

		this._pickDocument = async () => {
			let result = await DocumentPicker.getDocumentAsync({})
			let localUri = result.uri
			let filename = result.name
			let match = /\.(\w+)$/.exec(filename)
			let type = match ? `application/${match[1]}` : `pdf`
			this.setState({
				singleFile: result.uri,
				file: result,
				type: type,
				fileName: "",
			})
		}

		this.uploadDocument = async () => {
			if (this.state.file) {
				const type = this.state.type
				let formData = new FormData()
				formData.append("file", {
					uri: this.state.singleFile,
					name: this.state.fileName,
					type,
				})
				this.setState({ loading: true })
				const updatedLicence = await updateLicenceDetails(
					this.props.currentUser._id,
					formData
				)

				if (updatedLicence) {
					Toast.show(updatedLicence.message, Toast.SHORT)
					const Token = {
						userToken: updatedLicence.access_token,
					}
					this.props.dispatch(setUser(updatedLicence.user, Token))
					this.setState({
						loading: false,
					})
				} else {
					this.setState({
						loading: false,
					})
				}
			} else {
				Toast.show("Please select a file", Toast.SHORT)
			}
		}
		this.submitBusinessDetails = async () => {
			const { businessName, lat_long } = this.state
			if (businessName.trim() && lat_long) {
				this.setState({ loading: true })
				const data = {
					businessName: businessName,
					location: lat_long,
				}
				const updatedAccount = await updateBusiness(
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
						updateProfile:false,
						singleFile:null,
						file: null,
						type: type,
						fileName: result.name,
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
		this.currentCords = (lat_long) => {
			this.setState({
				lat_long: lat_long,
			})
		}

		this.showModalVisible = () => {
			this.setState({
				visible: true,
			})
		}
		this.textInputChange = (event, name) => {
			const { text } = event.nativeEvent

			this.setState({
				[name]: text,
				updateProfile:true
			})
		}
		this.hideModalVisible = () => {
			this.setState({
				visible: false,
			})
			Toast.show("", Toast.SHORT)
		}
	}

	async componentDidMount() {
		this.setState({
			currentLicence: this.props.currentUser.License,
			businessName: this.props.currentUser.businessName,
		})
	}

	render() {
		return (
			<View style={styles.container}>
				{/* <Loader loading={this.state.loading} /> */}

				<View>
					<SearchBar
						navigation={this.props.navigation}
						componentText='Upload Documents'
						updateProfile={this.state.updateProfile}
						profileUpdate={()=>this.submitBusinessDetails()}
					/>
				</View>
				<View
					style={{paddingTop:10,paddingBottom:10}}
				>
					{
						this.state.loading?
						<ActivityIndicator size="small" color="#0000ff" />:
						<View></View>
					}
				
				</View>
                
				<View style={{ marginLeft: 20, marginRight: 20 }}>
					<Text
						style={[
							styles.textSign,
							{ marginBottom: 20, fontSize: 24 },
						]}
					>
						Business Details
					</Text>
					<View style={styles.action}>
						<TextInput
							name='about'
							value={this.state.businessName}
							placeholder='Business name'
							style={styles.textInput}
							autoCapitalize='none'
							onChange={(event) =>
								this.textInputChange(event, "businessName")
							}
						/>
					</View>
					<View style={styles.action}>
						<GoogleAutoComplete
							currentCords={(e) => this.currentCords(e)}
						/>
					</View>
				</View>

				<View style={styles.footer}>
					
						<Text
							style={[
								styles.textSign,
								{ fontSize: 24, marginBottom: 15 },
							]}
						>
							Business License
						</Text>
						<View
							style={{
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							{this.state.currentLicence ? (
								<View
									style={{
										marginBottom: 20,
										color: "black",
										backgroundColor: "#ffffff",
										width: "100%",
										padding: 30,
										alignItems: "center",
										justifyContent: "center",
										flexDirection: "row",
									}}
								>
									<TouchableOpacity
										onPress={() => this.showModalVisible()}
									>
										<View
										style={{
											display:'flex',
											flexDirection:'row'
										}}
										>
										<Text
											style={{
												color: "#000000",
												fontSize: 16,
												
										
											}}
										>
										
											View File 
											 
										</Text>
										<Feather style={{marginLeft:10}}name="eye" size={24} color="black" />
										</View>
									</TouchableOpacity>
								</View>
							) : (
								<View
									style={{
										marginBottom: 20,
										color: "black",
										backgroundColor: "#ffffff",
										width: "100%",
										padding: 30,
										alignItems: "center",
										justifyContent: "center",
										flexDirection: "row",
									}}
								>
									<TouchableOpacity
										onPress={() => this.showModalVisible()}
									>
										<Text
											style={{
												color: "black",
												fontSize: 16,
											}}
										>
											{this.state.fileName}
                                
										 
										</Text>
									</TouchableOpacity>
								</View>
							)}
						</View>

						<Text style={[styles.textSign, { fontSize: 24 }]}>
							Upload Business License
						</Text>
						<TouchableOpacity style={styles.docSection} onPress={() => this._pickDocument()}>
						
								<Image
									style={styles.uploadIco}
									source={require("../assets/uploadIcon.png")}
								/>
					
						</TouchableOpacity>
						<View style={styles.button}>
							<TouchableOpacity
								style={{ width: "100%" }}
								onPress={() => this.uploadDocument()}
							>
								{this.state.singleFile ? (
									<View
										style={{
											marginBottom: 20,
										}}
									>
										<TouchableOpacity
											onPress={() =>
												this.showModalVisible()
											}
										>
											<Text style={{ color: "green" }}>
												View Document:{" "}
												{this.state.fileName}
											</Text>
										</TouchableOpacity>
									</View>
								) : (
									<View></View>
								)}

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
										Upload
									</Text>
								</LinearGradient>
							</TouchableOpacity>
						</View>
			
				</View>
				{/* <View> */}
				<PdfModal
					visible={this.state.visible}
					onCancel={() => this.hideModalVisible()}
					link={
						this.state.singleFile
							? this.state.singleFile
							: this.state.currentLicence
					}
				/>
				{/* </View> */}
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

export default connect(mapStateToProps)(BusinessLicense)

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
	pdf: {
		flex: 1,
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
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
		marginLeft: "27%",
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
	docSection: {
		flex: 1,
		marginTop: 10,
		padding: 10,
		height: 115,
		color: "#05375a",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#000000",
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 1, height: 5 },
		shadowOpacity: 0.1,
		alignItems: "center",
		justifyContent: "center",
	},
})
