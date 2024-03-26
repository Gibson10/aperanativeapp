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
  Alert,
} from "react-native"
import Toast from 'react-native-root-toast'
import * as Animatable from "react-native-animatable"
import { OPERATIVE, BUSINESS } from "../../utils/accountTypes"
import GigDetails from "../../components/gigDetails"
import EditGigModal from "../../components/EditGigModal"
import {
	AntDesign,
	Feather,
	FontAwesome,
	MaterialIcons,
  Entypo
} from "@expo/vector-icons"
import {deleteGigById} from '../../services/api'
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from "react-redux"

const CreatedGigsCard = (props) => {
  const [modalOpen,setModalOpen]=useState(false)
  const [editModalOpen,setEditModalOpen]=useState(false)

  const openEditModal=()=>{
    setEditModalOpen(true)
  }
  const createTwoButtonAlert = (gigName,id) =>
  Alert.alert('Delete Gig', `Are you sure you would like to delete the gig ${gigName}`, [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    { text: 'OK', onPress: () =>deleteGig(id) },
  ]);


  const deleteGig=async(id)=>{
    props.setLoadingIndicator()
   const deletedGig=await deleteGigById(id)
   console.log("the gig we deleted",deletedGig)
   if (deletedGig){
      Toast.show('Gig deleted successfully', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
      props.setLoadingIndicator()
      props.onRefreshPage()
      
   }
  }
  const closeEditModal=()=>{
    setEditModalOpen(false)
  }

  const openModal=()=>{
      setModalOpen(true)
  }

  const closeModal=()=>{
      setModalOpen(false)
  }

    useEffect(() => {
    }, [])

    return(
        <View style={styles.footer}>
        <ScrollView showsVerticalScrollIndicator={false}>
<View style={styles.headRow}>
  <TouchableOpacity onPress={()=>openModal()}><Text numberOfLines={1}   
                    ellipsizeMode="tail" style={[styles.title,{maxWidth: 130}]}>{props.gig.gigName} </Text></TouchableOpacity>
  <Text style={styles.listItemText}>{props.gig.startTime} - {props.gig.endTime}</Text>
   <Text style={styles.listItemText}>{props.gig.shiftDate} </Text>
</View>

  <View style={styles.listItem}>
    <Text style={styles.listItemText}>description: </Text>
    <Text style={([styles.listItemText], {fontWeight:"bold"})}>{props.gig.gigDescription}</Text>
  </View>
  
  <View style={styles.listItem}>
    <Text style={styles.listItemText}>Status: </Text>
    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'80%'}}>
    <Text style={[styles.listItemText,{color:props.gig.gigStatus==='Completed'?'#50C878':'#FF0000'}]}>{props.gig.gigStatus}</Text>
    <TouchableOpacity style={styles.close} onPress={()=>createTwoButtonAlert(props.gig.gigName,props.gig._id)}>
    <AntDesign name="delete" size={18} color="red" />
    </TouchableOpacity>
    <TouchableOpacity  onPress={openEditModal}>
      <Entypo name="edit" size={18} color="black" />
  

    </TouchableOpacity>
    </View>
  </View>

        </ScrollView>

        <GigDetails visible={modalOpen} gig={props.gig} closeModal={()=>closeModal()} {...props}/>
        <EditGigModal visible={editModalOpen} gig={props.gig} closeModal={()=>closeEditModal()} {...props}/>
    </View>
    )
}





export default CreatedGigsCard

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
    width: "100%"
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
		width: "75%",
		paddingRight: 20,
		// paddingTop: 40,
	},
  delete: {
		alignItems: "flex-end",
		width: "75%",
		paddingRight: 20,
		// paddingTop: 40,
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
    // color: '#5c5c5c',
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
