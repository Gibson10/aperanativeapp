/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React,{Fragment} from "react"
import {
	Platform,
	Linking,
	PermissionsAndroid,
	TouchableOpacity,
	Image,
	Alert,
	ActivityIndicator,
} from "react-native"
import Constants from "expo-constants"
// import Toast from 'react-native-root-toast'
import { setUser } from "../screens/redux/actions/User"

import {
	AntDesign,
	Feather,
	FontAwesome,
	MaterialIcons,
} from "@expo/vector-icons"
import Toast from 'react-native-root-toast';
import {StyleSheet,View,Text,Dimensions} from "react-native"
import Geocoder from "react-native-geocoding"
import {changeStatus} from "../screens/redux/actions/User"
import {GOOGLE_MAPS_KEY} from "../utils/map"
import {OPERATIVE} from "../utils/accountTypes"
import {getGigs,getMatchedGigs,profilePut} from "../services/api"
import MapView,{PROVIDER_GOOGLE,Marker} from "react-native-maps"
import SearchBar from "../components/SearchBar"
import * as Location from "expo-location"
import ToggleSwitch from "react-native-switch-toggle"
import {connect} from "react-redux"
import Loader from "../components/Loader"
import GigModal from "../components/GigModal"
import * as Animatable from "react-native-animatable"
import GoogleAutoComplete from "./components/GooglePlaceAutocomplete"

import PlaceInput from "./components/PlacesInput"

const LOCATION_TASK_NAME = 'background-location-task';

