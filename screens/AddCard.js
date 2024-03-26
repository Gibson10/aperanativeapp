/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react"
import { render } from "react-dom";
import {
	View,
	Text,
	Platform,
	StatusBar,
	TextInput,
	StyleSheet,
	TouchableOpacity,
    ScrollView,
} from "react-native"
import Toast from 'react-native-root-toast'
import { createCard } from "../services/api"
import Loader from "../components/Loader";
import SearchBar from "../components/SearchBar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native";
import { CardField, CardFieldInput, useStripe } from "@stripe/stripe-react-native"
import { connect } from "react-redux";


class AddCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardNumber: "",
            cardExpMonth: "",
            cardExpYear: "",
            cardCVC: "",
            cardName: "",
            country: "",
            postal_code: "",
            errorMessage: { status: false, message: "", success: false },
        };
		this.textInputChange = (event, name) => {
			const { text } = event.nativeEvent
			this.setState({
				[name]: text,
			})
        }
        console.log(this.textInputChange);
        this.addCard = async () => {
            const {
                cardNumber,
                cardExpMonth,
                cardExpYear,
                cardCVC,
                cardName,
                country,
                postal_code
            } = this.state;

            if (
                cardNumber.trim() &&
                cardExpMonth.trim() &&
                cardExpYear.trim() &&
                cardCVC.trim() &&
                cardName.trim() &&
                country.trim() &&
                postal_code.trim()
            ) {
                this.setState({ loading: true })
                const data = {
                    cardNumber: cardNumber,
                    cardExpMonth: cardExpMonth,
                    cardExpYear: cardExpYear,
                    cardCVC: cardCVC,
                    cardName: cardName,
                    country: country,
                    postal_code: postal_code
                }

                const addCard = await createCard(
                    this.props.currentUser._id,
                    data
                )

                if (addCard) {
                    Toast.show(addCard.message, Toast.SHORT)
                    const Token = {
                        userToken: addCard.access_token,
                    }
                    this.props.dispatch(setUser(addCard.user, Token))
                    this.setState({ loading: false })
                } else {
                    this.setState({ loading: false })
                }
            } else {
                Toast.show("All fields are required", Toast.SHORT)
            }
        }

        this.handleValidUser = (val) => {
            if (val.trim().length >= 4) {
                this.setState({
                    isValidUser: true
                })
            } else {
                this.setstate({
                    isValidUser: false
                })
            }
        }
    }

    async componentDidMount() {

        // this.setstate({
        //     cardNumber: this.props.currentUser.cardNumber,
        //     cardExpMonth: this.props.currentUser.cardExpMonth,
        //     cardExpYear: this.props.currentUser.cardExpYear,
        //     cardCVC: this.props.currentUser.cardCVC,
        //     cardName: this.props.currentUser.cardName,
        //     country: this.props.currentUser.country,
        //     postal_code: this.props.currentUser.postal_code
        // })
    }

    render() {
        const { errorMessage } = this.state;
            return (
        <SafeAreaView style={styles.container}>
            {/* <Loader loading={this.state.loading} /> */}
            <View>
                <SearchBar
                    navigation={this.props.navigation}
                    componentText='Add card'
                    notification={true}
                />
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='always'
            >
                {errorMessage.status ? (
                    <Text style={errorMessage.success ? styles.successMsg : styles.errorMsg}>
                        {this.state.errorMessage.message}
                    </Text>
                ) : (
                    <Text style={styles.errorMsg}></Text>
                )}
                 <TextInput
                    name='cardNumber'
                    value={this.state.cardNumber}
                    placeholder='3333 3333 3333 3333'
                    style={styles.textInput}
                    autoCapitalize='none'
                    onChange={(event) =>
                        this.textInputChange(event, "cardNumber")
                    }
                />
                <TextInput
                    name='cardName'
                    value={this.state.cardName}
                    placeholder='MICHEAL DARALOLA'
                    style={styles.textInput}
                    autoCapitalize='none'
                    onChange={(event) =>
                        this.textInputChange(event, "cardName")
                    }
                />
                <TextInput
                    name='Country'
                    value={this.state.country}
                    placeholder='Type in your country'
                    style={styles.textInput}
                    autoCapitalize='none'
                    onChange={(event) =>
                        this.textInputChange(event, "country")
                    }
                />
                
                <View style={styles.address}>
                    <View style={(styles.action, { width: "49%" })}>
                        <TextInput
                            name='Date'
                            placeholder='03/23'
                            value={this.state.firstName}
                            style={styles.textInput}
                            autoCapitalize='none'
                            onChange={(event) =>
                                this.textInputChange(event, "firstName")
                            }
                        />
                    </View>
                    <View style={(styles.action, { width: "49%" })}>
                        <TextInput
                            name='cvv'
                            value={this.state.lastName}
                            placeholder='CVV'
                            style={styles.textInput}
                            autoCapitalize='none'
                            onChange={(event) =>
                                this.textInputChange(event, "lastName")
                            }
                        />
                    </View>
                </View>
                
                <View style={styles.button}>
                    <TouchableOpacity
                        style={{ width: "100%" }}
                        onPress={() => this.addCard()}
                    >
                        <LinearGradient
                            colors={["#ffffff", "#ffffff"]}
                            style={styles.signIn}
                        >
                            <Text
                                style={[
                                    styles.textSign,
                                    { color: "#006dff" },
                                ]}
                            >
                                Add card
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View> 
            </ScrollView>
        </SafeAreaView>
    )
    };
}

