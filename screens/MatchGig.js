/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react"
import {
	View,
	Text,
	Platform,
	StatusBar,
	Image,
	TextInput,
	StyleSheet,
	RefreshControl,
	TouchableOpacity,
	ActivityIndicator,
	ScrollView,
} from "react-native"
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons"
import SearchBar from "../components/SearchBar"
import { getBusinessGigs } from "../services/api"
import QRCodeGenerator from "./QRcodegenerator"
import Loader from "../components/Loader"
import { connect } from "react-redux"
import ShiftCard from "./cards/ShiftCard"
// import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { Button, Menu, Divider, Provider } from 'react-native-paper';

import { Entypo } from '@expo/vector-icons';
import { color } from "react-native-reanimated"
import {timeDifference} from "../components/convert"
import GigWorkerCard from "./cards/GigWorkerCard"
import OperativeModal from "../components/OperativeModal"
import PaymentModal from "../components/PaymentModal"
import BackButton from "../components/buttons/BackButton"

Feather.loadFont()
FontAwesome.loadFont()

class MatchedGigs extends Component {
	constructor(props) {
		super()
		this.state = {
			gigs: [],
			currentGig: null,
			operativeModal: false,
			loading:true,
			showNoGig:false,
			visible: false,
			paymentModal:false,
			currentGigColor:'#DFDFDF',
			paidWorkerColor:'#ffffff',
			currentGigs:true,
			selectedGig:null,
			hoursWorked:0,
			timeWorked:''
		}

		this.onRefresh = async () => {
			this.setState({ refreshing: true })
			const allGigs = await getBusinessGigs(this.props.currentUser._id)
			this.setState({
				gigs: allGigs ? allGigs : [],
				isLoaded: true,
				refreshing: false,
			})
		}
	}
	 selectGig=(gig)=>{
		this.setState({selectedGig:gig})
	}
	 
	 updatePaidWorker=()=>{
		this.setState({currentGigs:false,paidWorkerColor:'#DFDFDF',currentGigColor:'#ffffff'})
	}



	updateCurrentGig=()=>{
		this.setState({currentGigs:true,paidWorkerColor:'#ffffff',currentGigColor:'#DFDFDF'})
	}
	 
	 
	 hideMenu = () => this.setState({visible: false});

	 showMenu = () => this.setState({visible: true});

	openGigModal(currentGig) {
		this.setState({ operativeModal: true, currentGig: currentGig })
	}
    setPaymentModal=(gig)=> {
		// console.log("setPaymentModal",gig)
		console.log("setPaymentModal",timeDifference(gig.clockOut,gig.clockIn))
		const {hours,time}=timeDifference(gig.clockOut,gig.clockIn)
		console.log("hours and time",hours,time)
		this.setState({hoursWorked:hours,paymentModal:true,selectedGig:gig,timeWorked:time})
	}
	closePaymentModal=()=> {
		this.setState({paymentModal:false})
	}
	makePayment=(worker)=>{
		console.log("worker",worker)
		// console.log(timeDifference(worker.endTime,worker.startTime))
		this.hideMenu()
		this.setState({ operativeModal: false })
		this.props.navigation.navigate('AcceptPayments',{gigworker:worker})
	}
	clockin = async (gig) => {
		this.hideMenu()
		this.props.navigation.navigate(
			"ScanBarcode",{gig:gig,status:"clockin"}
		)
	}
	clockout = async (gig) => {
		this.hideMenu()
		this.props.navigation.navigate(
			"ScanBarcode",{gig:gig,status:"clockout"}
		)
	}

	closeGigModal() {
		this.setState({ operativeModal: false })
	}
	async componentDidMount() {
		const allGigs = await getBusinessGigs(this.props.currentUser._id)
		// console.log("allGigs",allGigs)

		this.setState({ gigs: allGigs, loading: false ,showNoGig:true})
	}

