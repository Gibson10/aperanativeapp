import React, { Component,useState,useEffect } from "react"
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TouchableOpacity,
} from "react-native";
import Constants from 'expo-constants';
import {updateGigStatusPaid} from '../services/api'
import { LinearGradient } from "expo-linear-gradient"
import {
	AntDesign,
	Feather,
	FontAwesome,
	MaterialIcons,
} from "@expo/vector-icons"
import { StripeProvider } from '@stripe/stripe-react-native';
import SearchBar from "../components/SearchBar";
import {createPaymentIntent} from '../services/api'
import { CardField, useStripe } from '@stripe/stripe-react-native';


const  PaymentModal =(props) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [worker, setWorker] = useState({});
  const [price, setPrice] = useState(0);
  const [hoursWorked, setHoursWorked] = useState(0);
  const [timeWorked, setTimeWorked] = useState(0);
  const [showPayment, setShowPayment] = useState(false);

  const fetchPaymentSheetParams = async (amount) => {
    
    const response= await createPaymentIntent({amount:amount})
    console.log(response)

    const { paymentIntent, ephemeralKey, customer} = await response;

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async (amount,stripeId) => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
      publishableKey,
    } = await fetchPaymentSheetParams({amount:amount*100,stripeId:stripeId});

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
    });
    if(paymentIntent){
      setShowPayment(true)
    }
    if (!error) {
      setLoading(true);
      setShowPayment(true);
    }
  };

  const openPaymentSheet = async () => {
      const { error } = await presentPaymentSheet();

  if (error) {
    Alert.alert(`Error code: ${error.code}`, error.message);
  } else {

    Alert.alert('Success', `The payment was made successfully to ${worker.firstName} ${worker.lastName} !`);
    updateGigStatusPaid(props.worker._id,{status:true})
    props.closeModal()
  }
  };

  useEffect(() => {
    const paymentWorker=props.worker
    console.log("paymentworker",paymentWorker)
    if (paymentWorker) {
      setWorker(paymentWorker.operative)
      setHoursWorked(props.hoursWorked)
      setTimeWorked(props.timeWorked)
      setPrice(paymentWorker.hourWage)
      const amountToPay=(props.hoursWorked * paymentWorker.hourWage)
      const finalAmountToPay=(amountToPay*1.1)
      initializePaymentSheet(parseInt(finalAmountToPay),paymentWorker.operative.stripeExpressAccount)
    }

    
 
  }, [props.worker]);

      

    const {visible,gig}=props
    return (
      <View >
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
              <StripeProvider
      publishableKey="pk_test_cyjA1Gl3I90ZDao81IfUCByU00Nl2WOQsv"
      // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      // merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
    >
          <View style={styles.centeredView}>
          <View style={styles.close}>
					<TouchableOpacity
						 onPress={() => props.closeModal()}
					>
						<MaterialIcons name='clear' color='#000000' size={20} />
					</TouchableOpacity>
				</View>

          <View style={styles.hoursWorked}>
          <Text style={styles.modalText}>Total hours worked today was </Text>
          <Text style={styles.hoursWorkedColor}>{timeWorked}</Text>
         </View>
         <View  style={styles.hoursWorked}>
         <Text style={styles.modalText}> Amount to pay </Text>
          <Text style={styles.modalText}> $ {(props.hoursWorked * price).toFixed(0) }</Text>
         </View>
         <View style={styles.paymentButton}>   
         <View style={styles.button}>
           {
             showPayment ? 
             <TouchableOpacity
             onPress={() => openPaymentSheet()}
           >
             <Text style={styles.textSign}>Confirm Payment</Text>
           </TouchableOpacity>:
           <View></View>
           }

			</View>
         </View>
          </View>
          </StripeProvider>
        </Modal>

      </View>
    );
  // }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
   //  justifyContent: "center",
   //  alignItems: "center",
    marginTop: 50,
    // marginBottom: "20%",
    // height: "50%",
    borderTopLeftRadius:20,
	 borderTopRightRadius:20,
    backgroundColor:'#E5E5E5'

  },
  hoursWorked:{
    flexDirection:'row',
    justifyContent:'space-between',
    color:'#000000',
    fontWeight:'bold',
    paddingRight:40,
    paddingLeft:40,
    paddingTop:50,
  },
  modalText:{
    // fontSize:20,
    fontWeight:'bold',
  },
  hoursWorkedColor:{
    fontWeight:'bold',
    color:'#228B22',
  },
  button: {
		marginTop: 20,
		width: "80%",
		backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
		borderRadius: 10,
	},
  close: {
		alignItems: "flex-end",
		width: "100%",
		paddingRight: 20,
		paddingTop: 40,
	},
  textSign: {
		color: "#000000",
		fontWeight: "bold",
		fontSize: 16,
		width: "100%",
		textAlign: "center",
		padding: 10,
	},
  paymentButton:{
    alignItems:'center',
    justifyContent:'center',

  }
});

export default PaymentModal;