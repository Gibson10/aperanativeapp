/* eslint-disable react-native/no-inline-styles */
import React, { Component,useEffect,useState } from "react"
import {
	View,
	Text,
	Platform,
	StatusBar,
	Image,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
    ActivityIndicator,
	RefreshControl,
} from "react-native"
import Toast from 'react-native-root-toast'
import * as Animatable from "react-native-animatable"

import {
	AntDesign,
	Feather,
	FontAwesome,
	MaterialIcons,
} from "@expo/vector-icons"
import {getAllBusinessGigs} from '../services/api'
import { connect } from "react-redux"
import SearchBar from "../components/SearchBar"

import CreatedGigsCard from "./cards/CreatedGigsCard"
const CreatedGigs = (props) => {
    const [gigs,setGigs]=useState([])
    const [loading,setLoading]=useState(true)
    const [modalOpen,setModalOpen]=useState(false)
	const [refreshing,setRefreshing]=useState(false)
	const [noResults,setNoResults]=useState(false)

	onRefresh = async () => {
		// setRefreshing(true)
		const gigs=await getAllBusinessGigs(props.currentUser._id)
		setGigs(gigs)
		// setRefreshing(false)
	}
    useEffect(async() => {
     const gigs=await getAllBusinessGigs(props.currentUser._id)
     console.log(gigs)
     setGigs(gigs)
	 setNoResults(true)
     setLoading(false)
    }, [])

	const setLoadingIndicator = () => {
		setLoading(!loading)
	}

    return(
        <View style={styles.container}>
            		<View>
						<SearchBar
						navigation={props.navigation}
						componentText='All Gigs'
						{...props}
					/>
			
					</View>
                    {
				loading?
				<ActivityIndicator size="small" color="#0000ff" />:<View></View>
			}
			
                    <ScrollView
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>}
					>
                        {gigs.map(gig=>(
    
                                <CreatedGigsCard key={gig._id} gig={gig} {...props} onRefreshPage={()=>onRefresh()} setLoadingIndicator={setLoadingIndicator}/>
                            
                        ))}


{
						noResults && gigs.length<1?
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






const mapStateToProps = ({ currentUser, login }) => {
	return {
		currentUser,
		login,
	}
}

export default connect(mapStateToProps)(CreatedGigs)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f4f4f4",
	},
	header: {
		flex: 1,
		justifyContent: "flex-start",
		paddingHorizontal: 20,
		marginTop: 120,
		flexDirection: "row",
		alignItems: "center",
  },
  headRow:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent: "space-between",
    width: "70%"
  },
	footer: {
		// flex: 1,
		backgroundColor: "#f4f4f4",
    paddingHorizontal: 20,
    marginTop: 20,
    paddingBottom: 10,
    paddingTop: 10
	},
	close: {
		alignItems: "flex-end",
		width: "100%",
		paddingRight: 20,
		paddingTop: 40,
	},
	text_header: {
		color: "#000000",
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 20,
		marginLeft: "38%",
	},
	text_footer: {
		color: "#05375a",
		fontSize: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#5c5c5c'
  },

  listItem: {
    flexDirection:"row",
    alignItems:"center",
    padding: 2,
  },
  listItemText: {
    color: "#5c5c5c",
    fontSize: 12
  }
	
})
