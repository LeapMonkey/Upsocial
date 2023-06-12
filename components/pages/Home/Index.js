import React, { useState, useEffect, useRef } from 'react';
import { connect } from "react-redux";
import { MaterialCommunityIcons, MaterialIcons, Feather, Ionicons, Entypo } from 'react-native-vector-icons';
import {
    Text, StyleSheet, Image, View, ScrollView, TouchableOpacity, Dimensions, Share, TextInput, PanResponder,
    Animated,
} from 'react-native';
import * as Sharing from 'expo-sharing';
import Modal from "react-native-modal";
import { useMediaQuery } from "react-responsive";
import { Video, ResizeMode } from "expo-av";
import isEmpty from '../../config/is-empty';
import { apiURL } from '../../config/config';
import axios from 'axios';
import { SwipeListView } from 'react-native-swipe-list-view';

import { Card } from './Card';

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

const { width, height } = Dimensions.get('window');

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

    const [loading, setLoading] = useState(false);
    const [TopCardVideo, setTopCards] = useState(null);

    const setTopCardVideo = (param) => {
        setTopCards(param);
    };

    const [categoryName, setCategoryName] = useState("NEWEST");
    const [result, setResult] = useState([]);
    const [modalResult, setModalResult] = useState([]);
    const [allData, setAllData] = useState([]);
    const [limit, setLimit] = useState(10);
    const [searchflag, setSearchflag] = useState(false);
    const [searchtext, setSearchtext] = useState("");
    // Video config
    const PlayingVideo = useRef(null);
    const [status, setStatus] = useState({});
    const [videoSource, SetVideoSource] = useState({ uri: "" });
    const [thumbnail, setThumbnail] = useState({ uri: "" });
    const [isChannel, setIsChannel] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

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
    const [isOpen, setIsOpen] = useState(-1);
    const [dumpVar, setDumpVar] = useState(-1);

    // Playlist
    const [playlist, setPlaylist] = useState([]);
    const [userName, setUserName] = useState("");

    const addVideoToPlaylist = (playlistdata, videodata) => {
        setLoading(true);

        const data = {
            userEmail: props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser,
            playlistTitle: playlistdata.title,
            creatorEmail: playlistdata.userEmail,
            ID: videodata.ID,
            title: videodata.title,
            description: videodata.description,
            keywords: videodata.keyword,
            category: videodata.category,
            video_src: videodata.ipfsUrl,
            thumbnail: videodata.thumbnail,
            status: videodata.status,
            postDate: videodata.postDate,
            liked: videodata.liked,
            shared: videodata.shared,
            disliked: videodata.disliked,
            watched: videodata.watched,
            comments: videodata.comments,
            followers: videodata.followers
        }

        axios.post(apiURL + "/api/Upsocial/playlist/addVideo", data, {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            if (res.data.status) {
                alert(res.data.msg);
                setLoading(false);
            } else {
                alert(res.data.msg);
                setLoading(false);
            }
        }).catch((err) => {
            console.warn(err);
            setLoading(false);
        });
    }

    const toggleModal = (keys) => {
        if (dumpVar === keys) {
            setDumpVar(-1);
            setIsOpen(-1);
        } else {
            setDumpVar(keys);
            setIsOpen(keys);
        }
    }

    const changeCategoryItem = (itemname) => {
        setCategoryName(itemname);
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
                    if (resultVideo[0].channelName == "Personal Profile") {
                        if ((resultVideo[0].email).includes("@")) {
                            axios.post(apiURL + "/api/Upsocial/admin/getUsers",
                                { userEmail: resultVideo[0].email },
                                {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*'
                                }).then((res) => {
                                    setIsChannel(resultVideo[0].channelName);
                                    if (res.data.data.photo) {
                                        setThumbnail({ uri: res.data.data.photo });
                                    }
                                    if (res.data.data.username) {
                                        setUserName(res.data.data.username);
                                    }
                                }).catch((err) => console.warn(err));
                        } else {
                            setUserName(resultVideo[0].email);
                            setIsChannel(resultVideo[0].channelName);
                        }
                    } else {
                        axios.post(apiURL + "/api/Upsocial/getAll/channels", {
                            "Access-Control-Allow-Origin": "*",
                            'Access-Control-Allow-Headers': '*',
                        }).then((res) => {
                            let result = res.data.channelData.filter((item) => item.email == (props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser));
                            let resultChannel = result.filter(obj => obj["channelName"] === resultVideo[0].channelName);
                            setIsChannel(resultVideo[0].channelName);
                            if (resultChannel[0].photo) {
                                setThumbnail({ uri: resultChannel[0].photo });
                            }
                            if (resultChannel[0].channelName) {
                                setUserName(resultChannel[0].channelName);
                            }
                        }).catch((err) => {
                            console.warn(err);
                        });
                    }
                    setResult(resultVideo);
                    setModalResult(resultVideo);
                    setAllData(resultVideo);
                    SetVideoSource({ uri: resultVideo[0].ipfsUrl });
                    setTitle(resultVideo[0].title);
                    setDescription(resultVideo[0].description);
                }).catch((err) => {
                    console.warn(err);
                });
            }).catch((err) => {
                console.warn(err);
            });
        } else if (itemname == "FOR ME") {
            axios.post(apiURL + "/api/Upsocial/users/personalize", { userEmail: props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser }, {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
            }).then((res) => {
                setResult(res.data.feeds);
                setModalResult(res.data.feeds);
                setAllData(res.data.feeds);
            }).catch((err) => {
                console.warn(err);
            });
        } else if (itemname == "SUBSCRIPTIONS") {
            axios.post(apiURL + "/api/Upsocial/getAll/channels", {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
            }).then((res) => {
                const result = res.data.channelData.filter((item) => item.followers.includes(props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser));
                var arrayP = result.map(o => o.contents);
                var videofeeds = Object.values(arrayP.reduce(((r, c) => Object.assign(r, c)), {}));
                setResult(videofeeds);
                setModalResult(videofeeds);
                setAllData(videofeeds);
            }).catch((err) => {
                console.warn(err);
            });
        } else {
            axios.post(apiURL + "/api/Upsocial/users/get/UploadedContent/Category", { categoryName: itemname }, {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
            }).then((res) => {
                if (!isEmpty(res.data.data)) {
                    res.data.data.sort((a, b) => {
                        return new Date(b.postDate) - new Date(a.postDate);
                    });
                    if (res.data.data[0].channelName == "Personal Profile") {
                        setIsChannel(res.data.data[0].channelName);
                        if ((res.data.data[0].email).includes("@")) {
                            axios.post(apiURL + "/api/Upsocial/admin/getUsers",
                                { userEmail: res.data.data[0].email },
                                {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*'
                                }).then((response) => {
                                    if (response.data.data.photo) {
                                        setThumbnail({ uri: response.data.data.photo });
                                    }
                                    if (res.data.data.username) {
                                        setUserName(response.data.data.username);
                                    }
                                }).catch((err) => console.warn(err));
                        } else {
                            setUserName(res.data.data[0].email);
                        }
                    } else {
                        axios.post(apiURL + "/api/Upsocial/getAll/channels", {
                            "Access-Control-Allow-Origin": "*",
                            'Access-Control-Allow-Headers': '*',
                        }).then((resp) => {
                            let result = resp.data.channelData.filter((item) => item.email == (props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser));
                            let resultChannel = result.filter(obj => obj["channelName"] === res.data.data[0].channelName);
                            setIsChannel(res.data.data[0].channelName);
                            if (resultChannel[0].photo) {
                                setThumbnail({ uri: resultChannel[0].photo });
                            }
                            if (resultChannel[0].channelName) {
                                setUserName(resultChannel[0].channelName);
                            }
                        }).catch((err) => {
                            console.warn(err);
                        });
                    }
                    setResult(res.data.data);
                    setModalResult(res.data.data);
                    setAllData(res.data.data);
                    SetVideoSource({ uri: res.data.data[0].ipfsUrl });
                    setTitle(res.data.data[0].title);
                    setDescription(res.data.data[0].description);
                }
            }).catch((err) => {
                console.warn(err);
            })

        }
    };

    const setCurrentVideoData = (item) => {
        setTitle(item.title);
        setDescription(item.description);
        SetVideoSource({ uri: item.ipfsUrl });
        if (item.channelName == "Personal Profile") {
            if ((item.email).includes("@")) {
                axios.post(apiURL + "/api/Upsocial/admin/getUsers",
                    { userEmail: item.email },
                    {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }).then((res) => {
                        setIsChannel(item.channelName);
                        if (res.data.data.photo) {
                            setThumbnail({ uri: res.data.data.photo });
                        }
                        if (res.data.data.username) {
                            setUserName(res.data.data.username);
                        }
                    }).catch((err) => console.warn(err));
            } else {
                setUserName(item.email);
            }
        } else {
            axios.post(apiURL + "/api/Upsocial/getAll/channels", {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
            }).then((res) => {
                let result = res.data.channelData.filter((item) => item.email == (props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser));
                let resultChannel = result.filter(obj => obj["channelName"] === item.channelName);
                setIsChannel(item.channelName);
                if (resultChannel[0].photo) {
                    setThumbnail({ uri: resultChannel[0].photo });
                }
                if (resultChannel[0].channelName) {
                    setUserName(resultChannel[0].channelName);
                }
            }).catch((err) => {
                console.warn(err);
            });
        }
    };

    const watchVideo = (videoData, keys) => {
        setVideoId(videoData.ID);
        const indexNum = modalResult.indexOf(videoData);
        var arraytems = modalResult;
        arraytems.splice(indexNum, 1);
        arraytems.push(videoData);
        setModalResult(arraytems);
        setOpened(true);
        setVideoProps(videoData);
        SetSource({ uri: videoData.ipfsUrl });
        setCurIndex(keys);
    };

    const ShareFile = async (url) => {
        // console.log(url)
        // Share.share({
        //     message: url.toString()
        // }).then((res) => {
        //     console.log(res);
        // }).catch((err) => console.log(err));
        // if (!(await Sharing.isAvailableAsync())) {
        //     alert(`Uh oh, sharing isn't available on your platform`);
        //     return;
        // }

        // Sharing.shareAsync(url);

        Sharing.shareAsync({
            url: url,
            mimeType: 'Video/.mp4',
            dialogTitle: 'Share your file',
            UTI: 'public.jpeg',
        });
    }

    const onSearch = (e) => {
        setSearchtext(e);
        var searchresult = result.filter((item) => {
            return item.title.toLowerCase().indexOf(e.toLowerCase()) > -1 || item.keyword.toLowerCase().includes(e.toLowerCase());
        });
        if (e === "") {
            setResult(allData);
            setModalResult(allData);
        } else {
            setResult(searchresult);
            setModalResult(searchresult);
        }
    }

    const videosHandle = async (index, key) => {
        await axios.post(apiURL + "/api/Upsocial/users/content/setHistory",
            {
                curUser: props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser,
                ID: index.ID,
                category: index.category,
                comments: index.comments,
                description: index.description,
                disliked: index.disliked,
                email: index.email,
                followers: index.followers,
                ipfsUrl: index.ipfsUrl,
                keyword: index.keyword,
                liked: index.liked,
                postDate: index.postDate,
                shared: index.shared,
                status: index.status,
                thumbnail: index.thumbnail,
                title: index.title,
                watched: index.watched
            },
            {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
            }).then((res) => {
                // console.log(res.data);
            }).catch((err) => {
                console.warn(err);
            });
        setCurrentVideoData(index);
        watchVideo(index, key);
    };

    const handleReaction = async (e) => {
        if (e.value < -300 && confirm("You DisLike this video") == true) {
            if (curIndex == result.length - 1) {
                SetSource({ uri: result[0].ipfsUrl });
                setVideoId(0);
                setCurIndex(0);
                await axios.post(apiURL + "/api/Upsocial/users/content/dislike", { videoId: videoId, userEmail: props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser }, {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                }).then((res) => {
                    // console.log(res.data);
                }).catch((err) => {
                    console.warn(err);
                });
                await axios.post(apiURL + "/api/Upsocial/content/dislike", { videoId: videoId, userEmail: props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser }, {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                }).then((res) => {
                    // console.log(res.data);
                }).catch((err) => {
                    console.warn(err);
                });
                return;
            } else {
                SetSource({ uri: result[curIndex + 1].ipfsUrl });
                setVideoId(curIndex + 1);
                setCurIndex(curIndex + 1);
                await axios.post(apiURL + "/api/Upsocial/users/content/dislike", { videoId: videoId, userEmail: props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser }, {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                }).then((res) => {
                    // console.log(res.data);
                }).catch((err) => {
                    console.warn(err);
                });
                await axios.post(apiURL + "/api/Upsocial/content/dislike", { videoId: videoId, userEmail: props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser }, {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                }).then((res) => {
                    // console.log(res.data);
                }).catch((err) => {
                    console.warn(err);
                });
                return;
            }
        } else if (e.value > 300 && confirm("You Like this video") == true) {
            if (curIndex == result.length - 1) {
                SetSource({ uri: result[0].ipfsUrl });
                setVideoId(0);
                setCurIndex(0);
                await axios.post(apiURL + "/api/Upsocial/users/content/like", { videoId: videoId, userEmail: props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser }, {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                }).then((res) => {
                    // console.log(res.data);
                }).catch((err) => {
                    console.warn(err);
                });
                await axios.post(apiURL + "/api/Upsocial/content/like", { videoId: videoId, userEmail: props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser }, {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                }).then((res) => {
                    // console.log(res.data);
                }).catch((err) => {
                    console.warn(err);
                });
                return;
            } else {
                SetSource({ uri: result[curIndex + 1].ipfsUrl });
                setVideoId(curIndex + 1);
                setCurIndex(curIndex + 1);
                await axios.post(apiURL + "/api/Upsocial/users/content/like", { videoId: videoId, userEmail: props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser }, {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                }).then((res) => {
                    // console.log(res.data);
                }).catch((err) => {
                    console.warn(err);
                });
                await axios.post(apiURL + "/api/Upsocial/content/like", { videoId: videoId, userEmail: props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser }, {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                }).then((res) => {
                    // console.log(res.data);
                }).catch((err) => {
                    console.warn(err);
                });
                return;
            }
        }
    };

    const nextCard = () => {
        setVideoId(videoId);
        TopCardVideo.current.pauseAsync();
    };

    const MoveTo = (channelOrPerson) => {
        if (channelOrPerson === "Personal Profile") {
            props.navigation.navigate("Profile");
        } else {
            props.navigation.navigate("My Videos");
            localStorage.setItem("channelName", channelOrPerson);
        }
    };

    useEffect(() => {
        axios.post(apiURL + "/api/Upsocial/getAll/playlist", {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            // const WatchLater = {
            //     createdDate: new Date(),
            //     description: "Watch Later",
            //     title: "Watch Later",
            //     userEmail: props.auth.user.curUser ? props.auth.user.curUser : localStorage.getItem("isUser"),
            //     feeds: [],
            //     image: "https://g.upsocial.com/ipfs/QmTdpgTimmqySennryQsfp2b56H4QwqF6JZULHYgxK7txp"
            // };
            if (res.data.PlaylistData) {
                res.data.PlaylistData.sort((a, b) => {
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                let result = res.data.PlaylistData.filter((item) => item.userEmail == (props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser));
                setPlaylist(result);
            }
        }).catch((err) => {
            console.warn(err);
        });
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
                    if (resultVideo[0].channelName == "Personal Profile") {
                        if ((resultVideo[0].email).includes("@")) {
                            axios.post(apiURL + "/api/Upsocial/admin/getUsers",
                                { userEmail: resultVideo[0].email },
                                {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*'
                                }).then((res) => {
                                    setIsChannel(resultVideo[0].channelName);
                                    if (res.data.data.photo) {
                                        setThumbnail({ uri: res.data.data.photo });
                                    }
                                    if (res.data.data.username) {
                                        setUserName(res.data.data.username);
                                    }
                                }).catch((err) => console.warn(err));
                        } else {
                            setUserName(resultVideo[0].email);
                        }
                    } else {
                        axios.post(apiURL + "/api/Upsocial/getAll/channels", {
                            "Access-Control-Allow-Origin": "*",
                            'Access-Control-Allow-Headers': '*',
                        }).then((res) => {
                            let result = res.data.channelData.filter((item) => item.email == (props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser));
                            let resultChannel = result.filter(obj => obj["channelName"] === resultVideo[0].channelName);
                            setIsChannel(resultVideo[0].channelName);
                            if (resultChannel[0].photo) {
                                setThumbnail({ uri: resultChannel[0].photo });
                            }
                            if (resultChannel[0].channelName) {
                                setUserName(resultChannel[0].channelName);
                            }
                        }).catch((err) => {
                            console.warn(err);
                        });
                    }
                    setResult(resultVideo);
                    setModalResult(resultVideo);
                    setAllData(resultVideo);
                    SetVideoSource({ uri: resultVideo[0].ipfsUrl });
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

    return (
        <View style={styles.main}>
            <Modal
                isVisible={opened}
                animationIn={'zoomInDown'}
                animationOut={'zoomOutUp'}
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
                    <View style={{ height: Dimensions.get("window").height, width: width }}>
                        <Text>{videoId}</Text>
                        {!isEmpty(modalResult) && modalResult.map((profile, key) => {
                            return (
                                <Card setTopCardVideos={setTopCardVideo} key={key} profile={profile} keys={key} onSwipeOff={nextCard} />
                            )
                        })}
                    </View>
                </View>
            </Modal>
            {loading && <View style={styles.loadingView}>
                <Image
                    source={require("../../../assets/loading.gif")}
                    style={{ width: 140, height: 140 }}
                />
            </View>}
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
                <ScrollView horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}>
                    {items.map((item, key) => {
                        return (
                            <TouchableOpacity key={key} style={categoryName === item.name ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem(item.name)}>
                                <Text style={categoryName === item.name ? styles.active_categorytext : styles.categorytext}>{item.name}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            </View>
            <ScrollView style={styles.scrollview} showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
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
                            <TouchableOpacity style={styles.creator} onPress={() => MoveTo(isChannel)}>
                                {!isEmpty(thumbnail.uri) ? (<Image source={thumbnail} style={{ height: 50, width: 80 }} />) : (<Image source={require("../../../assets/logos/preview.png")} style={{ height: 30, width: 30 }} />)}
                                <Text style={{ color: "#fff", fontWeight: "bold" }}>{userName}</Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1, flexDirection: "column", gap: 10 }}>
                                <Text style={{ color: "#fff", fontWeight: "bold" }}>{title}</Text>
                                <Text style={{ color: "#5a5a5a", fontWeight: "bold" }}>0 views | 0 UPs | just now</Text>
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
                                        <View style={isWide ? styles.wideitemview : isDesktop ? styles.desktopitemview : isTablet ? styles.tabletitemview : isTabletOrMobile ? styles.tabletormobileitemview : styles.mobileitemview} key={key}
                                        >
                                            <TouchableOpacity style={{ alignItems: 'center', width: "100%", borderRadius: 10 }} onPress={() => videosHandle(index, key)}>
                                                <img src={index.thumbnail} style={{ width: "100%", borderRadius: 10 }} />
                                                <Image source={require("../../../assets/logos/playvideo.png")} style={{ width: 50, height: 50, position: "absolute", top: "40%" }} />
                                            </TouchableOpacity>
                                            <View style={styles.maincontentview}>
                                                <View style={{ width: "100%" }}>
                                                    <Text style={styles.metadata_title}>{index.title}</Text>
                                                    <Text style={styles.metadata_description}>{index.description}</Text>
                                                </View>
                                                {isOpen == key && (
                                                    <View style={styles.videoplaylistview}>
                                                        {!isEmpty(playlist) && playlist.map((item, key) => {
                                                            return (
                                                                <TouchableOpacity style={styles.videoplayitem} key={key} >
                                                                    <TouchableOpacity onPress={() => addVideoToPlaylist(item, index)}>
                                                                        <Text>{item.title}</Text>
                                                                    </TouchableOpacity>
                                                                </TouchableOpacity>
                                                            )
                                                        })}
                                                    </View>
                                                )}
                                                <TouchableOpacity onPress={(e) => toggleModal(key)}>
                                                    <Entypo name="dots-three-vertical" color="#fff" size={20} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                }
                            })}
                        </View>
                        <View style={styles.contentview}>
                            {!isEmpty(result) && result.map((index, key) => {
                                if (Number(key + 1) > Number(Math.ceil(result.length / 2))) {
                                    return (
                                        <View style={isWide ? styles.wideitemview : isDesktop ? styles.desktopitemview : isTablet ? styles.tabletitemview : isTabletOrMobile ? styles.tabletormobileitemview : styles.mobileitemview} key={key}>
                                            <TouchableOpacity onPress={() => videosHandle(index, key)} style={{ alignItems: 'center', width: "100%", borderRadius: 10 }}>
                                                <img src={index.thumbnail} style={{ width: "100%", borderRadius: 10 }} />
                                                <Image source={require("../../../assets/logos/playvideo.png")} style={{ width: 50, height: 50, position: "absolute", top: "40%" }} />
                                            </TouchableOpacity>
                                            <View style={styles.maincontentview}>
                                                <View style={{ width: "100%" }}>
                                                    <Text style={styles.metadata_title}>{index.title}</Text>
                                                    <Text style={styles.metadata_description}>{index.description}</Text>
                                                </View>
                                                {isOpen === key && (
                                                    <View style={styles.videoplaylistview}>
                                                        {!isEmpty(playlist) && playlist.map((item, key) => {
                                                            return (
                                                                <TouchableOpacity style={styles.videoplayitem} key={key} >
                                                                    <TouchableOpacity onPress={() => addVideoToPlaylist(item, index)}>
                                                                        <Text>{item.title}</Text>
                                                                    </TouchableOpacity>
                                                                </TouchableOpacity>
                                                            )
                                                        })}
                                                    </View>
                                                )}
                                                <TouchableOpacity onPress={(e) => toggleModal(key)}>
                                                    <Entypo name="dots-three-vertical" color="#fff" size={20} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
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
    card: {
        position: 'absolute',
        width: width,
        height: height,
        overflow: 'hidden',
        backgroundColor: '#000',
        margin: 10,
        borderWidth: 0,
        borderColor: 'lightgrey',
        borderRadius: 8,
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
        height: Dimensions.get("window").height * 0.1,
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
        fontWeight: "bold",
        textAlign: "left"
    },
    metadata_description: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "left"
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
    maincontentview: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        position: "relative"
    },
    videoplaylistview: {
        position: "absolute",
        bottom: 30,
        right: 40,
        flexDirection: "column",
        backgroundColor: "#fff",
        borderRadius: 5
    },
    videoplayitem: {
        paddingVertical: 8,
        paddingHorizontal: 15
    }
});


const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(Home);