import React, { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Video, ResizeMode } from "expo-av";
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

const Onboarding = (props) => {
    const video = useRef(null);
    const [status, setStatus] = useState({});
    const [touched, settouched] = useState(false);
    const [videoFinished, setvideoFinished] = useState(false);
    const [gestureName, setgestureName] = useState("none");
    const [count, setCount] = useState(0);

    const VideoDatas = [
        require("../../assets/video/onboardingVideo.mp4"),
        require("../../assets/video/onboardingVideo.mp4"),
        require("../../assets/video/onboardingVideo.mp4"),
        require("../../assets/video/onboardingVideo.mp4"),
        require("../../assets/video/onboardingVideo.mp4"),
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
                if (count == 4) setvideoFinished(true);
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
                        style={styles.VideoWidget}
                        source={{ uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4" }}
                        isLooping
                        shouldPlay
                        useNativeControls
                        resizeMode={ResizeMode.STRETCH}
                        onPlaybackStatusUpdate={status => setStatus(() => status)}
                        onLoad={() => { video.current.playAsync() }}
                    />
                    {!videoFinished && <View style={styles.gifview}>
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
    VideoWidget: {
        width: "100%",
        height: Dimensions.get("window").height,
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
    scrollGif: {
        width: 120,
        height: 150,
        transform: [{ rotateX: '180deg' }, { translateX: -15 }]
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
        fontWeight: "bold",
        color: "#fff",
        marginTop: 20,
    }
});

export default Onboarding;