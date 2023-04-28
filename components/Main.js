import React, { useState } from "react";
import { StyleSheet, View, StatusBar, Image, Text, Dimensions, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import ProfileManage from "./pages/ProfileManage";
import Dashboard from "./pages/Dashboard";

const Main = (props) => {
    return (
        <View style={styles.container}>
            <StatusBar />
            {props.auth.isAuthenticated ? <ProfileManage /> : <Dashboard />}
            {props.loading.loading && (
                <View style={styles.loadingView}>
                    <Image
                        source={require("../assets/loading.gif")}
                        style={{ width: 140, height: 140 }}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
        maxWidth: 400,
        marginLeft: "50%",
        transform: [{ translateX: "-50%" }]
    },
    loadingView: {
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        width: 400,
        height: Dimensions.get('window').height,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
    }
});

const mapStateToProps = (state) => ({
    auth: state.auth,
    loading: state.loading
});

export default connect(mapStateToProps, {})(Main);
