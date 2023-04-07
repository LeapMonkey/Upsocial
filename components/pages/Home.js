import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { Video, ResizeMode } from "expo-av";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Home = (props) => {
    const TopVideo = useRef(null);
    const HotVideo1 = useRef(null);
    const HotVideo2 = useRef(null);
    const HotVideo3 = useRef(null);
    const [status, setStatus] = useState({});

    return (
        <View style={styles.container}>
            <View style={styles.topBarContainer}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                        source={require("../../assets/logos/imagelogo.png")}
                        style={styles.topLogo}
                    />
                    <Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>UpSocial</Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="search" color="#fff" size={30} />
                </TouchableOpacity>
            </View>
            <View>
                <View style={{ height: Dimensions.get("window").height * 0.5 }}>
                    <Video
                        ref={TopVideo}
                        style={{ width: "100%", height: Dimensions.get("window").height * 0.5 }}
                        source={{ uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4" }}
                        isLooping
                        shouldPlay
                        useNativeControls
                        resizeMode={ResizeMode.STRETCH}
                        onPlaybackStatusUpdate={status => setStatus(() => status)}
                        onLoad={() => { TopVideo.current.playAsync() }}
                    />
                </View>
                <View style={{ flexDirection: "row", gap: 20, marginHorizontal: 20, marginVertical: 10, backgroundColor: "#000" }}>
                    <View style={{ flexDirection: "column", alignItems: "center", gap: 5 }}>
                        <View style={{ color: "#fff", fontWeight: "bold" }}>
                            <Image
                                source={require("../../assets/logos/fox.png")}
                                style={{
                                    height: 50,
                                    width: 80
                                }}
                            />
                        </View>
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>Fox News</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: "column", gap: 10 }}>
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>Elon Musk Lanunches Another rocket into space making history again</Text>
                        <Text style={{ color: "#5a5a5a", fontWeight: "bold" }}>333k views | 3,784 UPs | 11 hours ago</Text>
                    </View>
                </View>
            </View>

            <ScrollView style={{ flex: 1 }}>
                <View style={{
                    flexDirection: "row",
                }}>
                    <View style={{
                        width: Dimensions.get("window").width * 0.33,
                        height: Dimensions.get("window").height * 0.2,
                    }}>
                        <Video
                            ref={HotVideo1}
                            style={{ width: "100%", height: "100%" }}
                            source={{ uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4" }}
                            isLooping
                            shouldPlay
                            useNativeControls
                            resizeMode={ResizeMode.STRETCH}
                            onPlaybackStatusUpdate={status => setStatus(() => status)}
                            onLoad={() => { HotVideo1.current.playAsync() }}
                        />
                    </View>
                    <View style={{
                        width: Dimensions.get("window").width * 0.33,
                        height: Dimensions.get("window").height * 0.2,
                    }}>
                        <Video
                            ref={HotVideo2}
                            style={{ width: "100%", height: "100%" }}
                            source={{ uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4" }}
                            isLooping
                            shouldPlay
                            useNativeControls
                            resizeMode={ResizeMode.STRETCH}
                            onPlaybackStatusUpdate={status => setStatus(() => status)}
                            onLoad={() => { HotVideo2.current.playAsync() }}
                        />
                    </View>
                    <View style={{
                        width: Dimensions.get("window").width * 0.33,
                        height: Dimensions.get("window").height * 0.2,
                    }}>
                        <Video
                            ref={HotVideo3}
                            style={{ width: "100%", height: "100%" }}
                            source={{ uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4" }}
                            isLooping
                            shouldPlay
                            useNativeControls
                            resizeMode={ResizeMode.STRETCH}
                            onPlaybackStatusUpdate={status => setStatus(() => status)}
                            onLoad={() => { HotVideo3.current.playAsync() }}
                        />
                    </View>

                </View>
                <View style={{ flexDirection: "row", height: 200, justifyContent: "center", gap: 20 }}>
                    <Ionicons name="ios-home-sharp" color="#fff" size={50} />
                    <MaterialCommunityIcons name="lightning-bolt" color="#fff" size={50} />
                    <Ionicons name="ios-add-circle" color="#fff" size={50} />
                    <MaterialCommunityIcons name="pin-outline" color="#fff" size={50} />
                    <MaterialCommunityIcons name="bookmark" color="#fff" size={50} />
                </View>
            </ScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000"
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
        width: 30
    },
});

export default Home;