/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from "react"
// import {GOOGLE_MAPS_KEY} from '@env';
import {
	Platform,
	Linking,
	PermissionsAndroid,
	TouchableOpacity,
	Image,
} from "react-native"
import Constants from "expo-constants"
// import {Polyline} from 'expo'
import * as Notifications from "expo-notifications"
// import Polyline from "@mapbox/polyline"
import {StyleSheet,View,Text,Dimensions} from "react-native"
// import Geolocation from "react-native-geolocation-service"
import {changeStatus} from "../screens/redux/actions/User"
// import {GOOGLE_MAPS_KEY} from "../utils/map"
import MapView,{PROVIDER_GOOGLE,Marker} from "react-native-maps"
import SearchBar from "../components/SearchBar"
import * as Location from "expo-location"

import ToggleSwitch from "react-native-switch-toggle"
import {connect} from "react-redux"
import Loader from "../components/Loader"

const {width,height} = Dimensions.get("screen")
const latitudeDelta = 0.025
const longitudeDelta = 0.025

class HomeScreen extends React.Component {
	state = {
		gigLocation: {
			lat: -1.18883,
			lng: 36.839439,
		},
		customerDetails: null,
		latitude: null,
		distance: "",
		time: "",
		coords: [],
		newGig: false,
		gig: null,
		longitude: null,
		desLatitude: -1.9702,
		loading: true,
		desLongitude: 29.9869,
		newOrder: false,
		acceptedOrder: false,
		region: {
			latitudeDelta,
			longitudeDelta,
			latitude: null,
			longitude: null
		}
	}

	async componentWillReceiveProps(newProps) {
		const newGig = newProps.route.params.gig
		try {
			let {status} = await Location.requestForegroundPermissionsAsync()
			if(status !== "granted") {
				// setErrorMsg("Permission to access location was denied")
				return
			}

			let location = await Location.getCurrentPositionAsync({})

			await this.setState({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				gigLocation: newGig.location,
				loading: false,
				region: {
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
					latitudeDelta: latitudeDelta,
					longitudeDelta: longitudeDelta,
				},
			})
		} catch(err) {
			console.warn(err)
		}
		this.mergeCoords()
	}



	async componentDidMount() {
		this.setState({loading: true})
		// this.socket = io("https://apera-service.herokuapp.com")
		const newGig = this.props.route.params.gig
		try {
			let {status} = await Location.requestForegroundPermissionsAsync()
			if(status !== "granted") {
				setErrorMsg("Permission to access location was denied")
				return
			}

			let location = await Location.getCurrentPositionAsync({})

			await this.setState({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				gigLocation: newGig.location,
				loading: false,
				region: {
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
					latitudeDelta: latitudeDelta,
					longitudeDelta: longitudeDelta,
				},
			})
		} catch(err) {
			console.warn(err)
		}
		this.mergeCoords()
	}

	toggleSwitch() {
		this.props.dispatch(
			changeStatus(
				this.props.currentUser.status === "online"
					? "offline"
					: "online"
			)
		)
	}

	mergeCoords = () => {
		const {latitude,longitude,gigLocation} = this.state
		const hasStartAndEnd = latitude !== null && gigLocation.lat !== null
		if(hasStartAndEnd) {
			const concatStart = `${latitude},${longitude}`
			const concatEnd = `${gigLocation.lat},${gigLocation.lng}`
			this.getDirections(concatStart,concatEnd)
		}
	}

	async getDirections(startLoc,desLoc) {
		try {
			const resp = await fetch(
				`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${desLoc}&key=${GOOGLE_MAPS_KEY}`
			)
			const respJson = await resp.json()
			const response = respJson.routes[0]
			const distanceTime = response.legs[0]
			const distance = distanceTime.distance.text
			const time = distanceTime.duration.text
			const points = Polyline.decode(
				respJson.routes[0].overview_polyline.points
			)
			const coords = points.map((point,index) => {
				return {
					latitude: point[0],
					longitude: point[1],
				}
			})
			this.setState({coords,distance,time})
		} catch(error) {
			//console.log("Error: ", error)
		}
	}

