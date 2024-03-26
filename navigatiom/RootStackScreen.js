import React from 'react';

import SplashScreen from '../screens/SplashScreen';
import SignupScreen from '../screens/SignupScreen';
import BusinessSignupScreen from '../screens/BusinessSignup';
import SigninScreen from '../screens/SigninScreen';
import CompleteRegistration from '../screens/CompleteRegistration';
import { VerifyCode,Signin,Signup,
  PhoneNumberVerification,NewPassword,ResetPassword,ResetPasswordOTP} from '../utils/strings';
import VerifyCodeScreen from '../screens/TwoFactor/VerifyCode';
import CellPhoneNumber from '../screens/TwoFactor/CellPhoneNumber';
import NewPasswordScreen from '../screens/ForgetPassword/NewPassword';
import ResetPasswordOTPScreen from '../screens/ForgetPassword/ResetPasswordOTP';
import ResetPasswordScreen from '../screens/ForgetPassword/ResetPassword';
import { createStackNavigator } from '@react-navigation/stack';

const RootStack = createStackNavigator();

class RootStackScreen extends React.Component {
  render() {
    return (
     
      <RootStack.Navigator screenOptions={{ headerShown: false }} >
        <RootStack.Screen
          name="SplashScreen"
          component={SplashScreen}
          
        
        />
        <RootStack.Screen
          name="SigninScreen"
          component={SigninScreen}
        />
              <RootStack.Screen name={PhoneNumberVerification} component={CellPhoneNumber} />

        <RootStack.Screen name={VerifyCode} component={VerifyCodeScreen} />
        <RootStack.Screen
          name="SignupScreen"
          component={SignupScreen}
        />
        <RootStack.Screen name={NewPassword} component={NewPasswordScreen} />
        <RootStack.Screen name={ResetPassword} component={ResetPasswordScreen} />
        <RootStack.Screen name={ResetPasswordOTP} component={ResetPasswordOTPScreen} />
        <RootStack.Screen
          name="BusinessSignupScreen"
          component={BusinessSignupScreen}
        />
        <RootStack.Screen
          name="CompleteRegistration"
          component={CompleteRegistration}
        />

      </RootStack.Navigator>
    );
  }
}

export default RootStackScreen;
