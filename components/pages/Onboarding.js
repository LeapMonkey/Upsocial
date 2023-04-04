import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const Onboarding = (props) => {
    return (
        <View style={styles.container}>
            {/* <View style={styles.gifview}>
                <Image source={require("../../assets/ScrollTop.gif")} style={styles.gifstyle} />
            </View> */}
            <View style={styles.topBarContainer}>
                <Image
                    source={require("../../assets/logo.png")}
                    style={styles.topLogo}
                />
                <TouchableOpacity>
                    <Ionicons name="search" color="#000" size={30} style={styles.searchIcon} />
                </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1, zIndex: 1 }}>
                <Image
                    source={require("../../assets/videoBackground.png")}
                    style={styles.logoImage}
                />
                <LinearGradient colors={['#1e2452', '#1a1143']} style={styles.bottomsection}>
                    <TouchableOpacity style={styles.bottombtn} onPress={() => props.setflag("register")}>
                        <Text style={styles.bottombtntext}>Get Started</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topBarContainer: {
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        flexDirection: "row",
        justifyContent: "space-between",
        height: 40,
        alignItems: "center",
        zIndex: 2
    },
    topLogo: {
        height: 30,
        width: 120
    },
    logoImage: {
        width: "100%",
        height: Dimensions.get("window").height - 40
    },
    bottomsection: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    bottombtn: {
        width: "90%",
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#9c26b0",
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 100
    },
    bottombtntext: {
        color: "#fff",
        fontSize: 24,
        textTransform: "uppercase"
    },
    gifstyle: {
        width: 50,
        height: 50,
        position: "absolute",
        zIndex: 10
    }
});

export default Onboarding;