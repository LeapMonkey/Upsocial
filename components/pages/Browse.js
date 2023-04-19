import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Share } from 'react-native';
import Modal from "react-native-modal";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from 'axios';
import { apiURL } from '../config/config';
import { Video, ResizeMode, Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";

const Browse = (props) => {

    const [data, setData] = useState([]);
    const [opened, setOpened] = useState(false);
    const [limit, setLimit] = useState(5);

    const [source, SetSource] = useState();
    const [status, setStatus] = useState({});
    const TopVideo = useRef(null);
    const [videoProps, setVideoProps] = useState(null);


    useEffect(() => {
        axios.post(apiURL + "/api/Upsocial/users/getAll/UploadedContent", { limit: limit }).then((res) => {
            setData(res.data.data);
        }).catch((err) => {
            console.warn(err);
        });

        Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            allowsRecordingIOS: false,
            interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
            interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
            shouldDuckAndroid: true,
            staysActiveInBackground: false,
        });
    }, [limit]);

    const watchVideo = (videoData) => {
        setOpened(true);
        setVideoProps(videoData);
        SetSource({ uri: videoData.ipfsUrl })
    };

    const ShareFile = async (url) => {
        Share.share({
            message: url.toString()
        }).then((res) => {
            console.log(res);
        }).catch((err) => console.log(err));
    };

    return (
        <View style={styles.container}>
            <Modal
                isVisible={opened}
                animationIn={'slideInRight'}
                animationOut={'slideOutRight'}
                style={{ margin: 0, padding: 0 }}
            >
                <View style={styles.videopage}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center", position: 'absolute', top: 0, left: 0, zIndex: 1000000 }}>
                        <TouchableOpacity onPress={() => setOpened(false)}>
                            <Ionicons name="arrow-back-sharp" color="#fff" size={30} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                            <TouchableOpacity onPress={() => setOpened(false)}>
                                <AntDesign name="like2" color="#fff" size={30} />
                            </TouchableOpacity><TouchableOpacity onPress={() => setOpened(false)}>
                                <AntDesign name="dislike2" color="#fff" size={30} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => ShareFile(videoProps.ipfsUrl)}>
                                <Ionicons name="md-share-social-outline" color="#fff" size={30} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* <View style={{ flexDirection: "row", justifyContent: "center", gap: 40, width: "100%", position: 'absolute', top: 50, zIndex: 1000000 }}>
                        <Image source={require("../../assets/swipe/swipe.png")} style={{ width: 50, height: 50, backgroundColor: 'red' }} />
                    </View> */}
                    {/* <View style={styles.gifview}>
                        <TouchableOpacity onPress={() => alert("like this video")}>
                            <Image
                                style={styles.scrollGif}
                                source={require("../../assets/ScrollTop.gif")}
                            />
                        </TouchableOpacity>
                    </View> */}
                    <View style={{ width: "100%", position: 'relative' }} >
                        <Video
                            ref={TopVideo}
                            style={{ width: "100%", height: Dimensions.get("window").height }}
                            source={source}
                            isLooping
                            useNativeControls
                            resizeMode={ResizeMode.CONTAIN}
                            onPlaybackStatusUpdate={status => setStatus(() => status)}
                        />
                    </View>
                </View>
            </Modal>
            <View style={styles.topBarContainer}>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                        source={require("../../assets/logos/imagelogo.png")}
                        style={styles.topLogo}
                    />
                    <Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>UpSocial</Text>
                </View>
                <TouchableOpacity onPress={() => alert("Hi")}>
                    <Ionicons name="search" color="#fff" size={30} />
                </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.board}>
                    {data.map((index, key) => {
                        return (
                            <TouchableOpacity style={{ alignItems: 'center', width: "50%", padding: 10 }} key={key} onPress={() => watchVideo(index)}>
                                <View style={{ alignItems: 'center', width: "100%" }}>
                                    <Image source={{ uri: index.thumbnail }} style={{ width: "100%", height: Dimensions.get("window").height * 0.3, borderRadius: 12 }} />
                                </View>
                                <Text>{index.title}</Text>
                                <Text>{index.description}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <TouchableOpacity style={styles.btnLoad} onPress={() => setLimit(limit + 5)}>
                    <View style={styles.btnCover}>
                        <Text style={styles.btnLable}>Load More</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    board: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",

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
        top: 0
    },
    topLogo: {
        height: 30,
        width: 30
    },
    btnLoad: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"

    },
    btnCover: {
        backgroundColor: "gray",
        padding: 10,
        borderRadius: 20
    },
    btnLable: {
        fontSize: 15,
        color: "#fff"
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    videopage: {
        width: "100%",
        height: Dimensions.get('window').height,
        justifyContent: "center",
        backgroundColor: "#000",
        alignItems: "center",
    },
    loadingView: {
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
    },
    gifview: {
        zIndex: 1000000,
        position: "absolute",
        top: "10%",
        left: 0
    },
    scrollGif: {
        width: 80,
        height: 100,
        transform: [{ rotate: '90deg' }, { translateX: -15 }]
    }
});

export default Browse;