	// getUserChangedLocation() {
	// 	const {coordinate} = this.state
	// 	const _watchId = Geolocation.watchPosition(
	// 		(position) => {
	// 			const {latitude,longitude} = position.coords
	// 		},
	// 		(error) => {
	// 			//console.log(error)
	// 		},
	// 		{
	// 			enableHighAccuracy: true,
	// 			distanceFilter: 0,
	// 			interval: 5000,
	// 			fastestInterval: 2000,
	// 		}
	// 	)
	// }
	renderMarkers = (lat,long) => {
		return (
			<>
				<Marker
					title='Gig Location'
					key={8900}
					coordinate={{
						latitude: this.state.gigLocation.lat,
						longitude: this.state.gigLocation.lng,
					}}
				/>

				<Marker
					icon={require("../assets/marker.png")}
					key={70007}
					title='Your Location'
					coordinate={{latitude: lat,longitude: long}}
				/>
			</>
		)
	}
	onRegionChange = region => {
		this.setState({
			region
		})
	}

	render() {
		const {
			time,
			coords,
			distance,
			latitude,
			longitude,
			gigLocation,
			destination,
			region
		} = this.state
		const newGig = this.props.route.params.gig
		// //console.log("newGig", gigLocation,latitude,longitude)

		if(latitude) {
			return (
				<View>
					<SearchBar
						navigation={this.props.navigation}
						componentText='Gig Location'
					/>
					<Loader loading={this.state.loading} />
					<MapView
						provider={PROVIDER_GOOGLE}
						style={styles.map}
						initialRegion={region}
						onRegionChangeComplete={this.onRegionChange}
					>
						{this.renderMarkers(latitude,longitude)}
						<MapView.Polyline
							strokeWidth={2}
							strokeColor='red'
							coordinates={coords}
						/>
					</MapView>

					{/* <View style={styles.switchCard}>
						<View style={styles.infoP}>
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
							<Text style={styles.nameP}>
								{this.props.currentUser.firstName}{" "}
								{this.props.currentUser.lastName}{" "}
							</Text>
						</View>
						<ToggleSwitch
							isOn={
								this.props.currentUser.status === "online"
									? true
									: false
							}
							onToggle={() =>
								this.toggleSwitch(
									this.props.currentUser.status === "online"
										? true
										: false
								)
							}
							onColor='#34c759'
							size='large'
						/>
					</View> */}
					{/* <View style={styles.instContainer}>
						<Text style={styles.instruction}>
							Set your current location{" "}
						</Text>
					</View> */}

					<View style={styles.candidateCard}>
						<View>
							<View style={styles.profileImage}>
								<Image
									source={
										this.state.photo
											? {uri: this.state.photo}
											: require("../assets/profile.png")
									}
									style={styles.image}
									resizeMode='cover'
								/>
							</View>
							<View>
								<Text style={styles.nameC}>Settle Bar</Text>
							</View>
							<View style={styles.rating}>
								<Text style={styles.ratingTitle}>
									Rating 4.0
								</Text>
								<View></View>
							</View>
						</View>
						<View style={styles.timeDetails}>
							<View>
								<Text style={styles.nameC}>
									Destination time
								</Text>
								<Text style={styles.arrivalTime}>
									{this.state.time}
								</Text>
							</View>
							<View>
								<Text style={styles.nameC}>
									Distance to travel
								</Text>
								<Text style={styles.arrivalTime}>
									{this.state.distance}
								</Text>
							</View>
							<View style={styles.goBtn}>
								<Text style={styles.btnText}>GO</Text>
							</View>
						</View>
					</View>
				</View>
			)
		}

		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text></Text>
			</View>
		)
	}
}

function mapStateToProps({status,currentUser}) {
	return {
		status,
		currentUser,
	}
}
export default connect(mapStateToProps)(HomeScreen)

