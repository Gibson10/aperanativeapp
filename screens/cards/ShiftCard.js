/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet,ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';

class ShiftCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};


  }

  render() {
  const {gig}=this.props
    return (
      		<View key={gig._id} style={styles.footer}>
					<ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>{gig.gigName} </Text>
            <View style={styles.shiftList}>
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>Status</Text>
                <Text style={styles.listItemStatus}>{gig.gigStatus?gig.gigStatus:'Pending'}</Text>
              </View>
              <View>
                <Text style={styles.listItemText}>Start Time</Text>
                <Text style={styles.listItemText}>{gig.startTime}</Text>
              </View>
              <View>
                <Text style={styles.listItemText}>End Time</Text>
                <Text style={styles.listItemText}>{gig.endTime}</Text>
              </View>
            </View>
            <View style={styles.shiftList}>
            <View style={styles.listItem}>
                <Text style={styles.listItemText}>Location</Text>
                <Text style={styles.listItemLocation}>Location</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>Paid</Text>
                <Text style={styles.listItemPaid}>$30</Text>
              </View>
              <View style={styles.listItem}>

            </View>
            </View>

					</ScrollView>
				</View>
    );
  }
}

function mapStateToProps({ currentUser }) {
  return {
    currentUser: currentUser,
  };
}
export default connect(mapStateToProps)(ShiftCard);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f4f4f4",
	},
	header: {
		flex: 1,
		justifyContent: "flex-start",
		paddingHorizontal: 20,
		marginTop: 120,
		flexDirection: "row",
		alignItems: "center",
	},
	footer: {
		// flex: 1,
		backgroundColor: "#ffffff",
		// borderTopLeftRadius: 30,
    padding:10,
    borderRadius:10,
    margin:10,
		// borderTopRightRadius: 30,
    paddingHorizontal: 20,
    marginTop: 20
	},
	close: {
		alignItems: "flex-end",
		width: "100%",
		paddingRight: 20,
		paddingTop: 40,
	},
	text_header: {
		color: "#000000",
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 20,
		marginLeft: "38%",
	},
	text_footer: {
		color: "#05375a",
		fontSize: 18,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    color: '#5c5c5c'
  },
  shiftList: {
    borderColor: '#c4c4c4',
    // borderBottomWidth: 1,
    // marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  listItem: {
    marginBottom: 15,
    padding: 2,
  },
  listItemText: {
    color: "#5c5c5c",
    fontSize: 12
  },
  listItemStatus: {
    color: "#0EAD1E",
    fontSize: 14,
    fontFamily:'Poppins_700Bold'
  },
  listItemLocation: {
    // color: "#0EAD1E",
    fontSize: 15,
    fontFamily:'Poppins_700Bold',
    fontFamily:'Poppins_700Bold'


  },
  listItemPaid: {
    color: "#FF4000",
    fontSize: 14,
    fontFamily:'Poppins_700Bold'
  }
	
})
