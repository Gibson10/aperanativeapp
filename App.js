
import AppLoading from 'expo-app-loading';

import React,{Component} from 'react';

import { StatusBar } from 'expo-status-bar';
import { RootSiblingParent } from 'react-native-root-siblings';
// import {Notifications} from 'expo'
// import * as Notifications from 'expo-notifications';

// import AcceptGigAparativeModal from './components/AcceptGigAparativeModal';
import { Provider } from 'react-redux';
import {
	Platform,
  View,
  StyleSheet,
  Text
} from "react-native"
import { createStore } from 'redux';
// import {Notifications} from 'expo'
import middleware from './screens/redux/middleware';
import combineReducers from './screens/redux/reducers/index';
// import AsyncStorage from '@react-native-community/async-storage';

import AsyncStorage from '@react-native-async-storage/async-storage';

// LogBox.ignoreAllLogs()
// import SigninScreen from './screens/SigninScreen';
// import SignupScreen from './screens/SignupScreen';
// import SplashScreen from './screens/SplashScreen';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
// import { LogBox } from 'react-native';
// LogBox.ignoreAllLogs()
import {
  useFonts,
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from '@expo-google-fonts/poppins';


import AuthChanger from './navigatiom/AuthChanger';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers,
);
export const store = createStore(persistedReducer, middleware);
const persistor = persistStore(store);

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

const App = () => { 

  let [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }


//   constructor(props) {
//     super(props);
//     this.state = {
//       notification: {},
//       modalShow:false,
//       profileId:''
//     };
// }


// render(){
  return (
    // <View style={[styles.container]}>
    //   <Text>Hello there</Text>
    // </View>
    <RootSiblingParent> 
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthChanger />
      </PersistGate>
    </Provider>

    </RootSiblingParent>
  
  );
  }


export default App;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

