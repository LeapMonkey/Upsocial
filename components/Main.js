import React, { useEffect, useState } from "react";
import { StyleSheet, View, StatusBar, Image, Text, Dimensions, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import ProfileManage from "./pages/ProfileManage";
import Dashboard from "./pages/Dashboard";

const Main = (props) => {
    const [isAuth, setIsAuth] = useState(false);
    useEffect(() => {
        if (localStorage.getItem("isUser")) {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
    }, [props]);
    return (
        <View style={styles.container}>
            <StatusBar />
            {isAuth ? <ProfileManage /> : <Dashboard />}
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
    },
    loadingView: {
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        width: "100%",
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