const styles = StyleSheet.create({
	map: {
		height: "100%",
	},
	bubble: {
		flexDirection: "row",
		alignSelf: "flex-start",
		backgroundColor: "#fff",
		borderRadius: 6,
		borderColor: "#ccc",
		borderWidth: 0.5,
		padding: 15,
		width: 150,
	},
	orderButtons: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	buttonAccept: {
		backgroundColor: "#4FFF33",
		borderColor: "#4FFF33",
		width: 150,
		// borderRadius: 25,
		marginVertical: 10,
		paddingVertical: 8,
	},
	buttonCall: {
		backgroundColor: "#336BFF",
		borderColor: "#336BFF",
		width: 120,
		// borderRadius: 25,
		marginVertical: 10,
		paddingVertical: 8,
	},
	buttonCancel: {
		backgroundColor: "#FF5733",
		borderColor: "#FF5733",
		width: 150,
		// borderRadius: 25,
		marginVertical: 10,
		paddingVertical: 8,
	},
	buttonText: {
		fontSize: 16,
		fontWeight: "500",
		color: "#ffffff",
		textAlign: "center",
	},
	customerRequest: {
		display: "flex",
		alignContent: "center",
		alignItems: "center",
		justifyContent: "space-between",
		flexDirection: "row",
		marginTop: 10,
		marginLeft: 10,
	},
	newOrder: {
		position: "absolute",
		bottom: 0,
		alignSelf: "center",
		padding: 10,
		height: height * 0.2,
		width: "100%",
		backgroundColor: "white",
	},
	oflineOnlineStatus: {
		position: "absolute",
		bottom: 0,
		alignSelf: "center",
		// alignItems: 'center',
		padding: 10,
		height: height * 0.14,
		width: "100%",
		backgroundColor: "white",
	},
	arrow: {
		backgroundColor: "transparent",
		borderColor: "transparent",
		borderTopColor: "#fff",
		borderWidth: 16,
		alignSelf: "center",
		marginTop: -32,
	},
	arrowBorder: {
		backgroundColor: "transparent",
		borderColor: "transparent",
		borderTopColor: "#007a87",
		borderWidth: 16,
		alignSelf: "center",
		marginTop: -0.5,
	},
	name: {
		fontSize: 16,
		marginBottom: 5,
	},
	image: {
		width: 120,
		height: 80,
	},
	switchCard: {
		width: 341,
		height: 73,
		borderRadius: 10,
		position: "absolute",
		backgroundColor: "#ffffff",
		top: 110,
		marginLeft: 35,
		padding: 15,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	nameP: {
		color: "black",
		fontWeight: "900",
		fontSize: 16,
		marginLeft: 10,
	},
	profileImage: {
		width: 52,
		height: 52,
		borderRadius: 100,
		overflow: "hidden",
		margin: 5,
	},
	image: {
		flex: 1,
		height: undefined,
		width: undefined,
		backgroundColor: "gray",
	},
	infoP: {
		flexDirection: "row",
		alignItems: "center",
	},
	instContainer: {
		width: 341,
		height: 41,
		borderRadius: 10,
		position: "absolute",
		marginLeft: 35,
		top: 200,
		backgroundColor: "#006dff",
		borderColor: "#ffffff",
		borderWidth: 3,
		padding: 8,
	},
	instruction: {
		color: "#ffffff",
		marginLeft: 5,
		fontSize: 12,
	},
	candidateCard: {
		width: 341,
		height: 140,
		backgroundColor: "#ffffff",
		bottom: 200,
		position: "absolute",
		marginLeft: 35,
		borderRadius: 10,
		padding: 10,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	rating: {
		flexDirection: "row",
	},
	ratingTitle: {
		fontSize: 10,
		marginRight: 15,
		marginLeft: 10,
	},
	timeDetails: {
		flexDirection: "row",
		marginTop: 10,
	},
	arrivalTime: {
		fontSize: 12,
		fontWeight: "bold",
		color: "#006dff",
		marginLeft: 10,
	},
	goBtn: {
		height: 30,
		width: 30,
		backgroundColor: "#2e2e2e",
		borderRadius: 10,
		marginLeft: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	btnText: {
		fontWeight: "bold",
		fontSize: 12,
		color: "#ffffff",
	},
	nameC: {
		marginLeft: 10,
		fontSize: 10,
		fontWeight: "bold",
	},
})
