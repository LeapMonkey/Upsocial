import React, { useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Video, ResizeMode } from "expo-av";
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { useMediaQuery } from "react-responsive";
// import * as ScreenOrientation from 'expo-screen-orientation';

const Onboarding = (props) => {
    const video = useRef(null);
    const [status, setStatus] = useState({});
    const [touched, settouched] = useState(false);
    const [videoFinished, setvideoFinished] = useState(true);
    const [gestureName, setgestureName] = useState("none");
    const [count, setCount] = useState(0);

    const isDesktopOrLaptop = useMediaQuery({
        query: "(min-device-width: 500px)"
    });

    const VideoDatas = [
        { uri: "https://g.upsocial.com/ipfs/QmXF1SaqxcFCTDrBrygXqdrHFT9nUhroHZDQ6p672xCRns" },
        { uri: "https://g.upsocial.com/ipfs/Qmd9jWF4ajEop3AyJirP4q2N8nFzL5GyeoB75pTqRPSAUr" },
        { uri: "https://g.upsocial.com/ipfs/QmUYUkvJFCpdt3dKqhGkAX9cpi3PydC2hvVHSTv1RYQQUS" },
        { uri: "https://g.upsocial.com/ipfs/QmUQypwRoVf1PpwmDgHPP6Fear4Q7tdgE1D932itw13jJo" },
        { uri: "https://g.upsocial.com/ipfs/QmcBa5RZ5JSj7yybWyW2vdEr8KWtAqiqsxdqWLs52kVPP1" },
        { uri: "https://g.upsocial.com/ipfs/QmUpxoDxrvrjgdKXpFYo3659dcfZYq9GN4uWKz8kP2BrDM" },
        { uri: "https://g.upsocial.com/ipfs/QmPLkLnSNUD5AzqbYsPKrmwETRcshuy3Y1Yvv5WAPhfi6x" },
        { uri: "https://g.upsocial.com/ipfs/QmfPLvtyGxgiNvw4Kp17tyuyX8ykptNbcFZKc6Mj7HkVGi" },
        { uri: "https://g.upsocial.com/ipfs/QmaR5ovcPp1s7urguih9ZNfd1Dt97tqEaMSHsQfLyhiCX4" }
    ]

    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
    };

    const onSwipe = (gestureName, gestureState) => {
        const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
        setgestureName(gestureName);
        switch (gestureName) {
            case SWIPE_UP:
                settouched(true);
                setCount(count + 1);
                if (count == 8) setCount(0);
                break;
            case SWIPE_DOWN:
                settouched(false);
                break;
            case SWIPE_LEFT:
                settouched(false);
                break;
            case SWIPE_RIGHT:
                settouched(false);
                break;
        }
    }

    return (
        <LinearGradient
            colors={['#2ab4fad9', '#1D2145']}
            style={styles.container}
        >
            <View style={isDesktopOrLaptop ? styles.mainview : styles.responsiveview}>
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
                            videoStyle={{ position: 'relative', width: "100%", height: Dimensions.get("window").height }}
                            style={styles.VideoWidget}
                            source={VideoDatas[count]}
                            rate={1.0}
                            isLooping
                            volume={1.0}
                            shouldPlay
                            useNativeControls
                            resizeMode={ResizeMode.STRETCH}
                            onPlaybackStatusUpdate={status => setStatus(() => status)}
                            onLoad={() => { video.current.playAsync() }}
                        // onFullscreenUpdate={setOrientation}
                        />
                        {videoFinished && <View style={styles.gifview}>
                            <GestureRecognizer
                                onSwipe={(direction, state) => onSwipe(direction, state)}
                                config={config}
                            >
                                <Image
                                    style={styles.scrollGif}
                                    source={require("../../assets/ScrollTop.gif")}
                                />
                                <Text style={styles.ScrollText}>Scroll</Text>
                            </GestureRecognizer>
                        </View>}
                    </View>
                    {videoFinished && (<LinearGradient colors={['#1e2452', '#1e247f']} style={styles.bottomsection}>
                        <TouchableOpacity style={styles.bottombtn} onPress={() => props.setflag("SignUp")}>
                            <Text style={styles.bottombtntext}>Get Started</Text>
                        </TouchableOpacity>
                    </LinearGradient>)}
                </ScrollView>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
    },
    mainview: {
        flex: 1,
        position: "relative",
        width: 400,
    },
    responsiveview: {
        flex: 1,
        position: "relative",
        width: "100%",
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
    VideoWidget: {
        width: "100%",
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
        marginTop: 50,
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
    scrollGif: {
        width: 120,
        height: 150,
        transform: [{ rotateX: '180deg' }, { translateX: -15 }]
    },
    ScrollText: {
        textTransform: "uppercase",
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginTop: 20,
    }
});

export default Onboarding;