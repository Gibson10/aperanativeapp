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
	ScrollView,
	Linking,
	ActivityIndicator
} from "react-native"
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons"
import SearchBar from "../components/SearchBar"
import { getOperativesGigs } from "../services/api"
import QRCodeGenerator from "./QRcodegenerator"
import Loader from "../components/Loader"
import { connect } from "react-redux"
import ShiftCard from "./cards/ShiftCard"
import BackButton from "../components/buttons/BackButton"
Feather.loadFont()
FontAwesome.loadFont()

class CurrentGig extends Component {
	constructor(props) {
		super()
		this.state = {
			gigs: [],
			currentGig: null,
			loading: true,
			showNoresult:false,
			currentGigs:true,
			currentGigColor:'#0074EF',
			currentGigTextColor:'#ffffff',
			previousGigColor:'#ffffff',
			previousGigTextColor:'#000000',

		}

		this.onRefresh = async () => {
			this.setState({ refreshing: true })
			const allGigs = await getOperativesGigs(this.props.currentUser._id)

			this.setState({
				gigs: allGigs ? allGigs : [],
				isLoaded: true,
				refreshing: false,
				currentGig: allGigs[0]?.acceptedStatus ? allGigs[0] : null,
			})
		}
	}

	updatePreviousGig=()=>{
		this.setState({currentGigs:false,previousGigColor:'#0074EF',currentGigColor:'#ffffff',currentColor:'#0074EF',previousGigTextColor:'#ffffff',currentGigTextColor:'#000000'})
	}



	updateCurrentGig=()=>{
		this.setState({currentGigs:true,previousGigColor:'#ffffff',currentGigColor:'#0074EF',previousGigTextColor:'#000000',currentGigTextColor:'#ffffff'})
	}

	async componentDidMount() {
		const allGigs = await getOperativesGigs(this.props.currentUser._id)

		this.setState({
			gigs: allGigs ? allGigs : [],
			loading: false,
			showNoresult:true,
		})
	}

