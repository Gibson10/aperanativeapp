import React from 'react';
import{Image} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons"
import { connect } from "react-redux";
import { OPERATIVE, BUSINESS } from "../utils/accountTypes"
import AllGigsScreen from '../screens/AllGigs';
import ProfileScreen from '../screens/ProfileScreen';
import { Octicons } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import GigScreen from '../screens/GigScreen';
import CurrentGig from '../screens/CurrentGig'
import { FontAwesome5 } from '@expo/vector-icons'; 


Icon.loadFont();

const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const GigStack=createStackNavigator()
const CurrentStack=createStackNavigator()

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = (props) => (
  <Tab.Navigator initialRouteName="Home" activeColor="#0074ef"  barStyle={{ backgroundColor: '#ffff' }}>
    <Tab.Screen
      name="HomeScreen"
      component={HomeStackScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarColor: '#808080',
        tabBarIcon: ({ focused   }) => (
          // <Icon name="ios-home" color={focused?"#000000":"#808080"} size={26} />
        //  < HomeIcon/>
        // <Ionicons name="ios-home-outline" size={24} color="black" />
        // <Ionicons name="ios-home-outline" color={focused?"#0074ef":"#808080"} size={24}  />
          <Image source={require('../assets/icons2.0/Home.png')} style={{width: 26, height: 26, tintColor: focused?"#0074ef":"#808080"}} />
        ),
      }}
    />
   


    {props.currentUser.accountType === OPERATIVE ? (
     <Tab.Screen
      name="CurrentGigScreen"
      component={CurrentStackScreen}
      options={{
        tabBarLabel: 'Gig',
        tabBarColor: '#808080',
        tabBarIcon: ({ focused }) => (
          <Entypo
											name='box'
											size={20}
											color={focused?"#0074ef":"#808080"}
										/>
        ),
      }}
    />
    ):
    <Tab.Screen
    name="GigHomeScreen"
    component={GigStackScreen}
    options={{
      tabBarLabel: 'Gig',
      tabBarColor: '#808080',
      tabBarIcon: ({ focused }) => (
        <Entypo
                    name='box'
                    size={20}
                    color={focused?"#0074ef":"#808080"}
                  />
      ),
    }}
  />
    }

   <Tab.Screen
      name="Profile"
      component={ProfileStackScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarColor: '#808080',
        tabBarIcon: ({ focused }) => (
          // <Icon name="ios-person" color={focused?"#000000":"#808080"} size={26} />
          <FontAwesome5 name="user" color={focused?"#0074ef":"#808080"} size={24} />
        ),
      }}
    />
  </Tab.Navigator>
);



const HomeStackScreen = ({ navigation }) => (
  <HomeStack.Navigator
    screenOptions={{
      title: '',
      headerStyle: {
        backgroundColor: '#000000',
      },
      headerTintColor: '#000000',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <HomeStack.Screen
      name="Home"
      component={AllGigsScreen}
      options={{
        headerShown: false,
      }}
    />
       <HomeStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack.Screen
      name="GigHomeScreen"
      component={GigScreen}
      options={{
        headerShown: false,
      }}
    />
        <HomeStack.Screen
      name="CurrentScreen"
      component={CurrentGig}
      options={{
        headerShown: false,
      }}
    />
  </HomeStack.Navigator>
  
);



const ProfileStackScreen = ({ navigation }) => (
  <ProfileStack.Navigator
    screenOptions={{
      title: '',
      headerStyle: {
        backgroundColor: '#000000',
      },
      headerTintColor: '#000000',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
   
    <ProfileStack.Screen
      name="ProfileScreenTwo"
      component={ProfileScreen}
      options={{
        headerShown: false,
      }}
    />
  </ProfileStack.Navigator>
);

const GigStackScreen = ({ navigation }) => (
  <GigStack.Navigator
    screenOptions={{
      title: '',
      headerStyle: {
        backgroundColor: '#000000',
      },
      headerTintColor: '#000000',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
  
    <GigStack.Screen
      name="GigScreen"
      component={GigScreen}
      options={{
        headerShown: false,
      }}
    />
  </GigStack.Navigator>
);






const CurrentStackScreen = ({ navigation }) => (
  <CurrentStack.Navigator
    screenOptions={{
      title: '',
      headerStyle: {
        backgroundColor: '#000000',
      },
      headerTintColor: '#000000',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
 
    <CurrentStack.Screen
      name="CurrentGig"
      component={CurrentGig}
      options={{
        headerShown: false,
      }}
    />
  </CurrentStack.Navigator>
);


const mapStateToProps = ({ currentUser }) => {
  return {
    currentUser,
  };
};

export default connect(mapStateToProps)(MainTabScreen);
// export default MainTabScreen;