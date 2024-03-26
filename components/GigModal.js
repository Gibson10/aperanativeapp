import React, { Component } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";

import BusinessProfile from '../screens/BusinessProfile';

class GigModal extends Component {
  state = {
    modalVisible: false
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }
  setModalInvisible=()=>{
  this.props.closeModal()
   
  }

  render() {
    const { modalVisible } = this.state;
    const {visible,gig}=this.props
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
          <View style={styles.centeredView}>
         
            
             <BusinessProfile 
             {...this.props} gig={gig} closeModal={()=>this.setModalInvisible()}/>
        
          </View>
     
        </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
   //  justifyContent: "center",
   //  alignItems: "center",
    marginTop: 100,
    borderTopLeftRadius:20,
	 borderTopRightRadius:20,
    backgroundColor:'#ffffff'
  },
});

export default GigModal;