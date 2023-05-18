import React, { useState, useEffect, useRef } from 'react';
import { connect } from "react-redux";
import { MaterialCommunityIcons, MaterialIcons, Feather, Ionicons } from 'react-native-vector-icons';
import { Text, StyleSheet, Image, View, ScrollView, TouchableOpacity, Dimensions, Share, TextInput } from 'react-native';
import Modal from "react-native-modal";
import { useMediaQuery } from "react-responsive";
import { Video, ResizeMode } from "expo-av";
import isEmpty from '../../config/is-empty';
import { apiURL } from '../../config/config';
import axios from 'axios';
import { SwipeListView } from 'react-native-swipe-list-view';

const items = [
    { id: 1, name: 'NEWEST' },
    { id: 2, name: 'FOR ME' },
    { id: 3, name: 'SUBSCRIPTIONS' },
    { id: 4, name: 'Animation' },
    { id: 5, name: 'Autos & Vehicles' },
    { id: 6, name: 'Beauty & Fashion' },
    { id: 7, name: 'Comedy' },
    { id: 8, name: 'Cooking & Food' },
    { id: 9, name: 'DIY & Crafts' },
    { id: 10, name: 'Documentary' },
    { id: 11, name: 'Education' },
    { id: 12, name: 'Entertainment' },
    { id: 13, name: 'Film & Animation' },
    { id: 14, name: 'Gaming' },
    { id: 15, name: 'Health & Fitness' },
    { id: 16, name: 'How-to & Style' },
    { id: 17, name: 'Kids & Family' },
    { id: 18, name: 'Music' },
    { id: 19, name: 'News & Politics' },
    { id: 20, name: 'Nonprofits & Activism' },
    { id: 21, name: 'People & Blogs' },
    { id: 22, name: 'Pets & Animals' },
    { id: 23, name: 'Science & Technology' },
    { id: 24, name: 'Sports' },
    { id: 25, name: 'Travel & Events' },
    { id: 26, name: 'Unboxing & Reviews' },
    { id: 27, name: 'Blogs' },
];


