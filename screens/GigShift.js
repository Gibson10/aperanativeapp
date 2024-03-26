/* eslint-disable react-native/no-inline-styles */
import React,  {Component} from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	RefreshControl
} from "react-native"
import { getGigs } from "../services/api"
import {getBusinessGigs} from '../services/api'
import Loader from "../components/Loader"
import {
	Feather,
	FontAwesome,
} from "@expo/vector-icons"
import SearchBar from "../components/SearchBar"
import { connect } from "react-redux"

import ShiftCard from './cards/ShiftCard';

Feather.loadFont()
FontAwesome.loadFont()
class Gigshift extends Component {
	constructor(props) {
		super()
		this.state = {
			loading: true,
			gigs:[]
		}

		this.onRefresh = async () => {
			this.setState({ refreshing: true })
			const allGigs = await getGigs()

			this.setState({
				gigs: allGigs ? allGigs : [],
				isLoaded: true,
				refreshing: false,
			})
		}
	
  }

async componentDidMount() {
		const allGigs = await getBusinessGigs(this.props.currentUser._id)

		this.setState({ gigs: allGigs ? allGigs : [], loading: false })
	}

	render() {
		return (
			<View style={styles.container}>
				<Loader loading={this.state.loading} />

				<View>
					<SearchBar
						navigation={this.props.navigation}
						componentText='Gig Shift'
					/>
				</View>
				<ScrollView showsVerticalScrollIndicator={false} 
				refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this.onRefresh}
						/>
					}>
          {
			 this.state.gigs.map(item=>(
			 
			 <ShiftCard gig={item} />
			 ))
			 }
			</ScrollView>
			</View>
		)
	}
}


const mapStateToProps = ({ currentUser, login }) => {
	return {
		currentUser,
		login,
	}
}

export default connect(mapStateToProps)(Gigshift)


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
		marginTop: 120,
		flexDirection: "row",
		alignItems: "center",
	},
	footer: {
		flex: 1,
		backgroundColor: "#f4f4f4",
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
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
    borderBottomWidth: 1,
    marginTop: 15,
    marginBottom: 15,
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
  }
	
})
