import React from 'react'
import { SafeAreaView, View, StyleSheet, Platform, StatusBar } from 'react-native'

export default function SafeAreaWrapper(props) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerSpacing}>
                {
                    props.children
                }
            </View>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6F8FA",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0

    },

    containerSpacing: {
        height: "100%",
        marginHorizontal: 10,
        paddingTop: 30
    }
})