Geocoder.init(GOOGLE_MAPS_KEY)
const {width,height} = Dimensions.get("screen")
const latitudeDelta = 0.225
const longitudeDelta = 0.225
class AllGigsScreen extends React.Component {
	_isMounted = false;
	state = {
		gigLocation: {
			lat: -1.28883,
			lng: 36.839439,
		},
		addressLocation: "",
		allGigs: [],
		customerDetails: null,
		latitude: null,
		distance: "",
		time: "",
		coords: [],
		newGig: false,
		gigModal: false,
		gig: null,
		newGig: false,
		gigFound: false,
		longitude: null,
		desLatitude: -1.9702,
		maploaded: true,
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

	findCoords = (data) => {

		Geocoder.from(data.description)
			.then((json) => {
				var location = json.results[0].geometry.location
				this.setState({
					addressLocation: data.description,
					lat_long: location,
				})
			})
			.catch((error) => console.warn(error))
	}

	async componentDidMount() {
		this._isMounted = true;

		this.getCurrentLocation()
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
	async locationAlert() {
		
		if(!this.props.currentUser.locationAccepted){
		Alert.alert(
			"Location",
			"This App uses location data to enable us to match you with the closest gigs ( merchants) or Aperatives ( Gig workers) near you, even when the App is closed or not in use",
			[
				{
					text: "Cancel",
					onPress: () => {this.setState({permissionRead: true})},
					style: "cancel"
				},
				{text: "OK",onPress: async() => {
					// console.log("user id",this.props.currentUser.user._id)
					const locationAcceptedUpdated= await profilePut({locationAccepted: true})
					if (locationAcceptedUpdated) {	
						console.log("current user",locationAcceptedUpdated.user)	
						const Token = {
							userToken: locationAcceptedUpdated.access_token,
						}	
						this.props.dispatch(setUser(locationAcceptedUpdated.user, Token))
				   
	
					}

					this.setState({permissionRead: true})}}
			],
			{cancelable: true}
		);}else{

		}

	}
	async getCurrentLocation() {
		try {
			
			await this.locationAlert()
			
			let {status} = await Location.requestForegroundPermissionsAsync()
			if(status == "granted") {
				// await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
				// 	accuracy: Location.Accuracy.Balanced,
				//   });
				}else{

				}
				// setErrorMsg("Permission to access location was denied")
			
			let location = await Location.getCurrentPositionAsync({})

			Geocoder.from(location.coords.latitude,location.coords.longitude)
				.then((json) => {
					Geocoder.from(json.results[0].formatted_address)
						.then((json) => {
							var location = json.results[0].geometry.location

							this.setState({
								latitude: location.lat,
								longitude: location.lng,
								loading: false,
								maploaded: location.lat ? false : true,
								region: {
									latitude: location.lat,
									longitude: location.lng,
									latitudeDelta: latitudeDelta,
									longitudeDelta: longitudeDelta,
								},
							})
						})
						.catch((error) => console.warn(error))
				})
				.catch((error) => console.warn(error))
		} catch(err) {
			console.warn(err)
		}
	}

	toggleSwitch = async (status) => {
		this.props.dispatch(
			changeStatus(
				this.props.currentUser.status === "online"
					? "offline"
					: "online"
			)
		)
		if(!status) {
			const data = {
				userSkills: this.props.currentUser.preferredSkills,
				userLocation: {
					lat: this.state.latitude,
					lng: this.state.longitude,
				},
			}
			this.setState({loading: true,newGig: true})
			const matchedGigs = await getMatchedGigs(
				this.props.currentUser._id,
				data
			)
			console.log("matched gigs",matchedGigs)
			if(matchedGigs) {
				this.setState({gigFound: true,newGigFound: matchedGigs})
			} else {
				console.log("no matched gigs")
				Toast.show("No gigs found",{position: Toast.positions.CENTER})
				this.props.dispatch(
					changeStatus(
						"offline"
					)
				)
				this.setState({newGig: false})
			}
		}
	}
	currentCords = (lat_long) => {
		this.setState({
			lat_long: lat_long,
			latitude: lat_long.lat,
			longitude: lat_long.lng,
		})
	}

	openGigModal() {
		this.setState({gigModal: true})
	}
	closeGigModal() {
		this.setState({gigModal: false,newGig: false})
		this.props.dispatch(
			changeStatus(
				"offline"
			)
		)
	}
	renderMarkers = (lat,long) => {
		return (
			<Fragment>
				{this.state.allGigs.map((item,index) => (
					<Marker
						title={`Gig`}
						key={index}
						coordinate={{
							latitude: item.location.lat,
							longitude: item.location.lng,
						}}
					/>
				))}
				<Marker
					icon={require("../assets/map-marker.png")}
					key={70007}
					title='Your Location'
					coordinate={{latitude: lat,longitude: long}} />
			</Fragment>
		)
	}

	onRegionChange = region => {
		this.setState({
			region: region,
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
			allGigs,
			region
		} = this.state
		const gigImage = this.state.newGigFound
		if(latitude) {
			return (
				<View>
					{/* <SearchBar
						navigation={this.props.navigation}
						componentText='Home'
					/> */}

					<MapView
						provider={PROVIDER_GOOGLE}
						style={styles.map}
						initialRegion={region}
						onRegionChangeComplete={this.onRegionChange}
					>
						{this.renderMarkers(latitude,longitude)}
					</MapView>

					{this.props.currentUser.accountType === OPERATIVE ? (
						<View style={styles.switchCard}>
							<View style={styles.infoP}>
								<View style={styles.profileImage}>
									<Image
										source={
											this.props.currentUser.profilePhoto
												? {
													uri: this.props
														.currentUser
														.profilePhoto,
												}
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
								switchOn={
									this.props.currentUser.status === "online"
										? true
										: false
								}
								onPress={() =>
									this.toggleSwitch(
										this.props.currentUser.status ===
											"online"
											? true
											: false
									)
								}
								onColor='#34c759'
								circleColorOn='#34c759'
								
								size='large'
							/>
						</View>
					) : (
						<View></View>
					)}

					<View style={styles.instContainer}>
						{/* <View style={{marginBottom: 20}}> */}
							<GoogleAutoComplete
								currentCords={(e) => this.currentCords(e)}
							/>
						{/* </View> */}
					</View>
					{this.state.newGig ? (
						<View style={styles.gigContainer}>
							{!this.state.gigFound ? (
								<View>
									<Text style={styles.instruction}>
										Searching Gigs near you{" "}
									</Text>
									<View
										style={{
											display: "flex",
											alignItems: "center",
										}}
									>
										<View
											style={
												styles.activityIndicatorWrapper
											}
										>
											<ActivityIndicator
												size={20}
												animating={this.state.loading}
											/>
										</View>
									</View>
								</View>
							) : (
								<View style={styles.matchWidget}>
									<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginLeft:10}}>
									<Text style={styles.instruction}>
										You have Been matched{" "}
									</Text>
									<View style={styles.close}>
									<TouchableOpacity
										onPress={() => this.closeGigModal()}
									>
										<MaterialIcons name='clear' color='#000000' size={17} />
									</TouchableOpacity>
									</View>

									</View>
									
									<View style={styles.matchProfile}>
										<View style={styles.profileImage}>
											<Image
												source={
													this.props.currentUser
														.profilePhoto
														? {
															uri: this.props
																.currentUser
																.profilePhoto,
														}
														: require("../assets/profile.png")
												}
												style={styles.image}
												resizeMode='cover'
											/>
										</View>
										
										<View style={styles.profileImage}>
											<Image
												source={
													gigImage.gigCreator
													.profilePhoto
														? {
															uri:
																gigImage
																	.gigCreator
																	.profilePhoto,
														}
														: require("../assets/profile.png")
												}
												style={styles.image}
												resizeMode='cover'
											/>
										</View>
									</View>
									<TouchableOpacity
										onPress={() => this.openGigModal()}
									>
										<Text style={styles.gigLink}>
											View GigMatch{" "}
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => this.closeGigModal()}
									>
										<Text style={styles.gigClose}>
											close{" "}
										</Text>
									</TouchableOpacity>
								</View>
							)}
						</View>
					) : (
						<View></View>
					)}
					<View>
						<GigModal
							visible={this.state.gigModal}
							closeModal={() => this.closeGigModal()}
							{...this.props}
							gig={this.state.newGigFound}
						/>
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
				{/* <Text></Text> */}
				{/* <Loader loading={true} /> */}
				<ActivityIndicator size="large" color="#0000ff" />
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
export default connect(mapStateToProps)(AllGigsScreen)

const styles = StyleSheet.create({
	map: {
		height: "100%",
	},
	marker: {
		height: 48,
		width: 48
	},
	markerFixed: {
		left: '50%',
		marginLeft: -24,
		marginTop: -48,
		position: 'absolute',
		top: '40%'
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
	footer: {
		flex: 1,
		backgroundColor: "#ffffff",
		borderTopLeftRadius: 10,
		borderBottomRightRadius: 10,
		paddingHorizontal: 20,
		paddingVertical: 30,
	},
	modalStyle: {
		marginTop: 100,
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
	matchProfile: {
		flexDirection: "row",
		marginTop: 20,
		marginBottom: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	activityIndicatorWrapper: {
		backgroundColor: "#FFFFFF",
		height: 100,
		width: 100,
		borderRadius: 10,
		display: "flex",
		alignItems: "center",
		justifyContent: "space-around",
	},
	buttonCall: {
		backgroundColor: "#336BFF",
		borderColor: "#336BFF",
		width: 120,
		// borderRadius: 25,
		marginVertical: 10,
		paddingVertical: 8,
	},
	matchWidget: {
		alignItems: "center",
	},
	buttonCancel: {
		backgroundColor: "#FF5733",
		borderColor: "#FF5733",
		width: 150,
		// borderRadius: 25,
		marginVertical: 10,
		paddingVertical: 8,
	},

	gigLink: {
		textDecorationLine: "underline",
		color: "#000000",
		fontSize: 12,
	},
	gigClose: {
		marginTop: 15,
		// textDecorationLine: "underline",
		color: "#FF0000",
		fontSize: 14,
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
		height: 60,
		borderRadius: 10,
		position: "absolute",
		marginLeft: 35,
		top: 200,
		backgroundColor: "#ffffff",
		borderColor: "#ffffff",
		borderWidth: 3,
		padding: 8,
	},
	gigContainer: {
		width: 341,
		height: 200,
		textAlign: "center",
		alignItems: "center",
		borderRadius: 10,
		position: "absolute",
		marginLeft: 35,
		top: 400,
		backgroundColor: "#ffffff",
		borderColor: "#ffffff",
		borderWidth: 3,
		padding: 8,
	},
	instruction: {
		color: "#000000",
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
