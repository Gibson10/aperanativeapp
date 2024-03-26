/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-did-mount-set-state */
import React from 'react';
import {OPERATIVE} from '../utils/accountTypes'
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { Title, Avatar, Caption } from 'react-native-paper';

class DrawerHeader extends React.Component {
  
  render() {

    return (
      <>
        <View style={{  width: "100%", height: 150, alignItems:"center", justifyContent:"center", backgroundColor:this.props.currentUser.accountType===OPERATIVE?"#ff4c00":"#006dff" }}>
          <Avatar.Image
            source={
              this.props.currentUser.profilePhoto
                ? { uri: this.props.currentUser.profilePhoto }
                : require('../assets/profile.png')
            }
            size={50}
          />
          <View style={{ flexDirection: 'column' }}>
            <Title style={styles.title}>
              {`${this.props.currentUser.firstName} ${this.props.currentUser.lastName[0]}.`}
            </Title>
            <Caption style={styles.caption}>
              
            </Caption>
          </View>
        </View>
      </>
    );
  }
}

const mapStateToProps = ({ currentUser }) => {
  return {
    currentUser,
  };
};

export default connect(mapStateToProps)(DrawerHeader);

// Styling
const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color:"#ffffff"
  },
  caption: {
    fontSize: 8,
    lineHeight: 10,
  },
});
