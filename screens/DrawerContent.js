/* eslint-disable react-native/no-inline-styles */
import React from "react"

import {
	Text,
	Title,
	Switch,
	Avatar,
	Drawer,
	Caption,
	useTheme,
	TouchableRipple,
} from "react-native-paper"
import { DrawerItem, DrawerContentScrollView } from "@react-navigation/drawer"
import { View, StyleSheet } from "react-native"
import { AuthContext } from "../components/context"
import DrawerHeader from "../components/DrawerHeader"
import { useSelector } from "react-redux"
import { OPERATIVE, BUSINESS } from "../utils/accountTypes"
import { MaterialIcons as Icon } from "@expo/vector-icons"
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons"
import { FontAwesome } from '@expo/vector-icons'; 

import PushNotification from "../components/PushNotifications"

Icon.loadFont()

export function DrawerContent(props) {
	const paperTheme = useTheme()
	const user = useSelector((currentUser) => currentUser)

	const { signOut, toggleTheme } = React.useContext(AuthContext)

	return (
		<View style={{ flex: 1, backgroundColor: "#efefef" }}>
			<DrawerContentScrollView {...props}>
				<View style={styles.drawerContent}>
					<View style={styles.userInfoSection}>
						<DrawerHeader {...props} />
					</View>

					<Drawer.Section style={styles.drawerSection}>
						{user.currentUser.accountType === OPERATIVE ? (
							<View>
								<DrawerItem
									style={{ marginTop: 15 }}
									label='Home'
									icon={(black, size) => (
										<Icon name='home' size={20} />
									)}
									onPress={() => {
										props.navigation.navigate(
											"Home"
										)
									}}
								/>
								{/* OperativeGigs */}
								<DrawerItem
									label='My Gigs'
									icon={(black, size) => (
										<Entypo
											name='box'
											size={20}
											color='black'
										/>
									)}
									onPress={() => {
										props.navigation.navigate("CurrentGig")
									}}
								/>

								<DrawerItem
									label='Profile Settings'
									icon={(black, size) => (
										<Icon name='person' size={20} />
									)}
									onPress={() => {
										props.navigation.navigate(
											"ProfileScreen"
										)
									}}
								/>

							</View>
						) : (
							<View>
								<DrawerItem
									style={{ marginTop: 15 }}
									label='Home'
									icon={(black, size) => (
										<Icon name='home' size={20} />
									)}
									onPress={() => {
										props.navigation.navigate(
											"Home"
										)
									}}
								/>
								

	
								
								
								<DrawerItem
									label='Post a Gig'
									icon={(black, size) => (
										<Entypo
											name='box'
											size={20}
											color='black'
										/>
									)}
									onPress={() => {
										props.navigation.navigate("GigScreen")
									}}
								/>
								<DrawerItem
									label='Matched Gigs'
									icon={(black, size) => (
										<Entypo
											name='box'
											size={20}
											color='black'
										/>
									)}
									onPress={() => {
										props.navigation.navigate("MatchedGigs")
									}}
								/>
								<DrawerItem
									label='Profile'
									icon={(black, size) => (
										<Icon name='person' size={20} />
									)}
									onPress={() => {
										props.navigation.navigate(
											"ProfileScreen"
										)
									}}
									/>

							</View>
						)}

					</Drawer.Section>
					
					{user.currentUser.accountType === BUSINESS && !user.currentUser.notificationToken ? (
						<Drawer.Section>
							<PushNotification {...props} />
						</Drawer.Section>
					) : (
						<View></View>
					)}
				</View>
			</DrawerContentScrollView>

			<Drawer.Section>
				<DrawerItem
					style={styles.bottomDrawerSection}
					icon={(black, size) => (
						<MaterialCommunityIcons
							name='logout'
							size={16}
							color={
								user.currentUser.accountType === OPERATIVE
									? "#ff4c00"
									: "#006dff"
							}
						/>
					)}
					label='Log Out'
					onPress={() => {
						signOut()
					}}
				/>
			</Drawer.Section>
		</View>
	)
}

// Styling
const styles = StyleSheet.create({
	drawerContent: {
		flex: 1,
		backgroundColor: "#efefef",
		height: "100%",
	},
	userInfoSection: {
		marginTop: -10,
	},
	title: {
		fontSize: 16,
		marginTop: 3,
		fontWeight: "bold",
	},
	caption: {
		fontSize: 14,
		lineHeight: 14,
	},
	row: {
		marginTop: 20,
		flexDirection: "row",
		alignItems: "center",
	},
	section: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 15,
	},
	paragraph: {
		fontWeight: "bold",
		marginRight: 3,
	},
	drawerSection: {
		marginTop: 15,
	},
	bottomDrawerSection: {
		marginBottom: 15,
		color: "#ff4c00",
	},
	preference: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 12,
		paddingHorizontal: 16,
	},
})
