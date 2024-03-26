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
	Dimensions,
} from "react-native"
import { WebView } from "expo"
import Toast from 'react-native-root-toast'
import { LinearGradient } from "expo-linear-gradient"
import * as DocumentPicker from "expo-document-picker"
import { setUser } from "../screens/redux/actions/User"
import { updateLicenceDetails } from "../services/api"
import * as ImagePicker from "expo-image-picker"
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
class UploadDoc extends Component {
	constructor(props) {
		super()
		this.state = {
			singleFile: null,
			file: null,
			fileSelected: false,
			localUri: null,
			type: null,
			loading: false,
			fileName: "",
			currentLicence: null,
			visible: false,
			uploading: false,
		}

		this.handleChoosePhoto = async () => {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			})
			if (!result.cancelled) {
				let localUri = result.uri
				let filename = localUri.split("/").pop()
				let match = /\.(\w+)$/.exec(filename)
				let type = match ? `image/${match[1]}` : `image`

				this.setState({
					singleFile: result.uri,
					fileName: filename,
					type: type,
				})
			}
		}
		this.uploadDocument = async () => {
			if (this.state.singleFile) {
				const type = this.state.type
				let formData = new FormData()
				formData.append("License", "License");
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
						fileName: "",
					})
				} else {
					this.setState({
						loading: false,
						fileName: "",
					})
				}
			} else {
				Toast.show("Please select a file", Toast.SHORT)
			}
		}
	}

	async componentDidMount() {
		this.setState({ singleFile: this.props.currentUser.License })
	}
	render() {
		return (
			<View style={styles.container}>
				<Loader loading={this.state.loading} />

				<View>
					<SearchBar
						navigation={this.props.navigation}
						componentText='Government Issued ID'
								updateProfile={false}
								{...this.props}
								
					/>
				</View>

				<View
					style={{ justifyContent: "center", alignItems: "center" }}
				>
					{!this.state.singleFile ? (
						<View style={styles.docView}>
							<TouchableOpacity
								
							>
								<Text style={{ color: "#3E548D",fontSize:18 }}>
									No Files Uploaded
								</Text>
							</TouchableOpacity>
						</View>
					) : (
						<View style={styles.coverImage}>
							<Image
								// style={styles.uploadIco}
								source={
									{ uri: this.state.singleFile }
									//  require("../assets/profile.png")
								}
								style={styles.cvrimage}
								resizeMode='cover'
							/>
						</View>
					)}
				</View>

				<View style={styles.footer}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<Text style={[styles.textSign]}>Upload ID</Text>
						<TouchableOpacity style={styles.docSection} onPress={() => this.handleChoosePhoto()}>

								<Image
									style={styles.uploadIco}
									source={require("../assets/icons2.0/UploadIcon.png")}
								/>
				          <Text style={styles.UploadText}>Drag & drop files or <Text style={{color:'#483EA8'}}>Browse</Text></Text>
						</TouchableOpacity>
						<View style={styles.button}>
							<TouchableOpacity
								style={{ width: "100%" }}
								onPress={() => this.uploadDocument()}
							>
								<LinearGradient
									colors={["#ffffff", "#ffffff"]}
									style={styles.signIn}
								>
									<Text
										style={[
											styles.textSign,
											{ color: "#006dff", fontSize: 18, fontWeight: 'bold' },
										]}
									>
										Upload
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

export default connect(mapStateToProps)(UploadDoc)

// Styling
const styles = StyleSheet.create({
	container: {
		flex: 7,
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
	uploadIco:{
		height:73,
		width:85,
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
	UploadText:{
		textAlign:'center',
		paddingVertical:10,
		fontWeight:'600',
		fontSize:16
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
	image: {
		flex: 1,
		height: undefined,
		width: undefined,
		backgroundColor: "gray",
	},
	textSign: {
		fontSize: 24,
		textAlign: "center",
		color:'#3E548D'
	},
	coverImage: {
		width: "100%",
		height: 170,
		borderRadius: 20,
		overflow: "hidden",
		marginBottom: 50,
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 15,
	},
	cvrimage: {
		flex: 1,
		height: "100%",
		width: "100%",
		backgroundColor: "red",
	},
	docSection: {
		flex: 1,
		marginTop: 10,
		padding: 20,
		height: 140,
		color: "#05375a",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#483EA8",
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 1, height: 5 },
		shadowOpacity: 0.1,
		alignItems: "center",
		justifyContent: "center",
		borderStyle:'dashed'
	},
	docView: {
		backgroundColor: "#ffffff",
		height: 146,
		width: "90%",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 50,
	},
})
