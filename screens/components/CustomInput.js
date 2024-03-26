import React, { Component, } from 'react'
import { StyleSheet, Text, View, TextInput, CheckBox, TouchableOpacity,Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';



class CustomTextInput extends Component {
  constructor(props) {
		super()
    this.state = {
      secureTextEntry: true,
      isValidUser:true,
      errorMessage:''
    }
  }
   handleValidUser = (val,name) => {
		if (val.trim().length >= 3) {
			this.setState({
        isValidUser: true,
        errorMessage:''
			})
		} else {
			this.setState({
        isValidUser: false,
        errorMessage:'Input is required'
			})
    }
    if(name==='email'){
     if(!this.validateEmail(val)){
      this.setState({	
        isValidUser: false,	
				errorMessage: "Invalid email format"		
			})
			return null;
     }else{
      this.setState({	
        isValidUser: true,	
				errorMessage: ""		
      })
     }
    }
	}

  validateEmail = (email) => {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  
  }
  changeEyeIcon=()=>{
  var secureTextEntry=this.state.secureTextEntry
    this.setState({secureTextEntry:!secureTextEntry})

    }
   
  render() {
     
    const {name, value, placeholder, onChangeText, onEndEditing, secureTextEntry, showSecureEntry,textArea ,isNumeric} = this.props
    return ( 
       <>    
  
        <View style={styles.action}>
          <TextInput
            name= {name}
            placeholder={placeholder}
            secureTextEntry={name==="password"?this.state.secureTextEntry:false}
            style={styles.textInput}
            keyboardType = {isNumeric?'numeric':"default"}
            placeholderTextColor='grey'
            autoCapitalize='none'
            multiline={textArea}
            numberOfLines={textArea?4:1}
            onChange={(e)=>{onChangeText(e.nativeEvent.text,name),	this.handleValidUser(e.nativeEvent.text,name)}}

          />
          {
            showSecureEntry ? 
            <>
            {
              this.state.secureTextEntry ? <Ionicons name="md-eye-off" size={24} color="black" onPress={()=>this.changeEyeIcon()} /> :	<Ionicons name="md-eye" size={24} color="black" onPress={()=>this.changeEyeIcon()}/>
            }
            </>
            :
            <></>
          } 
         
                   
        </View>
        {

       !this.state.isValidUser?<Text style={styles.errorMsg}>{this.state.errorMessage}</Text>:<View></View>
       }    
     </>
    )
  }
}
export default CustomTextInput;

const styles = StyleSheet.create({
  action: {
		flexDirection: "row",
		marginTop: 20,
    padding: 5,
    paddingTop:10,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#ededed'
	},
	textInput: {
		flex: 1,
		marginTop: Platform.OS === "ios" ? 0 : -11,
		padding: 10,
		color: "#05375a",
  },
  errorMsg:{
		color:"red",
		padding: 10
	}
});