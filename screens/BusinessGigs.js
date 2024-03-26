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
import Toast from 'react-native-root-toast'
import * as Animatable from "react-native-animatable"
import { getBusinessGigs } from "../services/api"
import {
	AntDesign,
	Feather,
	FontAwesome,
	MaterialIcons,
} from "@expo/vector-icons"
import { AuthContext } from "../components/context"
import SearchBar from "../components/SearchBar"
import BusinessGigCard from "./cards/BusinessGigCard"
import Loader from "../components/Loader"
import { connect } from "react-redux"

Feather.loadFont()
FontAwesome.loadFont()
class BusinessGigs extends Component {
	constructor(props) {
		super()
		this.state = {
			gigs: [],
			isLoaded: false,
		}
	}
	async componentDidMount() {
		const allGigs = await getBusinessGigs(this.props.currentUser._id)

		this.setState({ gigs: allGigs ? allGigs : [], isLoaded: true })
	}

	render() {
		//console.log("allgigs", this.state.gigs)
		return (
			<View style={styles.container}>
				<View>
					<SearchBar
						navigation={this.props.navigation}
						componentText='My Gigs'
					/>
				</View>
				<ScrollView showsVerticalScrollIndicator={false}>
					{this.state.isLoaded ? (
						<View>
							{this.state.gigs.map((item) => (
								<BusinessGigCard
									key={item._id}
									gig={item}
									{...this.props}
								/>
							))}
						</View>
					) : (
						<Loader visible={true} />
					)}
				</ScrollView>
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

export default connect(mapStateToProps)(BusinessGigs)

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
	placeholderContainer: {
		width: "90%",
		backgroundColor: "#fff",
		height: 200,
	},
	placeholder: {
		height: 20,
		marginTop: 6,
		marginLeft: 15,
		alignSelf: "flex-start",
		justifyContent: "center",
		backgroundColor: "#eeeeee",
	},
	placeholderTitle: {
		flex: 1,
		marginTop: 50,
		marginBottom: 30,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "red",
		width: Dimensions.get("window").width,
		height: 100,
	},
	placeholderTitle__text: {
		height: 50,
		marginLeft: 15,
		alignSelf: "flex-start",
		justifyContent: "center",
		backgroundColor: "#eeeeee",
	},
})
