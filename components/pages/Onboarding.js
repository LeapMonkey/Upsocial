import React, { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Video, ResizeMode } from "expo-av";

const Onboarding = (props) => {
    const video = useRef(null);
    const [status, setStatus] = useState({});
    const [touched, settouched] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.topBarContainer}>
                <Image
                    source={require("../../assets/logos/logo.png")}
                    style={styles.topLogo}
                />
                <TouchableOpacity>
                    <Ionicons name="search" color="#000" size={30} style={styles.searchIcon} />
                </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1, zIndex: 1 }}>
                <View style={{ position: "relative" }}>
                    <Video
                        ref={video}
                        style={styles.logoImage}
                        source={touched ? require('../../assets/video/advertising.mp4') : require('../../assets/video/onboardingVideo.mp4')}
                        isLooping
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        onPlaybackStatusUpdate={status => setStatus(() => status)}
                        onLoad={() => { video.current.playAsync() }}
                    />
                    {!touched && <View style={styles.gifview} onTouchMove={() => settouched(true)}>
                        <Text style={styles.ScrollText}>Scroll</Text>
                    </View>}
                </View>
                <LinearGradient colors={['#1e2452', '#1e247f']} style={styles.bottomsection}>
                    <TouchableOpacity style={styles.bottombtn} onPress={() => props.setflag("SignUp")}>
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
        position: "relative"
    },
    topBarContainer: {
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        flexDirection: "row",
        justifyContent: "space-between",
        height: 40,
        alignItems: "center",
        zIndex: 2,
        position: "absolute",
        top: 0,
        left: 0
    },
    topLogo: {
        height: 30,
        width: 120
    },
    logoImage: {
        width: "100%",
        height: Dimensions.get("window").height + 40,
        backgroundColor: "#1e2452",
        marginTop: -60
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
    gifview: {
        zIndex: 100,
        position: "absolute",
        bottom: "10%",
        left: "50%",
        transform: [{ translateX: -50 }, { translateY: -50 }]
    },
    gifstyle: {
        width: 100,
        height: 100,
        position: "absolute",
        zIndex: 10
    },
    ScrollText: {
        textTransform: "uppercase",
        fontSize: 24,
        color: "#fff"
    }
});

export default Onboarding;