	render() {
		//  const {operative}=this.state.currentGig
		// console.log("hours worked",this.state.hoursWorked)
		return (
			<View style={styles.container}>
			{/* <Loader loading={this.state.loading}/> */}

				<ScrollView
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this.onRefresh}
						/>
					}
				>
					<View>
						{/* <SearchBar
							navigation={this.props.navigation}
							componentText='Gig Workers'
						/> */}
						<SearchBar
						navigation={this.props.navigation}
						componentText='Current Gig'
						{...this.props}
					/>
						{/* <BackButton {...this.props}/> */}
					</View>
			<View style={{flexDirection:'row',justifyContent:'space-between'}}>
					<View style={[styles.button,{backgroundColor: this.state.currentGigColor}]}>
				<TouchableOpacity
					onPress={()=>this.updateCurrentGig()}
				>
					<Text style={styles.textSign}>Current Gig</Text>
				</TouchableOpacity>
			</View>
			<View style={[styles.button,{backgroundColor: this.state.paidWorkerColor}]}>
				<TouchableOpacity
				onPress={()=>this.updatePaidWorker()}
				>
					<Text style={styles.textSign}>Paid Workers</Text>
				</TouchableOpacity>
			</View>
			</View>
			{
				this.state.loading?
				<ActivityIndicator size="small" color="#0000ff" />:<View></View>
			}
			

			{this.state.currentGigs ?
			
			       <View>
					{this.state.gigs.map((item,index) =>
					    // console.log("item",item),
						!item.paid && !item.rejectedSatus ? (
							<View key={item._id} style={styles.detailscard}>

								<View style={styles.cardHeader}>
								 <Text style={styles.cardTitle}>
									Please scan gig worker QR-Code before they
									start
								 </Text>
							    
								 {/* <Menu
									visible={this.state.visible}
									anchor={<TouchableOpacity onPress={()=>this.setPaymentModal(item)} ><Entypo style={{paddingBottom:15}} name="dots-three-horizontal" size={24} color="black" /></TouchableOpacity>}
									onRequestClose={this.hideMenu}
								>

								</Menu> */}
								{
									item.clockOut?
									<MaterialIcons onPress={()=>this.setPaymentModal(item)} style={{paddingBottom:15}} name="payment" size={24} color="black" />:<View></View>

								}
						
															</View>

								<View style={styles.cardContent}>
									<View style={styles.gigDetails}>
										<View style={styles.titleRow}>
											<TouchableOpacity
												onPress={() =>
													this.openGigModal(item)
												}
											>
												<Text
													style={[
														styles.title,
														{
															color: "#006dff",
															fontSize: 16,
															textDecorationStyle:
																"solid",
															textDecorationStyle:
																"solid",
															textDecorationColor:
																"#006dff",
															textDecorationLine:
																"underline",
														},
													]}
												>
													{item.operativesInGigs[0].firstName}
									
												</Text>
											</TouchableOpacity>
											{/* <View style={styles.rating}> */}
											<Text style={styles.ratingTitle}>
												Rating 
											</Text>
											{/* </View> */}
											<View style={styles.starBar}>
												<FontAwesome
													name='star'
													color='#000000'
													size={12}
												/>
												<FontAwesome
													name='star'
													color='#000000'
													size={12}
												/>
												<FontAwesome
													name='star'
													color='#000000'
													size={12}
												/>
												<FontAwesome
													name='star'
													color='#000000'
													size={12}
												/>
												<FontAwesome
													name='star'
													color='#000000'
													size={12}
												/>
											</View>
										</View>
										<Text style={styles.specialText}>
										{item.gigName}
										</Text>
										<View style={styles.timeWidget}>
											<Text style={styles.timeText}>
												Start time > {item.startTime}
											</Text>
											<Text style={styles.timeText}>
												End time > {item.endTime}
											</Text>
										</View>
										{
											item.clockOut?
										<TouchableOpacity onPress={()=>this.setPaymentModal(item)}  style={styles.menu}>
										<MaterialIcons name="payment" size={40} color="black" />
										</TouchableOpacity> :
												<TouchableOpacity
															onPress={() =>
																	this.props.navigation.navigate(
																		"BarcodeScreen",item.clockIn?{
																			status:"clockout"
																				}:{
																					status:"clockin"
																						}
																					)
																				}
																			>
															<Text style={styles.showBtn}>
																	Scan QR-Code{" "}{item.clockIn?<Text style={styles.showBtn}>(Clock Out)</Text>:<Text style={styles.showBtn}>(Clock In)</Text>}
															</Text>
												</TouchableOpacity>
										}

										{/* <TouchableOpacity style={styles.showBtn}>
										<MaterialIcons name="payment" size={40} color="black" />
										</TouchableOpacity> */}

									</View>
								</View>
							</View>
						) : (
							<View
							key={index+1}
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							></View>
						)
					)}
			</View> : <View>
			{this.state.gigs.map((item,index) =>
						item.gigStatus === "Completed" ? (
							<GigWorkerCard key={index+8 + 'index'} gig={item} />
						) : (
							<View key={index+9}></View>
						)
					)}
			</View>
			}
				 {
				 this.state.showNoGig  && this.state.gigs.length<1? 
				 <View style={{flexDirection: "column",
				 marginTop: 20,
				 marginBottom: 20,
				 justifyContent: "center",
				 alignItems: "center",}}>
					 <Image source={require("../assets/notfound.png")}></Image>
					 <Text style={{paddingTop:10,marginTop:10}}>No results </Text> 
					 </View>:<View></View>}

