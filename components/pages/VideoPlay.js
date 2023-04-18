import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Dimensions, Image } from 'react-native';
import { Video, ResizeMode } from "expo-av";
import Ionicons from "react-native-vector-icons/Ionicons";

const VideoPlay = (props) => {

    const [source, SetSource] = useState();
    const [status, setStatus] = useState({});
    const [loading, setLoading] = useState(false);
    const TopVideo = useRef(null);

    useEffect(() => {
        if (props.videoProps) {
            SetSource({ uri: "https://g.upsocial.com/ipfs/QmUYUkvJFCpdt3dKqhGkAX9cpi3PydC2hvVHSTv1RYQQUS" })
        }
    }, [props.videoProps]);

    return (
        <View style={props.videoflag ? styles.videopage : styles.videonotpage}>
            <View style={{ flexDirection: "row", alignItems: "center", position: 'absolute', top: 0, left: 0, zIndex: 1000000 }}>
                <TouchableOpacity onPress={() => { props.setVideoflag(false); }}>
                    <Ionicons name="arrow-back-sharp" color="#fff" size={30} />
                </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center', width: "100%" }}>
                <Video
                    ref={TopVideo}
                    style={{ width: "100%", borderRadius: 12, height: Dimensions.get("window").height }}
                    source={source}
                    isLooping
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                    onLoad={() => { setLoading(false); TopVideo.current.playAsync() }}
                    onLoadStart={() => { setLoading(true); }}
                />
            </View>

            {loading && <View style={{ alignItems: 'center', width: "100%", position: 'absolute' }}>
                <Image source={{ uri: props.videoProps?.thumbnail }} style={{ width: "100%", height: Dimensions.get("window").height, borderRadius: 12 }} />
            </View>}

            {loading && <View style={styles.loadingView}>
                <Image
                    source={require("../../assets/loading.gif")}
                    style={{ width: 140, height: 140 }}
                />
            </View>}
        </View>
    );
};

const styles = StyleSheet.create({
    videonotpage: {
        position: "absolute",
        top: 0,
        left: "100%",
        width: Dimensions.get('window').width,
        backgroundColor: "#000",
        height: Dimensions.get('window').height,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
    },
    videopage: {
        position: "absolute",
        top: 0,
        left: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        justifyContent: "center",
        backgroundColor: "#000",
        alignItems: "center",
        zIndex: 100,
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
    }
});


export default VideoPlay;