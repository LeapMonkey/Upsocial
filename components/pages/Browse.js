import React, { useState, useEffect, useRef } from 'react';
import { connect } from "react-redux";
import { ScrollView, View, Text, StyleSheet, Image, TextInput, Dimensions, TouchableOpacity, Share, TouchableHighlight } from 'react-native';
import Modal from "react-native-modal";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SwipeListView } from 'react-native-swipe-list-view';
import axios from 'axios';
import { apiURL } from '../config/config';
import { Video, ResizeMode, Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { useMediaQuery } from "react-responsive";
import isEmpty from '../config/is-empty';

const Browse = (props) => {
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

    const [loading, setLoading] = useState(false);

    const [alldata, setAlldata] = useState([]);
    const [result, setResult] = useState([]);

    const [opened, setOpened] = useState(false);
    const [limit, setLimit] = useState(5);

    const [videoId, setVideoId] = useState("");

    const [source, SetSource] = useState();
    const [status, setStatus] = useState({});
    const TopVideo = useRef(null);
    const [videoProps, setVideoProps] = useState(null);
    const [searchflag, setSearchflag] = useState(false);
    const [searchtext, setSearchtext] = useState("");

    const [curIndex, setCurIndex] = useState(null);

    const [listData, setListData] = useState(
        Array(1)
            .fill('')
            .map((_, i) => ({ key: `${i}`, text: `item #${i}` }))
    );

    useEffect(() => {
        axios.post(apiURL + "/api/Upsocial/users/getAll/UploadedContent", { limit: limit }, {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            res.data.data.sort((a, b) => {
                return new Date(b.postDate) - new Date(a.postDate);
            });
            setAlldata(res.data.data);
            setResult(res.data.data);
            setLoading(false);
        }).catch((err) => {
            console.warn(err);
            setLoading(false);
        });
    }, [limit]);


    useEffect(() => {
        Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            allowsRecordingIOS: false,
            interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
            interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
            shouldDuckAndroid: true,
            staysActiveInBackground: false,
        });
    }, [limit]);

    const watchVideo = (videoData, key) => {
        setVideoId(videoData.ID);
        setOpened(true);
        setVideoProps(videoData);
        SetSource({ uri: videoData.ipfsUrl });
        setCurIndex(key);
    };

    const ShareFile = async (url) => {
        Share.share({
            message: url.toString()
        }).then((res) => {
            console.log(res);
        }).catch((err) => console.log(err));
    };

    const onSearch = (e) => {
        setSearchtext(e);
        var searchresult = alldata.filter((item) => {
            return item.title.toLowerCase().indexOf(e.toLowerCase()) > -1 || item.keyword.toLowerCase().includes(e.toLowerCase());
        });
        if (e === "") {
            setResult(alldata);
        } else {
            setResult(searchresult);
        }
    }

    const renderItem = () => (
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
    );

    const handleReaction = async (e) => {
        if (e.value > 300 && confirm("You DisLike this video") == true) {
            if (curIndex == result.length - 1) {
                console.log("here 1", videoId);
                SetSource({ uri: result[0].ipfsUrl });
                setVideoId(0);
                setCurIndex(0);
                console.log(videoId, props.auth.user.curUser);
                await axios.post(apiURL + "/api/Upsocial/users/content/dislike", { videoId: videoId, userEmail: props.auth.user.curUser }, {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                }).then((res) => {
                    console.log(res.data);
                }).catch((err) => {
                    console.warn(err);
                });
                await axios.post(apiURL + "/api/Upsocial/content/dislike", { videoId: videoId, userEmail: props.auth.user.curUser }, {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                }).then((res) => {
                    console.log(res.data);
                }).catch((err) => {
                    console.warn(err);
                });
                return;
            } else {
                console.log("here 2", videoId);
                SetSource({ uri: result[curIndex + 1].ipfsUrl });
                setVideoId(curIndex + 1);
                setCurIndex(curIndex + 1);
                console.log(videoId, props.auth.user.curUser);
                await axios.post(apiURL + "/api/Upsocial/users/content/dislike", { videoId: videoId, userEmail: props.auth.user.curUser }, {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                }).then((res) => {
                    console.log(res.data);
                }).catch((err) => {
                    console.warn(err);
                });
                await axios.post(apiURL + "/api/Upsocial/content/dislike", { videoId: videoId, userEmail: props.auth.user.curUser }, {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                }).then((res) => {
                    console.log(res.data);
                }).catch((err) => {
                    console.warn(err);
                });
                return;
            }
        } else if (e.value < -300 && confirm("You Like this video") == true) {
            if (curIndex == result.length - 1) {
                console.log("here 3", videoId);
                SetSource({ uri: result[0].ipfsUrl });
                setVideoId(0);
                setCurIndex(0);
                console.log(videoId, props.auth.user.curUser);
                await axios.post(apiURL + "/api/Upsocial/users/content/like", { videoId: videoId, userEmail: props.auth.user.curUser }, {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                }).then((res) => {
                    console.log(res.data);
                }).catch((err) => {
                    console.warn(err);
                });
                await axios.post(apiURL + "/api/Upsocial/content/like", { videoId: videoId, userEmail: props.auth.user.curUser }, {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                }).then((res) => {
                    console.log(res.data);
                }).catch((err) => {
                    console.warn(err);
                });
                return;
            } else {
                console.log("here 4", videoId);
                SetSource({ uri: result[curIndex + 1].ipfsUrl });
                setVideoId(curIndex + 1);
                setCurIndex(curIndex + 1);
                await axios.post(apiURL + "/api/Upsocial/users/content/like", { videoId: videoId, userEmail: props.auth.user.curUser }, {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                }).then((res) => {
                    console.log(res.data);
                }).catch((err) => {
                    console.warn(err);
                });
                await axios.post(apiURL + "/api/Upsocial/content/like", { videoId: videoId, userEmail: props.auth.user.curUser }, {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                }).then((res) => {
                    console.log(res.data);
                }).catch((err) => {
                    console.warn(err);
                });
                return;
            }
        }
    };

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}></View>
    );

    const [scrollVal, setScrollVal] = useState(0);
    const [viewVal, setViewVal] = useState(0);

    const find_dimesions = (layout) => {
        const { height } = layout;
        setViewVal(height);
    }
    const find_scroll = (layout) => {
        const { height } = layout;
        setScrollVal(height);
    }
    const handleScroll = (event) => {
        if (event.nativeEvent.contentOffset.y + scrollVal == viewVal) {
            console.log("load more....");
            setLoading(true);
            setLimit(limit + 5);
        }
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
                            <TouchableOpacity onPress={() => ShareFile(videoProps.ipfsUrl)}>
                                <Ionicons name="md-share-social-outline" color="#fff" size={30} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ height: Dimensions.get("window").height }}>
                        <SwipeListView
                            data={listData}
                            renderItem={renderItem}
                            renderHiddenItem={renderHiddenItem}
                            leftOpenValue={0}
                            rightOpenValue={0}
                            previewRowKey={'0'}
                            previewOpenValue={-40}
                            previewOpenDelay={3000}
                            onSwipeValueChange={(e) => handleReaction(e)}
                        />
                    </View>
                </View>
            </Modal>
            <View style={styles.topBarContainer}>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => props.setName("explore")}>
                    <Image
                        source={require("../../assets/logos/imagelogo.png")}
                        style={styles.topLogo}
                    />
                    <Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>UpSocial</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSearchflag(!searchflag)}>
                    <Ionicons name="search" color="#fff" size={30} />
                </TouchableOpacity>
            </View>
            {searchflag && <View style={styles.searchbar}>
                <TextInput placeholder="search by title & Tags" placeholderTextColor="#adb2b6"
                    style={styles.TextInput} value={searchtext} onChangeText={(e) => onSearch(e)} />
            </View>}
            <ScrollView onLayout={(event) => { find_scroll(event.nativeEvent.layout) }} onScroll={handleScroll} style={{ flex: 1 }}>
                <View onLayout={(event) => { find_dimesions(event.nativeEvent.layout) }} style={styles.board}>
                    {result && result.map((index, key) => {
                        return (
                            <TouchableOpacity style={isWide ? styles.wideitemview : isDesktop ? styles.desktopitemview : isTablet ? styles.tabletitemview : isTabletOrMobile ? styles.tabletormobileitemview : styles.mobileitemview} key={key} onPress={() => watchVideo(index, key)}>
                                <View style={{ alignItems: 'center', width: "100%" }}>
                                    <Image source={{ uri: index.thumbnail }} style={{ width: "100%", height: Dimensions.get("window").height * 0.3, borderRadius: 12 }} />
                                    <Image source={require("../../assets/logos/playvideo.png")} style={{ width: 50, height: 50, position: "absolute", top: "40%" }} />
                                </View>
                                <Text>{index.title}</Text>
                                <Text>{index.description}</Text>
                            </TouchableOpacity>
                        )
                    })}
                    {isEmpty(result) && (
                        <View style={styles.nodataContainer}>
                            <Text style={styles.nodata_title}>No Videos yet!</Text>
                            <Text style={styles.nodata_content}>Upload your first video!</Text>
                        </View>
                    )}
                </View>
                {loading && <View style={styles.loadingView}>
                    <Image
                        source={require("../../assets/loading.gif")}
                        style={{ width: 140, height: 140 }}
                    />
                </View>}
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
    tabletormobileitemview: {
        alignItems: 'center',
        width: "50%",
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
    wideitemview: {
        alignItems: "center",
        width: "20%",
        padding: 10
    },
    topBarContainer: {
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        flexDirection: "row",
        justifyContent: "space-between",
        height: 40,
        alignItems: "center",
        zIndex: 2,
        position: "relative"
    },
    topLogo: {
        height: 30,
        width: 30
    },
    searchbar: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    TextInput: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        borderColor: "#3b8ad0",
        borderWidth: 2,
        borderRadius: 20,
        width: "90%",
        marginVertical: 10,
    },
    btnLoad: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
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
        width: "100%",
        height: "100%",
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
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#000',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: '#000',
        left: 0,
    },
    backRightBtnRight: {
        backgroundColor: '#000',
        right: 0,
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
});

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(Browse);