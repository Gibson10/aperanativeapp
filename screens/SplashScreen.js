import React from "react"
import {
	View,
	Text,
	Dimensions,
	StyleSheet,
	TouchableOpacity,
} from "react-native"
import * as Animatable from "react-native-animatable"
import SignupModal from "./SignupModal"

const SplashScreen = ({ navigation }) => {
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Animatable.Image
					animation='bounceIn'
					duration={1500}
					source={require("../assets/apera.png")}
					style={styles.logo}
					resizeMode='center'
				/>
				<Text style={styles.welcome}>Welcome</Text>
			</View>

			<View style={styles.button}>
				<TouchableOpacity
					onPress={() => navigation.navigate("SigninScreen")}
				>
					<Text style={styles.textSign}>Access Account</Text>
				</TouchableOpacity>
			</View>
			<SignupModal navigation={navigation} />
			<Text style={styles.footer}>Terms of Policy</Text>
			<Text style={styles.version}>App Version 1.0</Text>
		</View>
	)
}

export default SplashScreen

// Constants
// const { height } = Dimensions.get("screen")
// const height_logo = height * 0.28
// Styling
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
		padding: 17,
	},
	header: {
		flex: 2,
		justifyContent: "center",
		alignItems: "center",
	},
	logo: {
		// width: height_logo,
		// height: height_logo,
	},
	welcome: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#0074ef",
	},
	footer: {
		textAlign: "center",
		fontSize: 10,
	},
	version: {
		textAlign: "center",
		fontSize: 10,
		marginBottom: 150,
		marginTop: 50,
		fontWeight: "bold",
	},
	button: {
		marginTop: 20,
		width: "100%",
		backgroundColor: "#0074ef",
		borderRadius: 10,
	},
	textSign: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
		width: "100%",
		textAlign: "center",
		padding: 10,
	},
})
