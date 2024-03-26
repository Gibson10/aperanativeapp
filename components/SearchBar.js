/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TextInput,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import {LinearGradient} from "expo-linear-gradient"
import {connect} from 'react-redux';
import {withBadge} from 'react-native-elements';
import ToggleSwitch from "react-native-switch-toggle"
import { MaterialIcons } from '@expo/vector-icons'; 
import BackButton from './buttons/BackButton';
import {Ionicons} from '@expo/vector-icons';
import Animated,{Easing} from 'react-native-reanimated';
import PushNotification from './PushNotifications';

const {Value,timing} = Animated;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
      keyword: '',
    };

    this.inputRef = React.createRef();

    this._input_box_translate_x = new Value(width);
    this._back_button_opacity = new Value(0);
    this._content_translate_y = new Value(height);
    this._content_opacity = new Value(0);
  }

  _onFocus = () => {
    this.setState({isFocused: true});

    const input_box_translate_x_config = {
      duration: 200,
      toValue: 0,
      easing: Easing.inOut(Easing.ease),
    };
    const back_button_opacity_config = {
      duration: 200,
      toValue: 1,
      easing: Easing.inOut(Easing.ease),
    };
    const content_translate_y_config = {
      duration: 0,
      toValue: 0,
      easing: Easing.inOut(Easing.ease),
    };
    const content_opacity_config = {
      duration: 200,
      toValue: 1,
      easing: Easing.inOut(Easing.ease),
    };

    timing(
      this._input_box_translate_x,
      input_box_translate_x_config,
    ).start();
    timing(
      this._back_button_opacity,
      back_button_opacity_config,
    ).start();
    timing(
      this._content_translate_y,
      content_translate_y_config,
    ).start();
    timing(this._content_opacity,content_opacity_config).start();

    this.inputRef.current.focus();
  };

  _onBlur = () => {
    this.setState({isFocused: false});

    const input_box_translate_x_config = {
      duration: 200,
      toValue: width,
      easing: Easing.inOut(Easing.ease),
    };
    const back_button_opacity_config = {
      duration: 50,
      toValue: 0,
      easing: Easing.inOut(Easing.ease),
    };
    const content_translate_y_config = {
      duration: 0,
      toValue: height,
      easing: Easing.inOut(Easing.ease),
    };
    const content_opacity_config = {
      duration: 200,
      toValue: 0,
      easing: Easing.inOut(Easing.ease),
    };

    timing(
      this._input_box_translate_x,
      input_box_translate_x_config,
    ).start();
    timing(
      this._back_button_opacity,
      back_button_opacity_config,
    ).start();
    timing(
      this._content_translate_y,
      content_translate_y_config,
    ).start();
    timing(this._content_opacity,content_opacity_config).start();

    this.inputRef.current.blur();
  };

  render() {


    return (
      <>
        <SafeAreaView style={styles.header_safe_area}>
          <View style={styles.header}>
            <View style={styles.header_inner}>
              <View
                style={{

                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center'
                }}
              >
                <View style={{marginLeft: 5}}>
                  {/* <Ionicons
                    name="ios-arrow-back"
                    size={25}
                    backgroundColor="#009387"
                    onPress={() => this.props.navigation.goBack()}
                  /> */}
                  {
                    this.props.showBack?
                    <MaterialIcons name="arrow-back-ios" size={24} color="black"  onPress={() => this.props.navigation.goBack()}/>:
                    <></>
                  }
                  {/* <BackButton {...this.props}/> */}

                </View>
                <View>
                  {/* <Ionicons
                    name="ios-menu"
                    size={25}
                    backgroundColor="#009387"
                    onPress={() => this.props.navigation.openDrawer()}
                  /> */}
                  {
                    !this.props.backarrow?
                    <TouchableOpacity style={styles.container}
                    onPress={() => this.props.navigation.goBack()}>
                  <MaterialIcons name="arrow-back-ios" size={24} color="black" />
                  </TouchableOpacity >:<View></View>
                  }
                    
                </View>
                <View style={{paddingLeft: 10}}>
                  <Text style={{fontSize: 22,paddingLeft: 15}}>
                    {this.props.componentText}
                  </Text>
                </View>
              </View>
              <View style={{marginRight: 14}}>
                {
                  this.props.updateProfile ? 
                    <TouchableOpacity
                      style={{width: "auto"}}
                      onPress={() => this.props.profileUpdate()}
                    >
                      <LinearGradient
                        colors={["#ffffff","#ffffff"]}
                        style={[styles.signIn,{height: 40}]}
                      >
                        <Text
                          style={[
                            styles.textSign,
                            {
                              color: "#ff4c00",
                              marginTop: 10,
                              paddingLeft: 40,
                              paddingRight: 30,
                              fontWeight: "bold"
                            },
                          ]}
                        >
                          Save
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity> 
                  : <View></View>
                } 

                {/* {
              this.props.notification?
              <PushNotification {...this.props}/>
              :
              <View>
              </View>
              } */}


              </View>
              <Animated.View
                style={[
                  styles.input_box,
                  {
                    transform: [
                      {translateX: this._input_box_translate_x},
                    ],
                  },
                ]}
              >

                <TextInput
                  ref={this.inputRef}
                  placeholder="Search"
                  clearButtonMode="always"
                  value={this.state.keyword}
                  onChangeText={(value) =>
                    this.setState({keyword: value})
                  }
                  style={styles.input}
                />
              </Animated.View>
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const mapStateToProps = ({currentUser}) => {
  return {
    currentUser,
  };
};

export default connect(mapStateToProps)(SearchBar);

// Styling
const styles = StyleSheet.create({
  header_safe_area: {
    zIndex: 1000,
    backgroundColor: '#ffffff'
  },
  header: {
    height: 50,
    paddingTop: 10,
    marginTop: 20,
    paddingHorizontal: 3,
    backgroundColor: '#ffffff'
  },
  header_inner: {
    flex: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  header_inner_inner: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  search_icon_box: {
    marginRight: 10,
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: '#e4e6eb',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input_box: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'white',
    width: width - 32,
  },
  back_icon_box: {
    width: 40,
    height: 40,
    borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#e4e6eb',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  content: {
    width: width,
    height: height,
    position: 'absolute',
    left: 0,
    bottom: 0,
    zIndex: 999,
  },
  content_safe_area: {
    flex: 1,
    backgroundColor: 'white',
  },
  content_inner: {
    flex: 1,
    paddingTop: 50,
  },
  separator: {
    marginTop: 5,
    height: 1,
    backgroundColor: '#e6e4eb',
  },
  image_placeholder_container: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: '-50%',
  },
  image_placeholder: {
    marginBottom: 10,
    alignSelf: 'center',
  },
  image_placeholder_text: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 5,
  },
  search_item: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e4eb',
    marginLeft: 16,
  },
  item_icon: {
    marginLeft: 15,
  },
});
