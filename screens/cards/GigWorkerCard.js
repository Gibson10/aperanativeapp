/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet,ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
class GigWorkerCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
   const {gig}=this.props
    return (
      <View style={styles.footer}>
              <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.headRow}>
        <Text style={styles.title}>{gig.operative.firstName} </Text>
        <Text style={styles.listItemText}>{gig.startTime}  - {gig.endTime}</Text>
         {/* <Text style={styles.listItemText}>{gig.shiftDate} </Text> */}
      </View>
      
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>Job: </Text>
          <Text style={([styles.listItemText], {fontWeight:"bold"})}>{gig.gigName}</Text>
        </View>
        
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>Status: </Text>
          <Text style={styles.listItemText}>{gig.gigStatus}</Text>
        </View>

              </ScrollView>
          </View>
    );
  }
}


export default GigWorkerCard;

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
  headRow:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent: "space-between",
    width: "70%"
  },
	footer: {
		// flex: 1,
		backgroundColor: "#f4f4f4",
    paddingHorizontal: 20,
    marginTop: 20,
    paddingBottom: 10,
    paddingTop: 10
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
    fontSize: 16,
    fontWeight: "bold",
    color: '#5c5c5c'
  },

  listItem: {
    flexDirection:"row",
    alignItems:"center",
    padding: 2,
  },
  listItemText: {
    color: "#5c5c5c",
    fontSize: 12
  }
	
})