// render() {
//     const { errorMessage } = this.state
//     return (
//         <SafeAreaView style={styles.container}>
//             {/* <Loader loading={this.state.loading} /> */}
//             <View>
//                 <SearchBar
//                     navigation={this.props.navigation}
//                     componentText='Add card'
//                     notification={true}
//                 />
//             </View>
//             <ScrollView
//                 showsVerticalScrollIndicator={false}
//                 keyboardShouldPersistTaps='always'
//             >
//                 {errorMessage.status ? (
//                     <Text style={errorMessage.success ? styles.successMsg : styles.errorMsg}>
//                         {errorMessage.message}
//                     </Text>
//                 ) : (
//                     <Text style={styles.errorMsg}></Text>
//                 )}
//                 <TextInput
//                     name='cardNumber'
//                     value={this.state.cardNumber}
//                     placeholder='3333 3333 3333 3333'
//                     style={styles.textInput}
//                     autoCapitalize='none'
//                     onChange={(event) =>
//                         this.textInputChange(event, "cardNumber")
//                     }
//                 />
//                 <TextInput
//                     name='cardName'
//                     value={this.state.cardName}
//                     placeholder='MICHEAL DARALOLA'
//                     style={styles.textInput}
//                     autoCapitalize='none'
//                     onChange={(event) =>
//                         this.textInputChange(event, "cardName")
//                     }
//                 />
//                 <TextInput
//                     name='Country'
//                     value={this.state.country}
//                     placeholder='Type in your country'
//                     style={styles.textInput}
//                     autoCapitalize='none'
//                     onChange={(event) =>
//                         this.textInputChange(event, "country")
//                     }
//                 />
                
//                 <View style={styles.address}>
//                     <View style={(styles.action, { width: "49%" })}>
//                         <TextInput
//                             name='Date'
//                             placeholder='03/23'
//                             value={this.state.firstName}
//                             style={styles.textInput}
//                             autoCapitalize='none'
//                             onChange={(event) =>
//                                 this.textInputChange(event, "firstName")
//                             }
//                         />
//                     </View>
//                     <View style={(styles.action, { width: "49%" })}>
//                         <TextInput
//                             name='cvv'
//                             value={this.state.lastName}
//                             placeholder='CVV'
//                             style={styles.textInput}
//                             autoCapitalize='none'
//                             onChange={(event) =>
//                                 this.textInputChange(event, "lastName")
//                             }
//                         />
//                     </View>
//                 </View>
                
//                 <View style={styles.button}>
//                     <TouchableOpacity
//                         style={{ width: "100%" }}
//                         onPress={() => this.submitNewPassword()}
//                     >
//                         <LinearGradient
//                             colors={["#ffffff", "#ffffff"]}
//                             style={styles.signIn}
//                         >
//                             <Text
//                                 style={[
//                                     styles.textSign,
//                                     { color: "#006dff" },
//                                 ]}
//                             >
//                                 Change
//                                 </Text>
//                         </LinearGradient>
//                     </TouchableOpacity>
//                 </View>
//             </ScrollView>
//         </SafeAreaView>
//     )
// }






const mapStateToProps = ({ currentUser, login }) => {
    return {
        currentUser,
        login
    }
}

export default connect(mapStateToProps)(AddCard);



const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f4f4f4",
	},
	header: {
		flex: 1,
		justifyContent: "space-between",
		marginTop: 20,
		flexDirection: "row",
		alignItems: "center",
	},
	text_footer: {
		color: "#05375a",
		fontSize: 18,
	},
	parentSec: {
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 15,
	},
	coverImage: {
		width: "100%",
		height: 170,
		borderRadius: 20,
		overflow: "hidden",
		marginBottom: 30,
	},
	profileImage: {
		width: 83,
		height: 83,
		borderRadius: 100,
		overflow: "hidden",
		marginTop: -170,
	},
	image: {
		flex: 1,
		height: undefined,
		width: undefined,
		backgroundColor: "gray",
	},
	cvrimage: {
		flex: 1,
		height: "100%",
		width: "100%",
		backgroundColor: "red",
	},
	text_header: {
		color: "#000000",
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 16,
		// marginLeft: '22%'
	},
	button: {
		alignItems: "center",
		marginTop: 50,
		marginBottom: 20,
	},
	buttonSubmit: {
		// alignItems: "center",
		marginBottom: 20,
	},
    signIn: {
		width: "100%",
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
	},
	signInSubmit: {
		width: "100%",
		height: 40,
		borderRadius: 10,
		flexDirection: "row",
		alignItems: "center",
		paddingLeft: 10,
	},
    textSign: {
		fontSize: 12,
		fontWeight: "bold",
	},
	textInput: {
		flex: 1,
		marginTop: Platform.OS === "ios" ? 0 : -12,
		padding: 10,
		color: "#05375a",
		backgroundColor: '#ffffff',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#000000",
		marginBottom: 30,
		shadowColor: "#000",
		shadowOffset: { width: 1, height: 5 },
		shadowOpacity: 0.1,
	},
	errorMsg: {
		color: "#FF0000",
		fontSize: 14,
	},
	address: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 15
	},
	title: {
		fontSize: 16,
		marginBottom: 15,
	},
	errorMsg: {
		color: "red",
		padding: 0,
		textAlign: "center",
	},
	successMsg: {
		color: "green",
		padding: 10,
		textAlign: "center",
	},
})



// });

