/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-did-mount-set-state */
import React from 'react';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import {connect} from 'react-redux';
import {View,StyleSheet,Text} from 'react-native';
import {updateNotificationStatus} from '../services/api'
import {Title,Avatar,Caption} from 'react-native-paper';
import {changeStatus} from '../screens/redux/actions/User'
import ToggleSwitch from "react-native-switch-toggle"
import { Switch } from 'react-native';


class PushNotification extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      token: '',
      status: true,
    }
  }

  async toggleSwitch(status) {

    if(this.state.token) {
      this.props.dispatch(
        changeStatus(
          this.props.currentUser.status === "online"
            ? "offline"
            : "online"
        )
      )
      const tokenDetails = {
        notificationStatus: !status,
        notificationToken: this.state.token
      }
      await updateNotificationStatus(this.props.currentUser._id,tokenDetails)
    } else {
      alert('Please allow notifications on settings in order to receive notifications');
    }

  }
  async registerForPushNotificationsAsync() {
    let token;
    if(Constants.isDevice) {
      const {status: existingStatus} = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if(existingStatus !== 'granted') {
        const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if(finalStatus !== 'granted') {
        // alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if(Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default',{
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0,250,250,250],
        lightColor: '#FF231F7C',
      });
    }
    this.setState({token: token})


    return token;
  }

  async componentDidMount() {
    const token = await this.registerForPushNotificationsAsync()
    console.log(token)
    if(token) {
      const tokenDetails = {
        notificationStatus: this.props.currentUser.status === "online"
          ? true
          : false,
        notificationToken: token
      }
      await updateNotificationStatus(this.props.currentUser._id,tokenDetails)
    } else {
      alert('Please allow notifications on settings in order to receive notifications');
    }


  }


  render() {
    return (
      <>
        <View style={{display: 'flex',flexDirection: 'row',justifyContent: 'space-between'}}>
          <Text style={{marginLeft:7,fontSize: 15, fontWeight: 'bold'}}>Notifications</Text>
          <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}

							value={
                     
								this.props.currentUser.status === "online"
									? true
									: false
							}
                             thumbColor={this.props.currentUser.status === "online" ? '#f5dd4b' : '#f4f3f4'}

							onValueChange={() =>
								this.toggleSwitch(
									this.props.currentUser.status === "online"
										? true
										: false
								)
							}
                                    ios_backgroundColor="#3e3e3e"

							// onColor='#34c759'
							// size='medium'
						/>
        </View>
      </>
    );
  }
}

const mapStateToProps = ({currentUser}) => {
  return {
    currentUser,
  };
};

export default connect(mapStateToProps)(PushNotification);

// Styling
const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 8,
    lineHeight: 10,
  },
});
