import React, { Component } from "react"
import {
	Alert,
	Modal,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
	TouchableOpacity,
} from "react-native"
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons"

class SignupModal extends Component {
	state = {
		modalVisible: false,
	}

	setModalVisible = (visible) => {
		this.setState({ modalVisible: visible })
	}

	registerNavigate() {
		this.setState({ modalVisible: false })
		this.props.navigation.navigate("SignupScreen")
	}

	registerNavigateBusiness() {
		this.setState({ modalVisible: false })
		this.props.navigation.navigate("BusinessSignupScreen")
	}

	render() {
		const { modalVisible } = this.state
		return (
			<View style={styles.centeredView}>
				<Modal
					animationType='slide'
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => {
						Alert.alert("Modal has been closed.")
					}}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<View style={styles.close}>
								<Text style={styles.modalText}>
									I want to join as a
								</Text>
								<TouchableHighlight
									onPress={() => {
										this.setModalVisible(!modalVisible)
									}}
								>
									<MaterialIcons
										name='clear'
										color='#000000'
										size={24}
									/>
								</TouchableHighlight>
							</View>

							<View style={styles.accbutton}>
								<FontAwesome
									name='briefcase'
									color='#006dff'
									size={24}
								/>
								<TouchableOpacity
									onPress={() => {
										this.registerNavigateBusiness()
									}}
								>
									<Text style={styles.textBtnB}>
										Aperator
									</Text>
									<Text style={styles.subtextBtn}>
										Offering last minute gig
									</Text>
								</TouchableOpacity>
							</View>
							<View style={styles.accbutton}>
								<FontAwesome
									name='user-o'
									color='#f64f4f'
									size={24}
								/>
								<TouchableOpacity
									onPress={() => {
										this.registerNavigate()
									}}
								>
									<Text style={styles.textBtnO}>
										Aperative
									</Text>
									<Text style={styles.subtextBtn}>
									 Available for last minute gig
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>

				<TouchableHighlight
					style={styles.button}
					onPress={() => {
						this.setModalVisible(true)
					}}
				>
					<Text style={styles.textSign}>Create Account</Text>
				</TouchableHighlight>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	modalView: {
		width: '90%',
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		// alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	openButton: {
		backgroundColor: "#F194FF",
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalText: {
		fontSize: 20,
		marginRight: 25,
		// marginBottom: 15,
		// textAlign: "center"
	},
	textSign: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
		width: "100%",
		textAlign: "center",
		padding: 10,
	},
	button: {
		marginTop: -50,
		width: "100%",
		backgroundColor: "#0074ef",
		borderRadius: 10,
	},
	accbutton: {
		marginTop: 20,
		width: "100%",
		backgroundColor: "#f1f1f1",
		borderRadius: 10,
		color: "#000000",
		padding: 20,
		flexDirection: "row",
		alignItems: 'center',
		paddingLeft: '20%'
		// justifyContent: 'center'
	},
	textBtnB: {
		color: "#006dff",
		fontWeight: "bold",
		fontSize: 16,
		width: "100%",
		marginLeft: 25,
	},
	textBtnO: {
		color: "#f64f4f",
		fontWeight: "bold",
		fontSize: 16,
		width: "100%",
		marginLeft: 25,
	},
	subtextBtn: {
		color: "#000000",
		fontSize: 10,
		width: "100%",
		marginLeft: 25,
	},
	close: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
})

export default SignupModal
