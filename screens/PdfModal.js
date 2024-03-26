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
// import PDFReader from "rn-pdf-reader-js"

class PdfModal extends Component {
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
					visible={this.props.visible}
					onRequestClose={() => {
						this.props.onCancel()
					}}
				>

              <View style={styles.close}>
					<TouchableOpacity
						 onPress={() => this.props.onCancel()}
					>
						<MaterialIcons name='clear' color='#000000' size={30} />
					</TouchableOpacity>
				</View>

					{/* <PDFReader
					   style={{paddingTop:20}}
						source={{
							uri: this.props.link,
						}}
					/> */}
				</Modal>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 50,
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
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
		marginRight: 15,
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
	},
	textBtnB: {
		color: "#006dff",
		fontWeight: "bold",
		fontSize: 12,
		width: "100%",
		marginLeft: 10,
	},
	textBtnO: {
		color: "#f64f4f",
		fontWeight: "bold",
		fontSize: 12,
		width: "100%",
		marginLeft: 10,
	},
	subtextBtn: {
		color: "#000000",
		fontSize: 8,
		width: "100%",
		marginLeft: 10,
	},
	close: {
		alignItems: "flex-end",
		width: "100%",
		paddingRight: 20,
		paddingTop: 40,
	},
})

export default PdfModal
