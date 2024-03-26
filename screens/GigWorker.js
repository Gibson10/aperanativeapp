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
	Button,
} from "react-native"
import Toast from 'react-native-root-toast'
import * as Animatable from "react-native-animatable"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { acceptGig ,acceptApparator} from "../services/api"
import Loader from "../components/Loader"
import {
	AntDesign,
	Feather,
	FontAwesome,
	MaterialIcons,
} from "@expo/vector-icons"
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from "../components/context"
import SearchBar from "../components/SearchBar"
import { connect } from "react-redux"

Feather.loadFont()
FontAwesome.loadFont()
class GigWorker extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
		}
	}
	async acceptGig() {
		 this.props.closeModal()
	}
	async rejectGig() {
		const businessProfile = this.props
		this.setState({ loading: true })
		// console.log("businessProfile", businessProfile.currentGig._id)

		const rejectedStatus = await acceptApparator(businessProfile.currentGig._id)
		console.log("rejectedStatus", rejectedStatus)
		if (rejectedStatus) {
			this.setState({ loading: false })
			this.props.closeModal()

		}
	}

	render() {
		const { operative,gig } = this.props
		const operativeProfile = operative
		return (
			<View style={styles.container}>
				<Loader loading={this.state.loading} />
				<View style={styles.close}>
					<TouchableOpacity onPress={() => this.props.closeModal()}>
						<MaterialIcons name='clear' color='#000000' size={20} />
					</TouchableOpacity>
				</View>
				<View style={styles.detailscard}>
					<View>
						<TouchableOpacity
							onPress={() => this.handleChoosePhoto()}
						>
							<View style={styles.profileImage}>
								<Image
									source={
										operativeProfile.profilePhoto
											? {
													uri:
														operativeProfile.profilePhoto,
											  }
											: require("../assets/profile.png")
									}
									style={styles.image}
									resizeMode='cover'
								/>
							</View>
						</TouchableOpacity>
					</View>
					<View style={styles.details}>
						<View>
							<Text style={styles.name}>
								{operativeProfile.firstName}{" "}
								{operativeProfile.lastName}
							</Text>
						</View>
						<View style={styles.rating}>
							<Text style={styles.ratingTitle}>Rating 4.0</Text>
							<View></View>
						</View>
					</View>
				</View>
				<Text style={styles.title}>Speciality</Text>
				<View style={styles.skills}>
					{operativeProfile.preferredSkills.map((item) => (
						<Text key={item} style={styles.skillSet}>{item}</Text>
					))}
				</View>
				<View style={styles.taskDetails}>
					<View style={styles.calenderTitle}>
						<Image source={require("../assets/calendar.png")} />
						<Text style={styles.ctitle}>
							Available to work
						</Text>
					</View>
					<Text style={styles.timing}></Text>
					{/* <View style={styles.wages}>
						<Text style={styles.ctitle}>$:</Text>
						<Text style={styles.price}></Text>
					</View>
					<View style={styles.wages}>
						<Text style={styles.ctitle}>Job status:</Text>
					</View> */}
				</View>

				<View style={styles.about}>
					<Text style={styles.atitle}>
						About {operativeProfile.firstName}
					</Text>
					<Text style={styles.aboutDetails}>
						{operativeProfile.about}
					</Text>
				</View>

				<View style={styles.button}>
						<TouchableOpacity onPress={() => this.acceptGig()}>
							<View>
								<Text style={styles.btnTitle}>Accept</Text>
								<View style={styles.btnTick}>
									<Image
										source={require("../assets/check.png")}
									/>
								</View>
							</View>
						</TouchableOpacity>

						<View>
						<TouchableOpacity onPress={() => this.rejectGig()}>
							<Text style={styles.btnTitle}>Reject</Text>
							<View style={styles.btnCross}>
								<Image
									source={require("../assets/cross.png")}
								/>
								
							</View>
							</TouchableOpacity>
						</View>
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

export default connect(mapStateToProps)(GigWorker)

// Styling
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	detailscard: {
		margin: 16,
		height: 94,
		flexDirection: "row",
	},
	profileImage: {
		width: 83,
		height: 83,
		borderRadius: 100,
		overflow: "hidden",
		marginRight: 15,
	},
	image: {
		flex: 1,
		height: undefined,
		width: undefined,
		backgroundColor: "gray",
	},
	details: {
		marginTop: 15,
		marginRight: 15,
	},
	name: {
		fontWeight: "bold",
		fontSize: 16,
	},
	rating: {
		flexDirection: "row",
	},
	ratingTitle: {
		fontSize: 10,
		marginRight: 15,
	},
	skills: {
		flexDirection: "row",
		flexWrap: "wrap",
		margin: 16,
		marginLeft: 25,
	},
	skillSet: {
		backgroundColor:Platform.OS === 'ios' ? '#ffffff' : '#ededed',
		color: "#006dff",
		fontSize: 10,
		fontWeight: "bold",
		borderRadius: 10,
		paddingLeft: 10,
		paddingRight: 10,
		margin: 8,
		marginLeft: 0,
	},
	close: {
		alignItems: "flex-end",
		width: "100%",
		paddingRight: 20,
		paddingTop: 40,
	},
	title: {
		fontSize: 12,
		fontWeight: "bold",
		marginLeft: 25,
		marginTop: 16,
	},
	taskDetails: {
		borderColor: "#c4c4c4",
		borderTopWidth: 1,
		borderBottomWidth: 1,
		margin: 16,
	},
	calenderTitle: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 10,
	},
	ctitle: {
		fontWeight: "bold",
		fontSize: 12,
		marginLeft: 10,
	},
	timing: {
		fontSize: 10,
		marginTop: 10,
		marginLeft: 30,
	},
	wages: {
		flexDirection: "row",
		marginTop: 10,
		marginLeft: 20,
		marginBottom: 10,
	},
	price: {
		fontSize: 12,
		fontWeight: "bold",
		color: "green",
		marginLeft: 5,
	},
	openGig: {
		fontSize: 12,
		fontWeight: "bold",
		color: "green",
		marginLeft: 5,
	},
	closeGig: {
		fontSize: 12,
		fontWeight: "bold",
		color: "#f64f4f",
		marginLeft: 5,
	},
	about: {
		marginLeft: 16,
		marginRight: 16,
	},
	atitle: {
		fontSize: 12,
		fontWeight: "bold",
	},
	aboutDetails: {
		fontSize: 10,
		color: "#000000",
		marginTop: 15,
	},
	button: {
		backgroundColor: "#ffffff",
		height: 130,
		// margin: 60,
		marginBottom: 20,
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 1, height: 100 },
		shadowOpacity: 0.15,
		borderRadius: 10,
	},
	btnTitle: {
		fontSize: 14,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 10,
	},
	btnTick: {
		backgroundColor: "#3eb770",
		width: 86,
		height: 60,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	btnCross: {
		backgroundColor: "#f64f4f",
		width: 86,
		height: 60,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
})
