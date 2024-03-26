/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from "react"

import {
	Provider as PaperProvider,
	DarkTheme as PaperDarkTheme,
	DefaultTheme as PaperDefaultTheme,
} from "react-native-paper"
import {
	NavigationContainer,
	DarkTheme as NavigationDarkTheme,
	DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native"
import {PhoneNumberVerification} from "../utils/strings"
import {DrawerContent} from '../screens/DrawerContent'
import { login, register, businessRegister } from "../services/api"
import HomeStackScreen from "./HomeStackNavigation"
import { useDispatch, connect } from "react-redux"
import { useTheme } from "@react-navigation/native"
import { View, ActivityIndicator } from "react-native"
import { setUser, setNoUser } from "../screens/redux/actions/User"
import { createDrawerNavigator } from "@react-navigation/drawer"
import AsyncStorage from '@react-native-async-storage/async-storage';

import RootStackScreen from "./RootStackScreen"
import { AuthContext } from "../components/context"
import { logout } from "../screens/redux/actions/LoginActions"

const STORAGE_KEY = "userToken"

const Drawer = createDrawerNavigator()

const AuthChanger = (props) => {
	const [isDarkTheme, setIsDarkTheme] = React.useState(false)

	const CustomDefaultTheme = {
		...NavigationDefaultTheme,
		...PaperDefaultTheme,
		colors: {
			...NavigationDefaultTheme.colors,
			...PaperDefaultTheme.colors,
			background: "#ffffff",
			text: "#333333",
		},
	}

	const CustomDarkTheme = {
		...NavigationDarkTheme,
		...PaperDarkTheme,
		colors: {
			...NavigationDarkTheme.colors,
			...PaperDarkTheme.colors,
			background: "#333333",
			text: "#ffffff",
		},
	}

	const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme

	const dispatch = useDispatch()

	const authContext = React.useMemo(
		() => ({
			signIn: async (data) => {
				// const userDetails = {
				// 	email: userName,
				// 	password: password,
				// }

				const loginUser = await login(data)

				// console.log("loginUser", loginUser)
				if (loginUser && loginUser.access_token) {

						await AsyncStorage.setItem(
							STORAGE_KEY,
							loginUser.access_token
						)

					const Token = {
						userToken: loginUser.access_token,
					}
					
					dispatch(setUser(loginUser.user, Token))
					const status = {
						status: true,
						data: ""
					}
					return status



				} else {
					//console.log()
					const status = {
						status: false,
						data: loginUser.message.message,
					}
					return status
				}
			},
			signOut: async () => {
				try {
					await AsyncStorage.removeItem(STORAGE_KEY)
					await dispatch(logout())
				} catch (e) {
					// Do nothing
				}
			},

			signUp: async (data,navigation) => {
				const registerUser = await register(data)
				// console.log("Registered User", registerUser)

				if (registerUser && registerUser.access_token) {

					if(!registerUser.phoneNumber){
					const status = {
						status: true,
						data: "",
					}

						await AsyncStorage.setItem(
							STORAGE_KEY,
							registerUser.access_token
						)
						console.log("navigate",navigation)
						navigation.navigate(PhoneNumberVerification)
						return status
					}
					// try {
					// 	await AsyncStorage.setItem(
					// 		STORAGE_KEY,
					// 		registerUser.access_token
					// 	)
					// } catch (e) {
					// 	// Do nothing
					// }
					// const Token = {
					// 	userToken: registerUser.access_token,
					// }
					// const status = {
					// 	status: true,
					// 	data: "",
					// }
					// dispatch(setUser(registerUser.user, Token))
					// return status
				} else {
					// console.log("registerUser", registerUser)
					const status = {
						status: false,
						data: registerUser.message.message,
					}

					return status
				}
			},
			businessRegistration: async (data,navigation) => {
				const registerUser = await businessRegister(data)
				// console.log("Registered User", registerUser)

				if (registerUser && registerUser.access_token) {


					if(!registerUser.phoneNumber){
						const status = {
							status: true,
							data: "",
						}
	
							await AsyncStorage.setItem(
								STORAGE_KEY,
								registerUser.access_token
							)
							// console.log("navigation",navigation)
							navigation.navigate(PhoneNumberVerification)
							return status
						}

					// try {
					// 	await AsyncStorage.setItem(
					// 		STORAGE_KEY,
					// 		registerUser.access_token
					// 	)
					// } catch (e) {
					// 	// Do nothing
					// }
					
					// const Token = {
					// 	userToken: registerUser.access_token,
					// }
					// const status = {
					// 	status: true,
					// 	data: "",
					// }
					// dispatch(setUser(registerUser.user, Token))
					// return status
				} else {
					const status = {
						status: false,
						data: registerUser.message.message,
					}
					return status
				}
			},
			toggleTheme: () => {
				setIsDarkTheme(!isDarkTheme)
			},
		}),
		[dispatch, isDarkTheme, props.product]
	)

	useEffect(() => {
		setTimeout(async () => {
			try {

				const userToken = await AsyncStorage.getItem(STORAGE_KEY)
				// console.log("userToken", userToken)
				// if (userToken) {
				// 	const token = {
				// 		userToken: userToken,
				// 	}
				// 	dispatch(setUser({}, token))
				// } else {
				// 	dispatch(setNoUser())
				// }
			} catch (e) {
				// Do nothing
			}
		}, 1000)
	}, [dispatch, props])



	return (
		<PaperProvider theme={theme}>
			<AuthContext.Provider value={authContext}>
				<NavigationContainer theme={theme}>
					{props.currentUser.userToken !== null ? (
						<HomeStackScreen/>

							
					) : (
						<RootStackScreen />
					)}
				</NavigationContainer>
			</AuthContext.Provider>
		</PaperProvider>
	)
}

const mapStateToProps = ({ currentUser, login }) => {
	return {
		currentUser,
		login,
	}
}

export default connect(mapStateToProps)(AuthChanger)