const Home = (props) => {
    // mobile and desktop variable for responsive
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

    const [categoryName, setCategoryName] = useState("NEWEST");
    const [result, setResult] = useState([]);
    const [allData, setAllData] = useState([]);
    const [limit, setLimit] = useState(10);
    const [searchflag, setSearchflag] = useState(false);
    const [searchtext, setSearchtext] = useState("");
    // Video config
    const PlayingVideo = useRef(null);
    const [status, setStatus] = useState({});
    const [videoSource, SetVideoSource] = useState({ uri: "" });
    const [thumbnail, setThumbnail] = useState({ uri: "" });
    const [title, setTitle] = useState("Upsocial");
    const [description, setDescription] = useState("Upsocial");

    // Video Data
    const [videoId, setVideoId] = useState("");
    const [opened, setOpened] = useState(false);
    const [videoProps, setVideoProps] = useState(null);
    const [source, SetSource] = useState();
    const [curIndex, setCurIndex] = useState(null);
    const [listData, setListData] = useState(
        Array(1)
            .fill('')
            .map((_, i) => ({ key: `${i}`, text: `item #${i}` }))
    );
    const TopVideo = useRef(null);

    const changeCategoryItem = (itemname) => {
        setCategoryName(itemname);
        if (itemname == "NEWEST") {
            axios.post(apiURL + "/api/Upsocial/users/getAll/UploadedContent", { limit: limit }, {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
            }).then((res) => {
                res.data.data.sort((a, b) => {
                    return new Date(b.postDate) - new Date(a.postDate);
                });
                setResult(res.data.data);
                setAllData(res.data.data);
                SetVideoSource({ uri: res.data.data[0].ipfsUrl });
                setThumbnail({ uri: res.data.data[0].thumbnail });
                setTitle(res.data.data[0].title);
                setDescription(res.data.data[0].description);
            }).catch((err) => {
                console.warn(err);
            });
        } else if (itemname == "FOR ME") {
            axios.post(apiURL + "/api/Upsocial/users/personalize", { userEmail: props.auth.user.curUser }, {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
            }).then((res) => {
                setResult(res.data.feeds);
                setAllData(res.data.data);
            }).catch((err) => {
                console.warn(err);
            });
        } else if (itemname == "SUBSCRIPTIONS") {
            axios.post(apiURL + "/api/Upsocial/getAll/channels", {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
            }).then((res) => {
                const result = res.data.channelData.filter((item) => item.followers.includes(props.auth.user.curUser));
                var arrayP = result.map(o => o.contents);
                var videofeeds = Object.values(arrayP.reduce(((r, c) => Object.assign(r, c)), {}));
                setResult(videofeeds);
                setAllData(res.data.data);
            }).catch((err) => {
                console.warn(err);
            });
        } else {
            axios.post(apiURL + "/api/Upsocial/users/get/UploadedContent/Category", { categoryName: itemname }, {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
            }).then((res) => {
                res.data.data.sort((a, b) => {
                    return new Date(b.postDate) - new Date(a.postDate);
                });
                setResult(res.data.data);
                setAllData(res.data.data);
                SetVideoSource({ uri: res.data.data[0].ipfsUrl });
                setThumbnail({ uri: res.data.data[0].thumbnail });
                setTitle(res.data.data[0].title);
                setDescription(res.data.data[0].description);
            }).catch((err) => {
                console.warn(err);
            })

        }
    };

    const setCurrentVideoData = (item) => {
        setTitle(item.title);
        setDescription(item.description);
        SetVideoSource({ uri: item.ipfsUrl });
        setThumbnail({ uri: item.thumbnail });
    };

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
    }

    const onSearch = (e) => {
        setSearchtext(e);
        var searchresult = result.filter((item) => {
            return item.title.toLowerCase().indexOf(e.toLowerCase()) > -1 || item.keyword.toLowerCase().includes(e.toLowerCase());
        });
        if (e === "") {
            setResult(allData);
        } else {
            setResult(searchresult);
        }
    }

    useEffect(() => {
    }, []);

    useEffect(() => {
        if (categoryName == "NEWEST") {
            axios.post(apiURL + "/api/Upsocial/users/getAll/UploadedContent", { limit: limit }, {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
            }).then((resp) => {

                axios.post(apiURL + "/api/Upsocial/getAll/channels", {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                }).then((res) => {
                    var videofeeds1 = resp.data.data;
                    const results = res.data.channelData.filter((item) => !isEmpty(item.contents) && item.contents);
                    var arrayP = results.map(o => o.contents);
                    var videofeeds2 = arrayP.flat();
                    var resultVideo = [...videofeeds1, ...videofeeds2];
                    resultVideo.sort((a, b) => {
                        return new Date(b.postDate) - new Date(a.postDate);
                    });
                    setResult(resultVideo);
                    setAllData(resultVideo);
                    SetVideoSource({ uri: resultVideo[0].ipfsUrl });
                    setThumbnail({ uri: resultVideo[0].thumbnail });
                    setTitle(resultVideo[0].title);
                    setDescription(resultVideo[0].description);
                }).catch((err) => {
                    console.warn(err);
                });
            }).catch((err) => {
                console.warn(err);
            });
        }
    }, [limit]);

    const videosHandle = (index, key) => {
        setCurrentVideoData(index);
        watchVideo(index, key)
    };

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
    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}></View>
    );

    const handleReaction = async (e) => {
        if (e.value > 300 && confirm("You DisLike this video") == true) {
            if (curIndex == result.length - 1) {
                SetSource({ uri: result[0].ipfsUrl });
                setVideoId(0);
                setCurIndex(0);
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
                SetSource({ uri: result[curIndex + 1].ipfsUrl });
                setVideoId(curIndex + 1);
                setCurIndex(curIndex + 1);
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
                SetSource({ uri: result[0].ipfsUrl });
                setVideoId(0);
                setCurIndex(0);
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


    return (
        <View style={styles.main}>
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
            <View style={styles.headersection}>
                <View style={styles.subheadersection}>
                    <TouchableOpacity style={styles.headerimage} onPress={() => changeCategoryItem("NEWEST")}>
                        <Image
                            source={require("../../../assets/logos/logo_wh.png")}
                            style={{ height: 30, width: 158 }}
                        />
                    </TouchableOpacity>
                    <View style={styles.iconsection}>
                        <TouchableOpacity style={styles.iconbtn}>
                            <MaterialCommunityIcons name="cast" color="#fff" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconbtn}>
                            <MaterialCommunityIcons name="bell" color="#fff" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconbtn} onPress={() => setSearchflag(!searchflag)}>
                            <MaterialIcons name="search" color="#fff" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconbtn} onPress={() => props.navigation.toggleDrawer()}>
                            <Feather name="menu" color="#fff" size={35} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {searchflag && <View style={styles.searchbar}>
                <TextInput placeholder="search by title & Tags" placeholderTextColor="#fff"
                    style={styles.TextInput} value={searchtext} onChangeText={(e) => onSearch(e)} />
            </View>}
            <View style={styles.categoryview}>
                {items.map((item, key) => {
                    return (
                        <TouchableOpacity key={key} style={categoryName === item.name ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem(item.name)}>
                            <Text style={categoryName === item.name ? styles.active_categorytext : styles.categorytext}>{item.name}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
            <ScrollView style={styles.scrollview}>
                <View style={styles.videoFeed}>
                    <View style={styles.playground}>
                        <Video
                            ref={PlayingVideo}
                            videoStyle={{ position: 'relative', width: "100%", height: "100%", aspectRatio: 16 / 9 }}
                            style={styles.video_feed}
                            source={videoSource}
                            isLooping
                            useNativeControls
                            resizeMode={ResizeMode.CONTAIN}
                            onPlaybackStatusUpdate={status => setStatus(() => status)}
                        />
                        <View style={styles.video_metadata}>
                            <TouchableOpacity style={styles.creator}>
                                <View style={{ color: "#fff", fontWeight: "bold" }}>
                                    <Image source={thumbnail} style={{ height: 50, width: 80 }} />
                                </View>
                                <Text style={{ color: "#fff", fontWeight: "bold" }}>{title}</Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1, flexDirection: "column", gap: 10 }}>
                                <Text style={{ color: "#fff", fontWeight: "bold" }}>{description}</Text>
                                <Text style={{ color: "#5a5a5a", fontWeight: "bold" }}>333k views | 3,784 UPs | 11 hours ago</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Video list */}
                {isEmpty(result) ? (
                    <View style={styles.videoLists}>
                        <View style={styles.emptycontentview}>
                            <View style={styles.nodataContainer}>
                                <Text style={styles.nodata_title}>No Videos yet!</Text>
                                <Text style={styles.nodata_content}>Upload your first video!</Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.videoLists}>
                        <View style={styles.contentview}>
                            {!isEmpty(result) && result.map((index, key) => {
                                if (Number(key + 1) <= Number(Math.ceil(result.length / 2))) {
                                    return (
                                        <TouchableOpacity style={isWide ? styles.wideitemview : isDesktop ? styles.desktopitemview : isTablet ? styles.tabletitemview : isTabletOrMobile ? styles.tabletormobileitemview : styles.mobileitemview} key={key} onPress={() => videosHandle(index, key)}
                                        >
                                            <View style={{ alignItems: 'center', width: "100%", borderRadius: 10 }}>
                                                <img src={index.thumbnail} style={{ width: "100%", borderRadius: 10 }} />
                                                <Image source={require("../../../assets/logos/playvideo.png")} style={{ width: 50, height: 50, position: "absolute", top: "40%" }} />
                                            </View>
                                            <Text style={styles.metadata_title}>{index.title}</Text>
                                            <Text style={styles.metadata_description}>{index.description}</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            })}
                        </View>
                        <View style={styles.contentview}>
                            {!isEmpty(result) && result.map((index, key) => {
                                if (Number(key + 1) > Number(Math.ceil(result.length / 2))) {
                                    return (
                                        <TouchableOpacity style={isWide ? styles.wideitemview : isDesktop ? styles.desktopitemview : isTablet ? styles.tabletitemview : isTabletOrMobile ? styles.tabletormobileitemview : styles.mobileitemview} key={key} onPress={() => videosHandle(index, key)}>
                                            <View style={{ alignItems: 'center', width: "100%", borderRadius: 10 }}>
                                                <img src={index.thumbnail} style={{ width: "100%", borderRadius: 10 }} />
                                                <Image source={require("../../../assets/logos/playvideo.png")} style={{ width: 50, height: 50, position: "absolute", top: "40%" }} />
                                            </View>
                                            <Text style={styles.metadata_title}>{index.title}</Text>
                                            <Text style={styles.metadata_description}>{index.description}</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            })}
                        </View>
                    </View>)}

            </ScrollView>
            <View style={styles.controller}>
                <TouchableOpacity onPress={() => changeCategoryItem("NEWEST")}>
                    <Ionicons name="ios-home-sharp" color="#fff" size={50} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeCategoryItem("FOR ME")}>
                    <MaterialCommunityIcons name="lightning-bolt" color="#fff" size={50} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.navigation.navigate("Add a Video")}>
                    <Ionicons name="ios-add-circle" color="#fff" size={50} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="pin-outline" color="#fff" size={50} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeCategoryItem("SUBSCRIPTIONS")}>
                    <MaterialCommunityIcons name="bookmark" color="#fff" size={50} />
                </TouchableOpacity>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        width: "100%",
        height: "100%",
        position: "relative"
    },
    scrollview: {
        backgroundColor: "#000",
        flex: 1
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
    categoryview: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        overflow: "auto",
        backgroundColor: "#000",
        height: Dimensions.get("window").height * 0.08
    },
    active_categoryitem: {
        paddingVertical: 20,
        marginHorizontal: 10,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "transparent",
        borderBottomColor: "#fff",
    },
    categoryitem: {
        paddingVertical: 20,
        marginHorizontal: 10,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "transparent",
    },
    active_categorytext: {
        color: "#fff",
        fontSize: 14
    },
    categorytext: {
        fontSize: 14,
        color: "rgb(197, 197, 197)",
    },
    emptycontentview: {
        width: "100%",
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    contentview: {
        width: "50%",
        flex: 1,
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
        width: "100%",
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
    videoFeed: {
        flex: 1,
        backgroundColor: "#000",
        width: "100%"
    },
    playground: {
        height: Dimensions.get("window").height * 0.4,
        width: "100%",
        backgroundColor: "#000",
        justifyContent: "space-around",
        flexDirection: 'column',
        alignItems: 'center'
    },
    video_feed: {
        width: "100%",
        height: Dimensions.get("window").height * 0.3,
        justifyContent: "center",
        alignItems: "center"
    },
    video_metadata: {
        width: '100%',
        flex: 1,
        flexDirection: "row",
        gap: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    creator: {
        flexDirection: "column",
        alignItems: "center",
        gap: 5
    },
    videoLists: {
        backgroundColor: "#000",
        paddingBottom: Dimensions.get("window").height * 0.1,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'flex-start'
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
        color: "#fff",
        marginVertical: 2,
        fontSize: 14,
    },
    metadata_title: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold"
    },
    metadata_description: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold"
    },
    controller: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: Dimensions.get("window").height * 0.1,
        backgroundColor: "#000",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 20
    },
    searchbar: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2AB4FA"
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
        color: '#fff'
    },

    // Video playing modal
    videopage: {
        width: "100%",
        height: Dimensions.get('window').height,
        justifyContent: "center",
        backgroundColor: "#000",
        alignItems: "center",
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#000',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
});


const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(Home);