import React, { Component } from "react"
import { Text, View, StyleSheet } from "react-native"
// import { QRCode as CustomQRCode } from 'react-native-custom-qr-codes-expo';
import QRCode from "react-native-qrcode-svg"

class QRCodeGenerator extends Component {
	render() {
		const { gigId, gigStatus } = this.props
		const gigData = {
			gigId: gigId,
			gigStatus: gigStatus,
		}
		return (
			<View style={styles.container}>
				<View style={styles.qrContainer}>
					<QRCode size={120} value={JSON.stringify(gigData)} />
				</View>
			</View>
		)
	}
}
export default QRCodeGenerator

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f4f4f4",
	},
	qrContainer: {
		alignItems: "center",
		height: "40%",
	},
})
