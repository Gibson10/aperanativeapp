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
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
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

Feather.loadFont()
FontAwesome.loadFont()
class OperativeMatch extends Component {
	constructor(props) {
		super()
		this.state = {}
	}

	render() {
		return (
			<View style={styles.container}>
				<View>
					<SearchBar
						navigation={this.props.navigation}
						componentText='Home'
					/>
				</View>
				<View style={styles.detailscard}>
					<View>
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
						</TouchableOpacity>
					</View>
					<View style={styles.details}>
						<View>
							<Text style={styles.name}>Michael B. Jackson</Text>
						</View>
						<View style={styles.rating}>
							<Text style={styles.ratingTitle}>Rating 4.0</Text>
							<View></View>
						</View>
						<View style={styles.skills}>
							<Text style={styles.skillSet}>Dancer</Text>
							<Text style={styles.skillSet}>DJ</Text>
							<Text style={styles.skillSet}>Model</Text>
							<Text style={styles.skillSet}>Actor</Text>
						</View>
					</View>
				</View>
			</View>
		)
	}
}

export default OperativeMatch

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
		height: 94,
		shadowColor: "#000",
		shadowOffset: { width: 1, height: 20 },
		shadowOpacity: 0.1,
		flexDirection: "row",
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
	rating: {
		flexDirection: "row",
	},
	ratingTitle: {
		fontSize: 10,
		marginRight: 15,
	},
	skills: {
		flexDirection: "row",
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
})
