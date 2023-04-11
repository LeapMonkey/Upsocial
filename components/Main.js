import React, { useState } from "react";
import { StyleSheet, View, StatusBar } from "react-native";
import { connect } from "react-redux";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";

const Main = (props) => {
    return (
        <View style={styles.container}>
            <StatusBar />
            {props.auth.isAuthenticated ? <Profile /> : <Dashboard />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, {})(Main);
