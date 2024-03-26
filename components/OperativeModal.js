import React, { Component } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";

import GigWorker from '../screens/GigWorker';

class OperativeModal extends Component {
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
    const {visible,operative,currentGig}=this.props
    // console.log("notification currentGig",currentGig)
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
         
            
             <GigWorker operative={operative} currentGig={currentGig} closeModal={()=>this.setModalInvisible()}/>
        
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

export default OperativeModal;