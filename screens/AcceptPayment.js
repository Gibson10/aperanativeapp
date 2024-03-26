import React, { Component,useState,useEffect } from "react"
import {
	Button,
	View,
	TouchableOpacity,
	StyleSheet,
	Platform,
	Text,
    Alert
    
} from "react-native"
import Constants from 'expo-constants';
import { LinearGradient } from "expo-linear-gradient"
import {updateGigStatusPaid} from '../services/api'
import { StripeProvider } from '@stripe/stripe-react-native';
import SearchBar from "../components/SearchBar";
import {createPaymentIntent} from '../services/api'
import { CardField, useStripe } from '@stripe/stripe-react-native';



 const  AcceptPayment= (props) =>{
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [worker, setWorker] = useState({});
    const [price, setPrice] = useState('');
  
    const fetchPaymentSheetParams = async () => {
      
      const response= await createPaymentIntent({amount:price})
      console.log(response)

      const { paymentIntent, ephemeralKey, customer} = await response;
  
      return {
        paymentIntent,
        ephemeralKey,
        customer,
      };
    };
  
    const initializePaymentSheet = async () => {
      const {
        paymentIntent,
        ephemeralKey,
        customer,
        publishableKey,
      } = await fetchPaymentSheetParams();
  
      const { error } = await initPaymentSheet({
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
        //methods that complete payment after a delay, like SEPA Debit and Sofort.
        allowsDelayedPaymentMethods: true,
      });
      if (!error) {
        setLoading(true);
      }
    };
  
    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
      await updateGigStatusPaid()
    }
      // see below
    };
  
    useEffect(() => {
      const paymentWorker=props.route.params.gigworker
      console.log("paymentworker",paymentWorker)
      setWorker(paymentWorker.operative)
      setPrice(paymentWorker.hourWage)
      
      initializePaymentSheet();
    }, [props.route.params.gigworker]);
  
    return (

    <StripeProvider
      publishableKey="pk_test_cyjA1Gl3I90ZDao81IfUCByU00Nl2WOQsv"
      // "pk_test_todZ1qCEWSZTkHmMwHTBBhlV"
      //            "pk_test_cyjA1Gl3I90ZDao81IfUCByU00Nl2WOQsv"
      // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      // merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
    >
  
    
    <View>
        	<View>
					<SearchBar
						navigation={props.navigation}
						componentText='Make Payment'
						notification={true}
					/>
				</View>
      <View style={styles.worker}>
        <Text style={styles.paymentText}> You are about to pay ${price?price:""} to {worker.firstName?worker.firstName:""}  {worker.lastName?worker.lastName:""} for completion of all duties </Text>
        </View>  
    <View style={styles.button}>
    <TouchableOpacity
        style={{ width: "100%" }}
        onPress={() =>
            openPaymentSheet()
        }
    >
        <LinearGradient
            colors={["#ff4c00", "#ff4c00"]}
            style={styles.signIn}
        >
            <Text
                style={[styles.textSign, { color: "#ffffff" }]}
            >
                Make Payment
            </Text>
        </LinearGradient>
    </TouchableOpacity>
</View>
</View>
</StripeProvider>
    );
  }


export default AcceptPayment;

const styles = StyleSheet.create({
	btn: {
		paddingLeft: 10,
		color: "#000000",
		justifyContent: "center",
	},
	button: {
		padding:15,
		alignItems: "center",
		marginTop: 50,
	},
	WebView: {
		flex: 1,
		marginTop: Constants.statusBarHeight,
	},
	signIn: {
		width: "100%",
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
	},
  worker:{
    marginTop:10,
  },
  paymentText:{
    fontSize:20,
    alignContent:"center",
    justifyContent:"center",
    textAlign:"center",
  }
})