					{/* {this.state.gigs.length > 0 ? (
						<Text style={styles.titleP}>Previous Gigs Workers</Text>
					) : (
						<View></View>
					)} */}

					{/* {this.state.gigs.map((item,index) =>
						item.gigStatus === "Completed" ? (
							<GigWorkerCard key={index+2 + 'index'} gig={item} />
						) : (
							<View key={index+3}></View>
						)
					)} */}
					<OperativeModal
						visible={this.state.operativeModal}
						closeModal={() => this.closeGigModal()}
						operative={
							this.state.currentGig
								?this.state.currentGig.operativesInGigs[0]
								: {}
						}
						currentGig={this.state.currentGig?this.state.currentGig:{}}
					/>
				   
				</ScrollView>
				<PaymentModal visible={this.state.paymentModal} worker={this.state.selectedGig} closeModal={this.closePaymentModal} hoursWorked={this.state.hoursWorked}timeWorked={this.state.timeWorked}/>
			</View>
		)
	}
}

function mapStateToProps({ status, currentUser }) {
	return {
		status,
		currentUser,
	}
}
export default connect(mapStateToProps)(MatchedGigs)
// Styling
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f4f4f4",
	},
	detailscard: {
		backgroundColor: "#e5e5e5",
		borderRadius: 10,
		margin: 20,
		shadowColor: "#000",
		shadowOffset: { width: 1, height: 20 },
		shadowOpacity: 0.1,
		padding: 15,
	},
	profileImage: {
		width: 52,
		height: 52,
		borderRadius: 100,
		overflow: "hidden",
		margin: 15,
	},
	image: {
		flex: 1,
		height: undefined,
		width: undefined,
		backgroundColor: "gray",
	},
	details: {
		marginTop: 15,
		marginRight: 15,
	},
	cardTitle: {
		color: "#727272",
		fontSize: 12,
		marginBottom: 20,
	},
	cardContent: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	title: {
		fontSize: 16,
		fontWeight: "bold",
	},
	qrTitle: {
		fontSize: 12,
	},
	rating: {
		flexDirection: "row",
		marginBottom: 15,
	},
	ratingTitle: {
		fontSize: 10,
		marginRight: 15,
	},
	timeText: {
		fontSize: 12,
		fontWeight: "bold",
		marginRight: 10,
	},
	mapBtn: {
		backgroundColor: "#ffffff",
		padding: 5,
		marginTop: 15,
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 10,
	},
	titleP: {
		fontSize: 24,
		textAlign: "center",
		fontWeight: "bold",
	},
	titleRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "90%",
	},
	timeWidget: {
		alignItems: "center",
		width: "100%",
	},
	starBar: {
		flexDirection: "row",
	},
	specialText: {
		fontSize: 12,
		fontWeight: "bold",
		marginTop: 15,
		marginBottom: 15,
		textAlign: "center",
	},
	showBtn: {
		textAlign: "center",
		fontWeight: "bold",
		marginTop: 15,
		marginBottom: 15,
		fontSize: 24,
		color: "#006dff",
		textDecorationStyle: "solid",
		textDecorationColor: "#006dff",
		textDecorationLine: "underline",
	},
	cardHeader:{
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	menu:{
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",	
	},
	button: {
		marginTop: 20,
		margin: 10,
		width: "45%",
		// backgroundColor: "#ffffff", 
		borderRadius: 10,
	},
	textSign: {
		color: "#000000",
		fontWeight: "bold",
		fontSize: 16,
		width: "100%",
		textAlign: "center",
		padding: 10,
	},
})