	render() {
		return (
			<View style={styles.container}>
				
				<View>
				{/* <BackButton {...this.props}/> */}
					<SearchBar
						navigation={this.props.navigation}
						componentText='Current Gig'
						{...this.props}
						backarrow={true}
						showBack={true}
					/>
				
				</View>

				{/* <Loader loading={this.state.visible} /> */}
			<View style={{flexDirection:'row',justifyContent:'space-between'}}>
					<View style={[styles.button,{backgroundColor: this.state.currentGigColor}]}>
				<TouchableOpacity
					onPress={()=>this.updateCurrentGig()}
				>
					<Text style={[styles.textSign,{color:this.state.currentGigTextColor}]}>New Gigs</Text>
				</TouchableOpacity>
			</View>
			<View style={[styles.button,{backgroundColor: this.state.previousGigColor}]}>
				<TouchableOpacity
				onPress={()=>this.updatePreviousGig()}
				>
					<Text style={[styles.textSign,{color:this.state.previousGigTextColor}]}>Previous Gigs</Text>
				</TouchableOpacity>
			</View>
			</View>
			{
				this.state.loading?
				<ActivityIndicator size="small" color="#0000ff" />:<View></View>
			}
			
				<ScrollView
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this.onRefresh}
						/>
					}
				>
					  {this.state.currentGigs ?
						<View>
							{this.state.gigs.map((item,index) =>
								!item.paid && !item.rejectedSatus? (
									<View
										key={item._id}
										style={styles.detailscard}
									>
										<Text style={styles.cardTitle}>
											Please make sure to arrive 10
											minutes before clocking in
										</Text>
										<View style={styles.cardContent}>
											<View style={styles.gigDetails}>
												<Text style={styles.title}>
													{item.gigName}
												</Text>
												<View style={styles.rating}>
													<Text
														style={
															styles.ratingTitle
														}
													>
														Rate 4.0
													</Text>
													<View></View>
												</View>
												<View style={styles.timeWidget}>
													<View style={{flexDirection:'row'}}>
														<Text style={[styles.timeText,{color:'#455A64'}]}> Start time {" "}</Text>
													<Text
														style={[styles.timeText,{color:'#AAA4BE'}]}
													>
														
														{item.startTime}
													</Text>
													</View>
													<View style={{flexDirection:'row'}}>
													<Text style={[styles.timeText,{color:'#455A64'}]}> End time {" "}</Text>

													<Text
														style={[styles.timeText,{color:'#AAA4BE'}]}
													>
											
														{item.endTime}
													</Text>
													</View>


												</View>
												<TouchableOpacity
												   onPress={Platform.OS==='ios'?() => Linking.openURL(`maps://app?daddr=${item.location.lat}+${item.location.lng}`):
												   () => Linking.openURL(`google.navigation:q=${item.location.lat}+${item.location.lng}`)
												}

												>
													<View style={styles.mapBtn}>

													<FontAwesome
															name='map'
															color='#ffffff'
															size={20}
															style={{marginRight:10}}
														/>
														<Text
															style={
																[styles.timeText,{color:'#fff'}]
															}
														>
															Open Map
														</Text>

													</View>
												</TouchableOpacity>
											</View>
											<View>
												<Text style={styles.qrTitle}>
													Show QR-Code
												</Text>
												<QRCodeGenerator
													gigId={item._id}
													gigStatus={item.gigStatus}
												/>
											</View>
										</View>
									</View>
								) : (
									<View key={index+2}></View>
								)
							)}
						</View>:
						<View>
						{/* {this.state.gigs.length > 0? (
							<Text style={styles.titleP}>Previous Gigs</Text>
						) : (
							<View></View>
						)} */}

						{this.state.gigs.map((item,index) =>
							item.paid ? (
								<ShiftCard key={index+5 +"index"} gig={item} />
							) : (
								<View key={index+1}></View>
							)
						)}
					</View>
						}

                         

						
					 {
						this.state.showNoresult && this.state.gigs.length<1?
						<View style={{flexDirection: "column",
						marginTop: 20,
						marginBottom: 20,
						justifyContent: "center",
						alignItems: "center",}}>
							<Image source={require("../assets/notfound.png")}></Image>
							<Text style={{paddingTop:10,marginTop:10}}>No results </Text> 
							</View>
							:
							<View></View>

					 }
						
					
	
					
				</ScrollView>
			</View>
		)
	}
}

const mapStateToProps = ({ currentUser, login }) => {
	return {
		currentUser,
		login,
	}
}

export default connect(mapStateToProps)(CurrentGig)
// Styling
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f4f4f4",
	},
	detailscard: {
		backgroundColor: "#ffffff",
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
		color: "#3E548D",
		fontSize: 12,
		marginBottom: 20,
		fontWeight:'500',
		fontFamily: "Poppins_500Medium",
	},
	cardContent: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	title: {
		fontSize: 16,
		fontWeight:'500',
		color:'#3E548D',
		fontFamily: "Poppins_700Bold",
	},
	qrTitle: {
		fontSize: 12,
		color:'#3E548D',
		marginBottom:10,
		fontFamily: "Poppins_500Medium",

	},
	rating: {
		flexDirection: "row",
		marginBottom: 15,
	},
	ratingTitle: {
		fontSize: 13,
		marginRight: 15,
		fontWeight:'500',
		color:'#B9B5C4',
		fontFamily: "Poppins_500Medium",

	},
	timeText: {
		fontSize: 14,
		fontWeight: "bold",
		marginRight: 10,
	},
	mapBtn: {
		backgroundColor: "#0074EF",
		padding: 10,
		marginTop: 15,
		// width:"70%",
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 10,
	},
	titleP: {
		fontSize: 24,
		textAlign: "center",
		fontWeight: "bold",
	},
	notFoundParent: {
		marginTop: 300,
		alignItems: "center",
		justifyContent: "center",
	},
	notFound: {
		fontSize: 24,
		fontWeight: "bold",
	},
	button: {
		marginTop: 20,
		margin: 10,
		width: "45%",
		padding: 6,
		// backgroundColor: "#ffffff", 
		borderRadius: 10,
	},
	textSign: {
		// color: "#000000",
		fontWeight: "bold",
		fontSize: 16,
		width: "100%",
		textAlign: "center",
		padding: 10,
	},
})
