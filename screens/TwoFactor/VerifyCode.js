
import React, {useState} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
// import CustomTextInput from '../Components/CustomInput';
// import {} from '../Apis/Utils/strings'
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from "react-redux";

import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
  } from 'react-native-confirmation-code-field';
  import {setUser} from '../redux/actions/User'
  import {confirmUser} from '../../services/api'
  const STORAGE_KEY='userToken'
  export const VerifyCode = (props) => {
 const CELL_COUNT = 5;
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
    const [validationComplete, setValidationComplete] = useState(true);
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [prop, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
 
  

  const setNewValue=async(value)=>{

    setValue(value)
  if (value.length === CELL_COUNT) {
      const tagcode={
            code:value
      }
      
      const verifiedCode= await confirmUser(tagcode)

    if (verifiedCode.user){

    await AsyncStorage.setItem(STORAGE_KEY, verifiedCode.access_token);

    const Token = {
        userToken: verifiedCode.access_token,
    }
    console.log()
      props.dispatch(setUser(verifiedCode.user, Token));
      }else{
            setValidationComplete(false)
            setErrorMessage(verifiedCode.error)
      }
    }else{

    }
  }
5166401408
    return (
        <View style={styles.root}>
            {/* <BackButton {...props}/> */}
            <View style={styles.container}>
                <Text style={styles.title}>Enter verfication code  </Text>
                <Text style={styles.subText}>Enter code below</Text>
                {!validationComplete? <Text style={styles.error}>{errorMessage}</Text>:<View></View>}
                <CodeField
                    ref={ref}
                    {...props}
                    // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                    value={value}
                    onChangeText={setNewValue}
                    cellCount={CELL_COUNT}
                    rootStyle={styles.codeFieldRoot}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    renderCell={({index, symbol, isFocused}) => (
                    <Text
                        key={index}
                        style={[styles.cell, isFocused && styles.focusCell]}
                        onLayout={getCellOnLayoutHandler(index)}>
                        {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                    )}
                />
                <Text style={styles.infoText}>You should have recieved a text with a verification code. Message and data rates may apply.</Text>
                <TouchableOpacity><Text style={styles.infoTextUnderline}>Learn what happens when your number changes.</Text></TouchableOpacity>
                <LinearGradient start={{ x: -1, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#0074ef','#0074ef']}
                    style={styles.btn}>
                        <TouchableOpacity >
                            <Text style={styles.btnText}>Continue</Text>
                        </TouchableOpacity>               
                </LinearGradient> 
            </View>
        </View>
    )
}



const mapStateToProps = ({ currentUser }) => {
    return {
      currentUser,
    };
  };
  
  export default connect(mapStateToProps)(VerifyCode);

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F2F2F2',
        width: '100%',
        paddingTop: 50,
        paddingHorizontal: 20
    },
    container: {
      flex: 1,
      backgroundColor: '#F2F2F2',
      width: '100%',
      justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        marginBottom: 40
    },
    subText: {
        fontSize: 14,
        textAlign: 'center',
    },
    btn: {
        zIndex: 1,
        padding: 15,
        borderRadius: 20,
        display: 'flex',
        justifyContent:'center',
        alignItems: 'center',
        marginVertical: '10%'
    },
    btnText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 18
    },
    codeFieldRoot: {marginTop: 20},
    cell: {
        width: 50,
        height: 50,
        // borderRadius: 15,
        fontSize: 24,
        paddingTop:10,
        borderWidth: 0.5,
        borderColor: '#45D036',
        textAlign: 'center',
        textAlignVertical: 'center',
        backgroundColor: '#ffffff',
        marginRight: 5
    },
    focusCell: {
        borderColor: '#000',
    },
    infoText: {
        fontSize: 14,
        marginTop: 20,
        marginHorizontal: 20
    },
    infoTextUnderline: {
        fontSize: 14,
        marginBottom: 30,
        marginHorizontal: 20,
        textDecorationLine: 'underline'
    },
    error:{
        fontSize: 14,
        color: 'red',
    }
  });