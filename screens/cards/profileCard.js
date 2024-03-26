/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';

class ProfileCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.editShippingAddress = () => {
      this.props.navigation.navigate('Profile');
    };

    this.editShippingAddress.bind(this);
  }

  render() {
    return (
      <Card>
        <View style={styles.ordersCard}>
          <View style={styles.status}>
            <Text style={{ paddingLeft: 10 }}>
              {' '}
              {this.props.text}
            </Text>

            <Image
              source={require('../../assets/nextIcon.png')}
              style={{ width: 50, height: 50 }}
            />
          </View>
        </View>
      </Card>
    );
  }
}

function mapStateToProps({ currentUser }) {
  return {
    currentUser: currentUser,
  };
}
export default connect(mapStateToProps)(ProfileCard);

const styles = StyleSheet.create({
  shippingDetails: {
    fontSize: 14,
    padding: 10,
    fontWeight: 'bold',
  },

  shippingAddress: {
    fontSize: 14,
    paddingTop: 5,
    paddingLeft: 10,
    // fontWeight: '600',
  },
  editIcon: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  ordersCard: {
    paddingBottom: 5,
    paddingTop: 5,
  },
  productname: {
    paddingLeft: 10,
    marginRight: 7,
    color: 'green',
  },
  productprice: {
    color: 'green',
  },
  productInfo: {
    display: 'flex',
    alignContent: 'center',
    flexDirection: 'row',
  },
  status: {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  totalAmount: {
    marginTop: 5,
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    color: 'green',
  },
  orderSummary: {
    paddingLeft: 7,
  },
});
