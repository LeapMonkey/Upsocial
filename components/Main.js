import React, { useState } from "react";
import { StyleSheet, View, Text, StatusBar } from "react-native";
import Login from "./Auth/Login";
import Onboarding from "./pages/Onboarding";

const Main = () => {
    const [routeflag, setRouteflag] = useState("onboarding");

    const setflag = (flag) => {
        setRouteflag(flag);
    }

    return (
        <View style={styles.container}>
            <StatusBar />
            {routeflag === "onboarding" ? (<Onboarding setflag={setflag} />) : routeflag === "register" ? (<Login setflag={setflag} />) : (null)}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Main;