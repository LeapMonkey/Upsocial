import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons, MaterialIcons, Feather, Ionicons } from 'react-native-vector-icons';
import { apiURL } from "../../config/config";
import { useMediaQuery } from "react-responsive";
import { connect } from "react-redux";
import axios from "axios";
import { Video, ResizeMode } from "expo-av";
import Modal from "react-native-modal";
import isEmpty from "../../config/is-empty";

const RecentsUploads = (props) => {

    const [result, setResult] = useState([]);

    // mobile and desktop variable for responsive
    const isMobile = useMediaQuery({
        query: "(max-device-width: 500px)"
    });

    const isTabletOrMobile = useMediaQuery({
        query: "(min-device-width: 500px)"
    });

    const isTablet = useMediaQuery({
        query: "(min-device-width: 768px)"
    });

    const isDesktop = useMediaQuery({
        query: "(min-device-width: 1024px)"
    });

    const isWide = useMediaQuery({
        query: "(min-device-width: 1441px)"
    });
    // end


    const [videoPlayOpened, setVideoPlayOpened] = useState(false);
    const [source, SetSource] = useState();
    const TopVideo = useRef(null);
    const [status, setStatus] = useState({});

    const watchVideo = (videoData, key) => {
        setVideoPlayOpened(true);
        SetSource({ uri: videoData.ipfsUrl });
    };

    useEffect(() => {
        axios.post(apiURL + "/api/Upsocial/users/get/UploadedContent", { userEmail: props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser }, {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            setResult(res.data.data);
        }).catch((err) => {
            console.warn(err);
        });
    });

    return (
        <View style={styles.container}>
            <Modal
                isVisible={videoPlayOpened}
                animationIn={'slideInRight'}
                animationOut={'slideOutRight'}
                style={{ margin: 0, padding: 0 }}
            >
                <View style={styles.videoPlayPage}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center", position: 'absolute', top: 0, left: 0, zIndex: 1000000 }}>
                        <TouchableOpacity onPress={() => setVideoPlayOpened(false)}>
                            <Ionicons name="arrow-back-sharp" color="#fff" size={30} />
                        </TouchableOpacity>
                        {/* <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                            <TouchableOpacity onPress={() => ShareFile(videoProps.ipfsUrl)}>
                                <Ionicons name="md-share-social-outline" color="#fff" size={30} />
                            </TouchableOpacity>
                        </View> */}
                    </View>
                    <View style={{ height: Dimensions.get("window").height }}>
                        <View style={{ width: "100%", position: 'relative', height: "100%" }}>
                            <Video
                                videoStyle={{ position: 'relative', width: Dimensions.get("window").width, height: Dimensions.get("window").height }}
                                ref={TopVideo}
                                style={{ width: "100%", height: Dimensions.get("window").height }}
                                source={source}
                                rate={1.0}
                                isLooping
                                volume={1.0}
                                shouldPlay
                                useNativeControls
                                resizeMode={ResizeMode.CONTAIN}
                                onPlaybackStatusUpdate={status => setStatus(() => status)}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={styles.headersection}>
                <View style={styles.subheadersection}>
                    <TouchableOpacity style={styles.headerimage} onPress={() => props.navigation.navigate("Home")}>
                        <Image
                            source={require("../../../assets/logos/logo_wh.png")}
                            style={{ height: 30, width: 158 }}
                        />
                    </TouchableOpacity>
                    <View style={styles.iconsection}>
                        <TouchableOpacity style={styles.iconbtn}>
                            <MaterialCommunityIcons name="cast" color="#fff" size={22} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconbtn}>
                            <MaterialCommunityIcons name="bell" color="#fff" size={22} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconbtn} onPress={() => setSearchflag(!searchflag)}>
                            <MaterialIcons name="search" color="#fff" size={22} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconbtn} onPress={() => props.navigation.toggleDrawer()}>
                            <Feather name="menu" color="#fff" size={22} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.RecentContents}>
                <View style={styles.ViewHeader}>
                    <Text style={styles.HeaderTitle}>Recent Uploads</Text>
                </View>
                <View style={styles.board}>
                    {result && result.map((index, key) => {
                        return (
                            <TouchableOpacity style={isWide ? styles.wideitemview : isDesktop ? styles.desktopitemview : isTablet ? styles.tabletitemview : isTabletOrMobile ? styles.tabletormobileitemview : styles.mobileitemview} key={key} onPress={() => watchVideo(index, key)}>
                                <View style={{ alignItems: 'center', width: "100%" }}>
                                    <Image source={{ uri: index.thumbnail }} style={{ width: "100%", height: Dimensions.get("window").height * 0.3, borderRadius: 12 }} />
                                    <Image source={require("../../../assets/logos/playvideo.png")} style={{ width: 50, height: 50, position: "absolute", top: "40%" }} />
                                </View>
                                <Text>{index.title}</Text>
                                <Text>{index.description}</Text>
                            </TouchableOpacity>
                        )
                    })}
                    {isEmpty(result) && (
                        <View style={styles.nodataContainer}>
                            <Text style={styles.nodata_title}>No Videos yet!</Text>
                            <Text style={styles.nodata_content}>Explore the moments. Upload your Videos</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    RecentContents: {
        flexDirection: "column",
        marginHorizontal: 10,
        marginTop: 30
    },
    ViewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30
    },
    HeaderTitle: {
        fontSize: 20,
        color: "#000"
    },
    BtnView: {
        fontSize: 12,
        color: "#9c26b0"
    },
    VideoContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        position: 'relative'
    },
    VideoItem: {
        width: Dimensions.get("window").width * 0.25,
        height: Dimensions.get("window").width * 0.25,
        marginBottom: 10,
        borderRadius: 10,
        marginHorizontal: 2,
        position: 'relative'
    },
    board: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",

    },
    wideitemview: {
        alignItems: "center",
        width: "20%",
        padding: 10
    },
    mobileitemview: {
        alignItems: "center",
        width: "50%",
        padding: 10,
    },
    tabletitemview: {
        alignItems: "center",
        width: "33%",
        padding: 10
    },
    desktopitemview: {
        alignItems: "center",
        width: "25%",
        padding: 10
    },
    tabletormobileitemview: {
        alignItems: 'center',
        width: "50%",
        padding: 10
    },
    nodataContainer: {
        flexDirection: "column",
        marginVertical: 20,
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    nodata_title: {
        color: "#3f29b2",
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 2
    },
    nodata_content: {
        color: "#000",
        marginVertical: 2,
        fontSize: 14,
    },
    headersection: {
        flexDirection: "column",
        height: Dimensions.get("window").height * 0.08,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2AB4FA"
    },
    subheadersection: {
        width: "calc(100% - 30px)",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    headerimage: {
        flex: 1
    },
    iconsection: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    iconbtn: {
        marginLeft: 10
    },
    videoPlayPage: {
        width: "100%",
        height: Dimensions.get('window').height,
        justifyContent: "center",
        backgroundColor: "#000",
        alignItems: "center",
    },
});


const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(RecentsUploads);