import React, { Component } from "react"
import { View } from "react-native"
import PlacesInput from "react-native-places-input"
import { GOOGLE_MAPS_KEY } from "../../utils/map"
import Geocoder from "react-native-geocoding"
import * as Location from "expo-location"
import { Ionicons } from "@expo/vector-icons"
import { connect } from "react-redux"
Geocoder.init(GOOGLE_MAPS_KEY)

class PlaceInput extends Component {
	constructor(props) {
		super(props)
		this.state = {
			addressLocation: "",
			lat_long: {},
		}

		this.findCoords = (data) => {
			Geocoder.from(data.description)
				.then((json) => {
					var location = json.results[0].geometry.location
					this.setState({
						addressLocation: data.description,
						lat_long: location,
					})
					this.props.currentCords(location)
				})
				.catch((error) => console.warn(error))
		}
	}

	async getCurrentLocation() {
		try {
			let { status } = await Location.requestForegroundPermissionsAsync()
			if (status !== "granted") {
				// setErrorMsg("Permission to access location was denied")
				return
			}

			let location = await Location.getCurrentPositionAsync({})

			Geocoder.from(location.coords.latitude, location.coords.longitude)
				.then((json) => {
					Geocoder.from(json.results[0].formatted_address)
						.then((json) => {
							var location = json.results[0].geometry.location
							this.setState({
								addressLocation:
									json.results[0].formatted_address,
								lat_long: location,
							})
							this.props.currentCords(location)
						})
						.catch((error) => console.warn(error))
				})
				.catch((error) => console.warn(error))
		} catch (err) {
			console.warn(err)
		}
	}
	async componentDidMount() {
		this.getCurrentLocation()
	}

	render() {
		return (
			<View style={{ width: "100%", paddingBottom: 20 }}>
				<PlacesInput
					placeHolder={
						this.state.addressLocation
							? this.state.addressLocation
							: "Your Location"
					}
					stylesContainer={{
						position: "relative",
						alignSelf: "stretch",
						margin: 0,
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						shadowOpacity: 0,
						borderColor: "#dedede",
						borderWidth: 1,
						marginBottom: 10,
					}}
					stylesList={{
						top: 50,
						borderColor: "#dedede",
						borderLeftWidth: 1,
						borderRightWidth: 1,
						borderBottomWidth: 1,
						left: -1,
						right: -1,
					}}
					googleApiKey={GOOGLE_MAPS_KEY}
					onSelect={
						(place) => 
						//console.log("place", place)
						//   this.findCoords(place)
						{}
					}
				/>
			</View>
		)
	}
}

function mapStateToProps({ currentUser }) {
	return {
		currentUser: currentUser,
	}
}
export default connect(mapStateToProps)(PlaceInput)
