/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import {
  View,
  Text,
  Platform,
  StatusBar,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Picker,
  ActivityIndicator,
} from "react-native";

import Toast from 'react-native-root-toast';
import { specialities } from "../utils/data";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { changePassword } from "../services/api";
import Loader from "../components/Loader";
import { updateOperativeSkills } from "../services/api";
import { setUser } from "../screens/redux/actions/User";
import MultiSelect from "react-native-multiple-select";
import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { AuthContext } from "../components/context";
import SearchBar from "../components/SearchBar";
import { connect } from "react-redux";

Feather.loadFont();
FontAwesome.loadFont();
class MySpeciality extends Component {
  constructor(props) {
    super();
    this.state = {
      selectedItems: [],
      loading: false,
      errorMessage: { status: false, message: "" },
    };

    this.onSelectedItemsChange = (selectedItems) => {
      this.setState({ selectedItems });
    };

    this.removePrefferedSkills = (item) => {
      const { selectedItems } = this.state;
      var index = selectedItems.indexOf(item);
      if (index > -1) {
        selectedItems.splice(index, 1);
      }
      this.setState({
        selectedItems: selectedItems,
      });
      this.updateSkills()
    };
    this.updateSkills = async () => {
      const { selectedItems } = this.state;

      if (selectedItems.length > 0) {
        this.setState({
          loading: true,
          errorMessage: {
            status: false,
            message: "",
          },
        });
        const user = {
          preferredSkills: selectedItems,
        };
        const newSkills = await updateOperativeSkills(
          this.props.currentUser._id,
          user
        );
        if (newSkills) {
          Toast.show("Update Successful", Toast.SHORT);
          const Token = {
            userToken: newSkills.access_token,
          };
          this.props.dispatch(setUser(newSkills.user, Token));
          this.setState({
            loading: false,
          });
        } else {
          this.setState({
            loading: false,
          });
        }
      } else {
        console.log("GIBSON");
        this.setState({
          errorMessage: {
            status: true,
            message: "Please select atleast one speciality",
            success: true,
          },
        });
      }
    };
  }

  componentDidMount() {
    //console.log("selectedItems", this.props.currentUser)
    this.setState({ selectedItems: this.props.currentUser.preferredSkills });
  }

  render() {
    return (
      <View style={styles.container}>

        <View>
          <SearchBar
            navigation={this.props.navigation}
            componentText="Back"
          />
        </View>
        <View style={styles.footer}>
        <Text style={styles.mySpecialtiesHeader}>My  Specialities</Text>

        <MultiSelect
          // styleMainWrapper={{height:70}}
          hideTags
          items={specialities}
          uniqueKey="id"
          ref={(component) => { this.multiSelect = component }}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={this.state.selectedItems}
          styleListContainer={{height: 230}}
          styleInputGroup={{borderColor:'#0074EF',borderTopEndRadius:10}}
          selectText="  Select Multiple Specialties"
          searchInputPlaceholderText="Search Items..."
          // textInputProps={ {style:{}} }
          selectedItemIconColor="#0074EF"
          onChangeInput={ (text)=> console.log("TEXT",text)}
          tagRemoveIconColor="#CCC"
          tagBorderColor="##0074EF"
          tagTextColor="#CCC"
          selectedItemTextColor="#0074EF"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: '#CCC' ,borderColor:'#0074EF',height:50}}
          submitButtonColor="#CCC"
          submitButtonText="Hide Select"
        />
          <ScrollView
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps='always'
					>
            <Text style={styles.title}> Selected Specialities</Text>
            {/* <View style={styles.divider}></View> */}
            {this.state.errorMessage.status ? (
              <Text style={styles.errorMsg}>
                {this.state.errorMessage.message}
              </Text>
            ) : (
              <Text style={styles.errorMsg}></Text>
            )}

            <View style={styles.selectedCards}>
              {this.state.selectedItems.map((items) => (

                <TouchableOpacity onPress={() => this.removePrefferedSkills(items)} style={styles.cards} key={items}>
                  <Text style={styles.cardText}>{items}</Text>
                  <TouchableOpacity
                    onPress={() => this.removePrefferedSkills(items)}
                  >
                    <MaterialIcons name="cancel" size={15} color="#ff4c00" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.button}>
              <TouchableOpacity
                style={{ width: "100%" }}
                onPress={() => this.updateSkills()}
              >
                <LinearGradient
                  colors={["#0074EF", "#0074EF"]}
                  style={styles.signIn}
                >

                  									<View style={{flexDirection:'row',justifyContent:'center',alignContent:'center'}}>
									<Text
										style={[
											styles.textSign,
											{ color: "#ffffff",paddingTop:3 },
										]}
									>
										Submit
									</Text>
									{
										this.state.loading?
										<ActivityIndicator style={{paddingLeft:10}} size="small" color="#0000ff" />:<View></View>
									}
									
									</View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            </ScrollView>
          {/* </ScrollView> */}
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ currentUser, login }) => {
  return {
    currentUser,
    login,
  };
};

export default connect(mapStateToProps)(MySpeciality);
// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  footer: {
    flex: 7,
    // backgroundColor: "#f6f8fa",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  close: {
    alignItems: "flex-end",
    width: "100%",
    paddingRight: 20,
    paddingTop: 40,
  },
  mySpecialtiesHeader: {
		fontSize:24,
		fontWeight:'bold',
		marginBottom:10,
    textAlign: "center",
		fontFamily:'Poppins_700Bold',

	},
  text_header: {
    color: "#000000",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: "22%",
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    padding: 10,
    color: "#05375a",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000000",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 0.1,
  },
  errorMsg: {
    color: "red",
    fontSize: 14,
  },

  button: {
    alignItems: "center",
    marginTop: '70%',
    marginBottom: 20,
  },
  signIn: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 12,
    fontWeight: "bold",
  },
  picker: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000000",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 0.1,
    paddingTop: 10,
    height: 50,
  },
  title: {
    fontSize: 16,
    marginTop: 20
  },
  divider: {
    borderColor: "#000000",
    borderTopWidth: 1,
    marginTop: 15,
    marginBottom: 15,
  },
  selectedCards: {
    width: "100%",
    flexWrap: "wrap",
    flexDirection: "row",
    backgroundColor: "#ddeafa",
  },
  cards: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius:5,
    margin: 7,
    marginHorizontal: 10,
    width: "auto",
  },
  cardText: {
    fontSize: 12,
    marginRight: 10,
  },
});
