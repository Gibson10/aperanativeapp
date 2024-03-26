import * as React from "react"
import { Text, View } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

const Tab = createBottomTabNavigator()

function MyTabs() {
	return (
		<Tab.Navigator>
			<Tab.Screen name='Notification' component={HomeScreen} />
			<Tab.Screen name='Home' component={HomeScreen} />
			<Tab.Screen name='Profile' component={SettingsScreen} />
		</Tab.Navigator>
	)
}

export default MyTabs

