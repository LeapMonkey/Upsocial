import React, { useState } from "react";
import { StyleSheet, View, Text, StatusBar } from "react-native";
import SignUP from "./Auth/SignUp";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Home from "./pages/Home";

const Main = () => {
    const [routeflag, setRouteflag] = useState("onboarding");

    const setflag = (flag) => {
        setRouteflag(flag);
    }

    return (
        <View style={styles.container}>
            <StatusBar />
            {routeflag === "onboarding" && <Onboarding setflag={setflag} />}
            {routeflag === "SignUp" && <SignUP setflag={setflag} />}
            {routeflag === "profile" && <Profile setflag={setflag} />}
            {routeflag === "home" && <Home />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Main;