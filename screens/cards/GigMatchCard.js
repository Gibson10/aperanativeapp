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
} from "react-native"
import Toast from 'react-native-root-toast'
import * as Animatable from "react-native-animatable"
import { OPERATIVE, BUSINESS } from "../../utils/accountTypes"
import {
	AntDesign,
	Feather,
	FontAwesome,
	MaterialIcons,
} from "@expo/vector-icons"
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from "react-redux"

Feather.loadFont()
FontAwesome.loadFont()
class GigMatchCard extends Component {
	constructor(props) {
		super()
		this.state = {}
	}

	render() {
		const { gig } = this.props
		return (
			<View style={styles.detailscard} key={gig._id}>
				<View>
					<TouchableOpacity onPress={() => this.handleChoosePhoto()}>
						<View style={styles.profileImage}>
							<Image
								source={
									gig.gigCreator.profilePhoto
										? { uri: gig.gigCreator.profilePhoto }
										: require("../../assets/profile.png")
								}
								style={styles.image}
								resizeMode='cover'
							/>
						</View>
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					onPress={() =>
						this.props.navigation.navigate("BusinessProfile", {
							gig: gig,
						})
					}
				>
					<View style={styles.details}>
						<View>
							<Text style={styles.name}>
								{gig.gigCreator.firstName}{" "}
								{gig.gigCreator.lastName}
							</Text>
						</View>
						<View style={styles.rating}>
							<Text style={styles.ratingTitle}>Rating 4.0</Text>
							<View></View>
						</View>
						<View>
							<Text style={styles.hire}>{gig.gigName}</Text>
						</View>
						<View style={styles.skills}>
							<Text style={styles.skillSet}>Dancer</Text>
							<Text style={styles.skillSet}>DJ</Text>
							<Text style={styles.skillSet}>Model</Text>
							<Text style={styles.skillSet}>Actor</Text>
						</View>
					</View>
					<View style={styles.ButtonSec}>
						{this.props.currentUser.accountType === OPERATIVE ? (
							<View>
								{!gig.acceptedStatus ? (
									<View style={styles.availBtn}>
										<TouchableOpacity
											onPress={() =>
												this.props.navigation.navigate(
													"BusinessProfile",
													{ gig: gig }
												)
											}
										>
											<Text style={styles.availText}>
												Click to Accept
											</Text>
										</TouchableOpacity>
									</View>
								) : (
									<View style={styles.takenBtn}>
										<Text style={styles.availText}>
											Pending
										</Text>
									</View>
								)}
							</View>
						) : (
							<View></View>
						)}
					</View>
				</TouchableOpacity>
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

export default connect(mapStateToProps)(GigMatchCard)

// Styling
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f4f4f4",
	},
	detailscard: {
		backgroundColor: "#ffffff",
		borderRadius: 10,
		margin: 16,
		shadowColor: "#000",
		shadowOffset: { width: 1, height: 20 },
		shadowOpacity: 0.1,
		flexDirection: "row",
		paddingRight: 10,
	},
	profileImage: {
		width: 52,
		height: 52,
		borderRadius: 100,
		overflow: "hidden",
		margin: 15,
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
		fontSize: 10,
	},
	hire: {
		fontWeight: "bold",
		fontSize: 10,
		color: "#006dff",
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
		marginRight: 50,
	},
	skillSet: {
		backgroundColor: "#ededed",
		color: "#006dff",
		fontSize: 10,
		fontWeight: "bold",
		borderRadius: 10,
		paddingLeft: 10,
		paddingRight: 10,
		margin: 8,
		marginLeft: 0,
	},

	availBtn: {
		backgroundColor: "green",
		fontWeight: "bold",
		borderRadius: 10,
		paddingLeft: 5,
		paddingRight: 5,
	},
	availText: {
		color: "#ffffff",
		fontSize: 12,
	},
	takenBtn: {
		backgroundColor: "red",
		fontWeight: "bold",
		borderRadius: 10,
		paddingLeft: 5,
		paddingRight: 5,
	},
	ButtonSec: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	btnText: {
		fontSize: 12,
		marginRight: 5,
		marginLeft: 5,
	},
	scanBtn: {
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#ededed",
		paddingRight: 5,
		paddingLeft: 5,
		marginRight: 10,
	},
	locationBtn: {
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#ededed",
		paddingRight: 5,
		paddingLeft: 5,
		marginRight: 10,
	},
})
