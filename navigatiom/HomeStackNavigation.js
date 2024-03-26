import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
  HomeScreen,
  ProfileScreen,
  OperativeMatchScreen,
  HomeDrawerScreen,
  OperativeGigsScreen,
  GigScreen,
  BusinessGigsScreen,
  ChangePasswordScreen,
  BusinessLicenceScreen,
  UploadDocScreen,
  SpecialityScreen,
  AccountDetailsScreen,
  BarcodeScreen,
  GigMatchScreen,
  BusinessProfileScreen,
  ScanBarcodeScreen,
  GigshiftScreen,
  QRCodeGeneratorScreen,
  CurrentGigScreen,
  CreatedGigsScreen,
  MobilePaymentScreen,
  ResetPasswordScreen,
  MatchedGigsScreen,
  PaymentsScreen,
  AcceptPaymentsScreen,
  MainTabScreen,
  BusinessAcceptAperatorScreen,
  VerifyCode,
  PhoneNumberVerification
} from '../utils/strings'


import Home from "../screens/HomeScreen"
import Profile from "../screens/ProfileScreen"
import ChangePassword from "../screens/ChangePassword"
import Barcode from "../screens/BarcodeScreen"
import Payments from "../screens/Payments"
import AccountDetails from "../screens/AccountDetails"
import CreatedGigs from '../screens/CreatedGigs';
import UploadDoc from "../screens/DocumentsScreen"
import Speciality from "../screens/Speciality"
import OperativeMatch from "../screens/OperativeMatch"
import BusinessProfile from "../screens/BusinessProfile"
import Gigshift from "../screens/GigShift"
import GigPostScreen from "../screens/GigScreen"
import BusinessAcceptAperator from "../screens/BusinessAcceptAperator"
import GigMatch from "../screens/GigsMatch"
import AcceptPayment from "../screens/AcceptPayment"
import BusinessGigs from "../screens/BusinessGigs"
import BusinessLicense from "../screens/BusinessLicense"
import OperativeGigs from "../screens/OperativeGigs"
import QRCodeGenerator from "../screens/QRcodegenerator"
import AllGigsScreen from "../screens/AllGigs"
import CurrentGig from "../screens/CurrentGig"
import MobilePayment from "../screens/MobilePayment"
import MySpeciality from "../screens/MySpeciality"
import ResetPassword from "../screens/ResetPassword"
import MatchedGigs from "../screens/MatchGig"
import AddCard from "../screens/AddCard"
import MainTab from "./MainTabNavigator"

const HomeStack = createStackNavigator();

class HomeStackScreen extends React.Component {
  render() {
    return (
      <HomeStack.Navigator screenOptions={{ headerShown: false }}>
        <HomeStack.Screen name={MainTabScreen} component={MainTab} />
        <HomeStack.Screen name={HomeScreen} component={Home} />
        
        {/* <HomeStack.Screen name={PaymentMethodScreen} component={PaymentMethod} />  */}
        <HomeStack.Screen name={UploadDocScreen} component={UploadDoc} />
        <HomeStack.Screen name={ProfileScreen} component={Profile} /> 
        <HomeStack.Screen name={BusinessLicenceScreen} component={BusinessLicense} />
        <HomeStack.Screen name={AccountDetailsScreen} component={AccountDetails} />
        <HomeStack.Screen name={BarcodeScreen} component={Barcode} />
        <HomeStack.Screen name={BusinessGigsScreen} component={BusinessGigs} />
        <HomeStack.Screen name={GigScreen} component={GigPostScreen} />
        <HomeStack.Screen name={OperativeGigsScreen} component={OperativeGigs} />
        {/* <HomeStack.Screen name={HomeDrawerScreen} component={HomeDrawer} /> */}
         <HomeStack.Screen name={OperativeMatchScreen} component={OperativeMatch} />
        <HomeStack.Screen name={ChangePasswordScreen} component={ChangePassword} />
        <HomeStack.Screen name={SpecialityScreen} component={MySpeciality} />
        <HomeStack.Screen name={GigMatchScreen} component={GigMatch} />
         <HomeStack.Screen name={BusinessProfileScreen} component={BusinessProfile} />
        <HomeStack.Screen name={GigshiftScreen} component={Gigshift} />
        <HomeStack.Screen name={CreatedGigsScreen} component={CreatedGigs} />



        <HomeStack.Screen name={QRCodeGeneratorScreen} component={QRCodeGenerator} />
        <HomeStack.Screen name={CurrentGigScreen} component={CurrentGig} />
         <HomeStack.Screen name={MobilePaymentScreen} component={MobilePayment} />
        <HomeStack.Screen name={ResetPasswordScreen} component={ResetPassword} />
        <HomeStack.Screen name={MatchedGigsScreen} component={MatchedGigs} />
        <HomeStack.Screen name={PaymentsScreen} component={Payments} />
         <HomeStack.Screen name={AcceptPaymentsScreen} component={AcceptPayment} />
        <HomeStack.Screen name={BusinessAcceptAperatorScreen} component={BusinessAcceptAperator} />

        
      </HomeStack.Navigator>
    );
  }
}

export default HomeStackScreen;
