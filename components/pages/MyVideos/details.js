import React, { useEffect, useState, useRef } from 'react';
import { connect } from "react-redux";
import { Text, StyleSheet, Image, View, ScrollView, TouchableOpacity, Dimensions, Platform, TextInput } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Feather, Ionicons, FontAwesome, AntDesign, Entypo } from 'react-native-vector-icons';
import isEmpty from '../../config/is-empty';
import SelectDropdown from "react-native-select-dropdown";
import * as ImagePicker from "expo-image-picker";
import { MultiSelect } from 'react-native-element-dropdown';
import { Video, ResizeMode } from "expo-av";
import { generateVideoThumbnails } from "@rajesh896/video-thumbnails-generator";
import Modal from "react-native-modal";
import { useMediaQuery } from "react-responsive";
import { Country } from "country-state-city";
import axios from 'axios';
import { apiURL } from '../../config/config';

const DATA = [
    { value: '1', label: 'Animation' },
    { value: '2', label: 'Autos & Vehicles' },
    { value: '3', label: 'Beauty & Fashion' },
    { value: '4', label: 'Comedy' },
    { value: '5', label: 'Cooking & Food' },
    { value: '6', label: 'DIY & Crafts' },
    { value: '7', label: 'Documentary' },
    { value: '8', label: 'Education' },
    { value: '9', label: 'Entertainment' },
    { value: '10', label: 'Film & Animation' },
    { value: '11', label: 'Gaming' },
    { value: '12', label: 'Health & Fitness' },
    { value: '13', label: 'How-to & Style' },
    { value: '14', label: 'Kids & Family' },
    { value: '15', label: 'Music' },
    { value: '16', label: 'News & Politics' },
    { value: '17', label: 'Nonprofits & Activism' },
    { value: '18', label: 'People & Blogs' },
    { value: '19', label: 'Pets & Animals' },
    { value: '20', label: 'Science & Technology' },
    { value: '21', label: 'Sports' },
    { value: '22', label: 'Travel & Events' },
    { value: '23', label: 'Unboxing & Reviews' },
    { value: '24', label: 'Blogs' },
];

const Details = (props) => {

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

    const [optionName, setOptionName] = useState("Recent Uploads");
    const [options, setOptions] = useState([
        { id: 1, name: 'Recent Uploads', icon: "list-sharp" },
        { id: 2, name: 'Add a Video', icon: "add-circle" },
    ]);

    const [recentUploads, setRecentUploads] = useState([]);
    const [recentAllUploads, setRecentAllUploads] = useState([]);

    const [isSelectable, setIsSelectable] = useState(false);
    const [location, setLocation] = useState("");
    const [optionlists, setOptionLists] = useState(null);
    const [allData, setAllData] = useState(null);
    const [v_title, setV_title] = useState("");
    const [v_description, setV_description] = useState("");
    const [v_channelName, setV_channelName] = useState("");
    const [v_channelAdmin, setV_channelAdmin] = useState("");
    const [videoKeyword, setVideoKeyword] = useState("");
    const [videoKeywords, setVideoKeywords] = useState([]);
    const tagRef = useRef(null);
    // Video Picker
    const [cameraStatus, requestPermission] = ImagePicker.useCameraPermissions();
    const [videoSrc, setVideoSrc] = useState(null);
    const [file, setFile] = useState({ file: null });
    const video = useRef(null);
    const [status, setStatus] = useState({});
    const [thumbnails, setThumbnails] = useState([]);
    const [channels, setChannels] = useState([{ channelName: "Personal Profile" }]);
    const [selected, setSelected] = useState([]);
    const [searchLocation, setSearchLocation] = useState("");

    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false);

    // video play modal
    const [videoPlayOpened, setVideoPlayOpened] = useState(false);
    const [source, SetSource] = useState();
    const TopVideo = useRef(null);

    const [isOpen, setIsOpen] = useState(-1);
    const [dumpVar, setDumpVar] = useState(-1);

    const changeOptionItem = (itemname) => {
        setOptionName(itemname);
    };

    const cameraOption = () => {
        setOpened(true);
    };

    const renderDataItem = (item) => {
        return (
            <View style={styles.item}>
                <Text style={styles.selectedTextStyle}>{item.label}</Text>
                <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
            </View>
        );
    };

    const addVideoKeyword = (e) => {
        if (e.nativeEvent.key == "Enter") {
            if (videoKeywords.length == 10) {
                alert("Max keywords number is 10 !");
                setVideoKeyword("");
                tagRef.current.focus();
                tagRef.current.blur();
                return;
            } else {
                var tempkeys = videoKeyword.split(/\s*,\s*/);
                if (tempkeys.length + videoKeywords.length > 10) {
                    alert("Max keywords number is 10 !");
                } else {
                    setVideoKeywords(keyword => [...keyword, ...tempkeys]);
                    setVideoKeyword("");
                    tagRef.current.focus();
                    tagRef.current.blur();
                }
            }
        }
    };

    const onFileChange = async (event) => {
        const file = event.target.files[0];
        setFile({ file });
        const url = URL.createObjectURL(file);
        setVideoSrc({ uri: url });
        setOpened(false);
        if (file) {
            try {
                const res = await generateVideoThumbnails(file, 3);
                setThumbnails(res);
            } catch (error) {
                console.log("**************error**********", error);
                window.location.reload();
            }
        }
    };

    const addImageCamera = async () => {
        if (cameraStatus && !cameraStatus.granted) {
            await requestPermission()
        }
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 0.5
        });

        if (result.canceled) {
            return;
        }

        // ImagePicker saves the taken photo to disk and returns a local URI to it
        let localUri = result.assets[0].uri;
        let filename = localUri.split("/").pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `video/${match[1]}` : `video`;

        console.log(localUri, filename, match, type);
    };

    // Reset function
    const resetValues = () => {
        setThumbnails([]);
        setV_title("");
        setV_description("");
        setVideoKeyword("");
        tagRef.current.focus();
        tagRef.current.blur();
        setVideoKeywords([]);
        setSelected([]);
        setVideoSrc(null);
        setV_channelName("");
        setV_channelAdmin("");

        if (Platform.OS === "android") {
            ToastAndroid.show("All values are cleared! Try again!", ToastAndroid.SHORT);
        } else {
            alert("All values are cleared! Try again!");
        }
    };

    const uploadVideo = async () => {
        if (!file.file) {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please upload your video!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                alert("Please upload your video!");
            } else {
                AlertIOS.alert("Please upload your video!");
            }
        } else if (v_title.trim() == "") {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input Video title!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                alert("Please input Video title!");
            } else {
                AlertIOS.alert("Please input Video title!");
            }
        } else if (v_description.trim() == "") {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input Video Description!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                alert("Please input Video Description!");
            } else {
                AlertIOS.alert("Please input Video Description!");
            }
        }
        else if (videoKeywords.length == 0) {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input at least 1 keywords, tags!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                alert("Please input at least 1 keywords, tags!");
            } else {
                AlertIOS.alert("Please input at least 1 keywords, tags!");
            }
        }
        else if (selected.length == 0) {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input at least 1 category!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                alert("Please input at least 1 category!");
            } else {
                AlertIOS.alert("Please input at least 1 category!");
            }
        } else {

            if (v_channelName == "Personal Profile") {
                setLoading(true);

                let cid = "";

                const data = {
                    file: file.file,
                };

                let headers = {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                };
                let formData = new FormData();

                formData.append('video', data.file);
                console.log('video', data.file);

                await axios.post(apiURL + "/api/Upsocial/upload/generate-ipfs", formData, headers)
                    .then(async (response) => {
                        if (response.data.data) {
                            console.log(cid);
                            var arr = thumbnails[0].split(','), mime = arr[0].match(/:(.*?);/)[1],
                                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                            while (n--) {
                                u8arr[n] = bstr.charCodeAt(n);
                            }
                            let img_file = new File([u8arr], `${v_title}.jpg`, { type: mime });

                            let Thumbnail_formData = new FormData();

                            Thumbnail_formData.append('thumbnail', img_file);
                            Thumbnail_formData.append('title', v_title);
                            Thumbnail_formData.append('description', v_description);
                            Thumbnail_formData.append('keywords', videoKeywords);
                            Thumbnail_formData.append('category', selected);
                            Thumbnail_formData.append('userEmail', props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser);
                            Thumbnail_formData.append('video_src', cid);
                            Thumbnail_formData.append('channelName', "Personal Profile");

                            console.log('thumbnail', img_file);
                            console.log('title', v_title);
                            console.log('description', v_description);
                            console.log('keywords', videoKeywords);
                            console.log('category', selected);
                            console.log('userEmail', props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser);
                            console.log('video_src', cid);

                            await axios.post(apiURL + "/api/Upsocial/users/content/web/uploadContent", Thumbnail_formData, headers).then((res) => {
                                if (res.data.status) {
                                    setLoading(false);
                                    resetValues();
                                    alert("Success");
                                    window.location.reload();
                                } else {
                                    setLoading(false);
                                    window.location.reload();
                                }

                            }).catch((err) => {
                                console.log(err);
                                setLoading(false);
                            });
                        } else {
                            console.log(response.data.error);
                            setLoading(false);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        setLoading(false);
                    });

            } else {
                setLoading(true);

                let cid = "";

                const data = {
                    file: file.file,
                };

                let headers = {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                };
                let formData = new FormData();

                formData.append('video', data.file);

                axios.post(apiURL + "/api/Upsocial/upload/generate-ipfs", formData, headers)
                    .then(async (response) => {
                        if (response.data.data) {
                            cid = response.data.data.ipfsUrl;

                            var arr = thumbnails[0].split(','), mime = arr[0].match(/:(.*?);/)[1],
                                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                            while (n--) {
                                u8arr[n] = bstr.charCodeAt(n);
                            }
                            let img_file = new File([u8arr], `${v_title}.jpg`, { type: mime });

                            let Thumbnail_formData = new FormData();

                            Thumbnail_formData.append('thumbnail', img_file);
                            Thumbnail_formData.append('title', v_title);
                            Thumbnail_formData.append('description', v_description);
                            Thumbnail_formData.append('keywords', videoKeywords);
                            Thumbnail_formData.append('userEmail', props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser);
                            Thumbnail_formData.append('video_src', cid);
                            Thumbnail_formData.append('channelAdmin', v_channelAdmin);
                            Thumbnail_formData.append('channelName', v_channelName);
                            Thumbnail_formData.append('category', selected);
                            Thumbnail_formData.append('status', true);

                            await axios.post(apiURL + "/api/Upsocial/uploadContents/channel", Thumbnail_formData, headers).then((res) => {
                                if (res.data.status) {
                                    setLoading(false);
                                    resetValues();
                                    alert("Success");
                                    window.location.reload();
                                } else {
                                    setLoading(false);
                                    window.location.reload();
                                }
                            }).catch((err) => {
                                setLoading(false);
                            });
                        } else {
                            console.log(response.data.error);
                            setLoading(false);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        setLoading(false);
                    });
            }
        }
    };

    const onSearchLocation = (e) => {
        setSearchLocation(e);
        var searchresult = optionlists.filter((item) => {
            return item.name.toLowerCase().indexOf(e.toLowerCase()) > -1 || item.flag.toLowerCase().includes(e.toLowerCase());
        });
        if (e === "") {
            setOptionLists(allData);
        } else {
            setOptionLists(searchresult);
        }
    };

    const watchVideo = (videoData, key) => {
        setVideoPlayOpened(true);
        SetSource({ uri: videoData.ipfsUrl });
    };

    const toggleModal = (keys) => {
        if (dumpVar === keys) {
            setDumpVar(-1);
            setIsOpen(-1);
        } else {
            setDumpVar(keys);
            setIsOpen(keys);
        }
    };


    useEffect(() => {
        axios.post(apiURL + "/api/Upsocial/getAll/channels", {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            const result = res.data.channelData.filter((item) => item.email == props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser);
            setChannels([...channels, ...result]);
        }).catch((err) => {
            console.warn(err);
        });
    }, []);

    useEffect(() => {
        axios.post(apiURL + "/api/Upsocial/getAll/channels", {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            const result = res.data.channelData.filter((item) => item.channelName == props.data.channelName);
            const results = result.filter((item) => !isEmpty(item.contents) && item.contents);
            var arrayP = results.map(o => o.contents);
            var resultVideo = arrayP.flat();
            resultVideo.sort((a, b) => {
                return new Date(b.postDate) - new Date(a.postDate);
            });
            setRecentUploads(resultVideo);
            setRecentAllUploads(resultVideo);
        }).catch((err) => {
            console.warn(err);
        });
    }, [props.data]);

    useEffect(() => {
        const getAllCountries = async () => {
            try {
                let countries = await Country.getAllCountries();
                setOptionLists(countries);
                setAllData(countries);
            } catch (err) {
                console.log(err);
            }
        };
        getAllCountries();
    }, []);

    return (
        <View style={styles.container}>
            {loading && <View style={styles.loadingView}>
                <Image
                    source={require("../../../assets/loading.gif")}
                    style={{ width: 140, height: 140 }}
                />
            </View>}
            <View style={styles.headersection}>
                <View style={styles.subheadersection}>
                    <TouchableOpacity style={styles.headerimage} onPress={() => props.goToHome()}>
                        <Image
                            source={require("../../../assets/logos/logo_wh.png")}
                            style={{ height: 30, width: 158 }}
                        />
                    </TouchableOpacity>
                    <View style={styles.iconsection}>
                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => { props.setflag("main"); props.setLastPageName("channelDetail") }}>
                            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>BACK</Text>
                            <AntDesign name="right" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.optionsView}>
                {options.map((item, key) => {
                    return (
                        <TouchableOpacity key={key} style={optionName === item.name ? styles.active_optionitem : styles.optionitem} onPress={() => changeOptionItem(item.name)}>
                            <Text style={optionName === item.name ? styles.active_optiontext : styles.optiontext}>{item.name}</Text>
                            <Ionicons name={item.icon} size={25} color="#000" />
                        </TouchableOpacity>
                    )
                })}
                {isEmpty(options) && (
                    <View style={styles.nodataContainer}>
                        <Text style={styles.nodata_title}>Your History</Text>
                    </View>
                )}
            </View>
            {optionName == "Recent Uploads" && (
                <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} >
                    {isEmpty(recentUploads) ? (
                        <TouchableOpacity style={styles.nodataContainer}>
                            <Text style={styles.nodata_title}>No Videos yet!</Text>
                            <Text style={styles.nodata_content}>Upload your first video!</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.videoLists}>
                            <View style={styles.feeds_contentview}>
                                {!isEmpty(recentUploads) && recentUploads.map((index, key) => {
                                    if (Number(key + 1) <= Number(Math.ceil(recentUploads.length / 2))) {
                                        return (
                                            <View style={isWide ? styles.wideitemview : isDesktop ? styles.desktopitemview : isTablet ? styles.tabletitemview : isTabletOrMobile ? styles.tabletormobileitemview : styles.mobileitemview} key={key}>
                                                <TouchableOpacity style={{ alignItems: 'center', width: "100%", borderRadius: 10 }} onPress={() => watchVideo(index, key)}>
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
                                                            <TouchableOpacity style={styles.videoplayitem}>
                                                                <TouchableOpacity onPress={() => RemoveVideoToPlaylist(index)}>
                                                                    <Text>Remove</Text>
                                                                </TouchableOpacity>
                                                            </TouchableOpacity>
                                                        </View>

                                                    )}
                                                    <TouchableOpacity onPress={(e) => toggleModal(key)}>
                                                        <Entypo name="dots-three-vertical" color="#000" size={20} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )
                                    }
                                })}
                            </View>
                            <View style={styles.feeds_contentview}>
                                {!isEmpty(recentUploads) && recentUploads.map((index, key) => {
                                    if (Number(key + 1) > Number(Math.ceil(recentUploads.length / 2))) {
                                        return (
                                            <View style={isWide ? styles.wideitemview : isDesktop ? styles.desktopitemview : isTablet ? styles.tabletitemview : isTabletOrMobile ? styles.tabletormobileitemview : styles.mobileitemview} key={key}>
                                                <TouchableOpacity onPress={() => watchVideo(index, key)} style={{ alignItems: 'center', width: "100%", borderRadius: 10 }}>
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
                                                            <TouchableOpacity style={styles.videoplayitem}>
                                                                <TouchableOpacity onPress={() => RemoveVideoToPlaylist(index)}>
                                                                    <Text>Remove</Text>
                                                                </TouchableOpacity>
                                                            </TouchableOpacity>
                                                        </View>

                                                    )}
                                                    <TouchableOpacity onPress={(e) => toggleModal(key)}>
                                                        <Entypo name="dots-three-vertical" color="#000" size={20} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )
                                    }
                                })}
                            </View>
                        </View>)}
                </ScrollView>
            )}
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
            {optionName == "Add a Video" && (<View style={styles.contentsection}>
                <ScrollView style={styles.scrollcontentsection}>
                    <View style={styles.scrollviewcontent}>
                        <View style={styles.mainview}>
                            {videoSrc ? (<Video
                                ref={video}
                                videoStyle={Platform.OS === 'android' || Platform.OS === 'ios' ? { position: "relative", width: Dimensions.get("window").width, height: Dimensions.get("window").height * 0.7, margin: 'auto', maxWidth: 400 } : { position: "relative", width: "100%", height: "100%", margin: 'auto', maxWidth: 400 }}
                                style={styles.videoPreviewer}
                                source={Platform.OS === 'android' || Platform.OS === 'ios' ? videoSrc : videoSrc}
                                isLooping
                                shouldPlay
                                useNativeControls
                                resizeMode={ResizeMode.CONTAIN}
                                onPlaybackStatusUpdate={status => setStatus(() => status)}
                            />) : (
                                <View style={styles.uploadimageview}>
                                    <Text style={styles.uploadimagetext}>Add Or Upload A Video</Text>
                                    <FontAwesome name='camera' color="#000" size={140} />
                                    <TouchableOpacity style={styles.uploadbtnicon} onPress={cameraOption}>
                                        <FontAwesome name='plus-circle' color="#fff" size={34} />
                                    </TouchableOpacity>
                                </View>)}
                            <View style={styles.TextView}>
                                <TextInput placeholder="Title" placeholderTextColor="#adb2b6"
                                    style={styles.TextInput} value={v_title} onChangeText={(e) => setV_title(e)} />
                            </View>
                            <View style={styles.TextView}>
                                <TextInput placeholder="Description" placeholderTextColor="#adb2b6"
                                    style={styles.TextArea} value={v_description} onChangeText={(e) => setV_description(e)} multiline={true} />
                            </View>
                            <View style={styles.TextView}>
                                <TextInput placeholder='Tags' multiline={true} numberOfLines={1} ref={tagRef} placeholderTextColor="#adb2b6" style={styles.TextArea} value={videoKeyword} onKeyPress={(e) => addVideoKeyword(e)} onChangeText={(e) => setVideoKeyword(e)} />
                                <View style={{ flexDirection: "row", gap: 10, width: '100%', flexWrap: "wrap", marginTop: 5 }}>
                                    {videoKeywords.map((index, key) => {
                                        return (
                                            <Text key={key} style={{ color: "#000" }}>{index}</Text>
                                        )
                                    })}
                                </View>
                            </View>
                            <View style={styles.DropView}>
                                <SelectDropdown
                                    data={channels}
                                    onSelect={(selectedItem, index) => {
                                        console.log(selectedItem.channelName);
                                        setV_channelName(selectedItem.channelName);
                                        setV_channelAdmin(selectedItem.email);
                                    }}
                                    defaultButtonText={"Choose Channel"}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return selectedItem.channelName;
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return item.channelName;
                                    }}
                                    buttonStyle={styles.dropdown4BtnStyle}
                                    buttonTextStyle={styles.dropdown4BtnTxtStyle}
                                    renderDropdownIcon={(isOpened) => {
                                        return <View>
                                            <Feather name={!isOpened ? 'chevron-down' : 'chevron-up'} color="#000" size={20} />
                                        </View>
                                    }}
                                    dropdownIconPosition={"right"}
                                    dropdownStyle={styles.dropdown4DropdownStyle}
                                    rowStyle={styles.dropdown4RowStyle}
                                    rowTextStyle={styles.dropdown4RowTxtStyle}
                                />
                                <TouchableOpacity style={styles.DropBtnIcon}>
                                    <MaterialCommunityIcons name='plus-circle-outline' color="#000" size={30} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.Multiview}>
                                <Text style={{ color: "#adb2b6", fontSize: 16, paddingHorizontal: 10 }}>Categories</Text>
                                <MultiSelect
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={DATA}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select"
                                    value={selected}
                                    search
                                    searchPlaceholder="Search..."
                                    onChange={item => {
                                        setSelected(item);
                                    }}
                                    renderItem={renderDataItem}
                                    renderSelectedItem={(item, unSelect) => (
                                        <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                                            <View style={styles.selectedStyle}>
                                                <Text style={styles.textSelectedStyle}>{item.label}</Text>
                                                <AntDesign color="black" name="delete" size={17} />
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                            <View style={styles.inputView}>
                                <TextInput
                                    style={styles.TextInput}
                                    placeholder="Location (City, State)"
                                    placeholderTextColor="#adb2b6"
                                    value={searchLocation}
                                    onChangeText={(e) => onSearchLocation(e)}
                                    onFocus={() => setIsSelectable(true)}
                                />
                                {isSelectable && (
                                    <ScrollView style={{ marginVertical: 5, maxHeight: 300, minHeight: 300 }}>
                                        {optionlists && optionlists.map((item, key) => {
                                            return (
                                                <TouchableOpacity style={{ paddingVertical: 2 }} onPress={() => {
                                                    setLocation(item.name);
                                                    setSearchLocation(item.name);
                                                    setIsSelectable(false)
                                                }} key={key}>
                                                    <Text style={{ color: "#000" }}>
                                                        {item.name}
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </ScrollView>
                                )}
                            </View>
                            <View style={styles.uploadview}>
                                <TouchableOpacity style={styles.uploadviewbtn} onPress={uploadVideo}>
                                    <Text style={{ fontSize: 20, color: "#fff" }}>Upload</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ marginTop: 10 }}>
                                    <Text style={{ fontSize: 14, color: "#000" }}>Clear</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>)}
            <Modal
                isVisible={opened}
                animationIn={'zoomInDown'}
                animationOut={'zoomOutUp'}
                style={{ justifyContent: 'flex-start', margin: 0, }}
                onBackdropPress={() => setOpened(false)}
            >
                <View style={{
                    backgroundColor: '#000',
                    gap: 30,
                    padding: 22,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 4,
                }}
                >
                    <TouchableOpacity style={{ flexDirection: "row", gap: 20, justifyContent: "center", alignItems: "center" }} onPress={addImageCamera}>
                        <Text style={{ color: "#FFF" }}>Record A Video</Text>
                        <Ionicons name="camera-sharp" color="#fff" size={30} />
                    </TouchableOpacity>
                    <label htmlFor="fileuploadinput">
                        <TouchableOpacity style={{ flexDirection: "row", gap: 20, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: "#FFF" }}>Upload A Video</Text>
                            <Ionicons name="md-folder-outline" color="#fff" size={30} />
                        </TouchableOpacity>
                    </label>
                    <input style={{ display: "none" }} type='file' id='fileuploadinput' accept='video/mp4,video/x-m4v,video/*' onChange={onFileChange} />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        position: "relative"
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
    headersection: {
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
    optionsView: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        gap: 50,
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    active_optionitem: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "transparent",
        borderBottomColor: "#000",
    },
    optionitem: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "transparent",
    },
    active_optiontext: {
        color: "#000",
        fontSize: 14,
        fontWeight: "bold"
    },
    optiontext: {
        fontSize: 14,
        color: "rgb(197, 197, 197)",
        fontWeight: "bold"
    },
    contentview: {
        marginHorizontal: 40,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    wideitemview: {
        alignItems: "center",
        width: "20%",
        padding: 10
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
    mobileView: {
        alignItems: "center",
        width: "90%",
        padding: 10,
    },
    mobileitemview: {
        alignItems: "center",
        width: "100%",
        padding: 10,
        position: "relative",
    },
    metadata_title: {
        color: "#000",
        fontSize: 14,
        fontWeight: "bold"
    },
    metadata_description: {
        color: "#000",
        fontSize: 14,
        fontWeight: "bold"
    },
    nodataContainer: {
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    nodata_title: {
        color: "#000",
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 2
    },
    metadata_description: {
        color: "#000",
        fontSize: 14,
        fontWeight: "bold"
    },
    contentsection: {
        marginTop: 60,
        flex: 1,
        width: "100%",
    },
    scrollcontentsection: {
        width: "100%",
        height: "100%",
        paddingVertical: 10
    },
    scrollviewcontent: {
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    mainview: {
        width: "65%",
    },
    uploadimageview: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    uploadimagetext: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 10
    },
    uploadbtnicon: {
        bottom: 20,
        right: "calc(50% - 55px)",
        position: "absolute"
    },
    dropdown4BtnStyle: {
        width: "100%",
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderBottomColor: "#000",
        borderBottomWidth: 1,
    },
    dropdown4BtnTxtStyle: {
        color: "#000",
        textAlign: "left"
    },
    dropdown4DropdownStyle: {
        backgroundColor: "transparent",
        width: "100%",
        height: "100%"
    },
    dropdown4RowStyle: {
        backgroundColor: "#EFEFEF",
        borderBottomColor: "#C5C5C5",
    },
    dropdown4RowTxtStyle: {
        color: "#444",
        textAlign: "left"
    },
    DropView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        width: "100%",
    },
    DropBtnIcon: {
        width: 40,
        justifyContent: "flex-end",
        alignItems: "flex-end"
    },
    // multi element select
    Multiview: {
        flexDirection: "column",
        marginTop: 20,
        width: "100%",
        position: "relative"
    },
    dropdown: {
        width: "100%",
        backgroundColor: 'transparent',
        paddingBottom: 10,
        paddingHorizontal: 10,
        borderBottomColor: "#000",
        borderBottomWidth: 1
    },
    placeholderStyle: {
        fontSize: 20,
        color: "#adb2b6"
    },
    selectedTextStyle: {
        fontSize: 20,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    uploadview: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
        marginBottom: 20,
        width: "100%",
        position: "relative"
    },
    uploadviewbtn: {
        backgroundColor: "#c081ff",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 30
    },
    selectedStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: 'white',
        shadowColor: '#000',
        marginTop: 8,
        marginRight: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    textSelectedStyle: {
        marginRight: 5,
        fontSize: 16,
    },
    videoPreviewer: {
        width: Platform.OS === 'android' || Platform.OS === 'ios' ? Dimensions.get("window").width : '100%',
        height: Dimensions.get("window").height * 0.35
    },
    TextView: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        width: "100%",
        position: "relative"
    },
    TextArea: {
        width: "100%",
        fontSize: 20,
        height: 100,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomColor: "#000",
        borderBottomWidth: 1,
        color: "#000"
    },
    TextInput: {
        width: "100%",
        fontSize: 20,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomColor: "#000",
        borderBottomWidth: 1,
        color: "#000"
    },
    subinputtext: {
        marginHorizontal: 10,
        color: "#fff",
        fontSize: 16,
    },
    videoPlayPage: {
        width: "100%",
        height: Dimensions.get('window').height,
        justifyContent: "center",
        backgroundColor: "#000",
        alignItems: "center",
    },
    videoLists: {
        backgroundColor: "#fff",
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'flex-start'
    },
    emptycontentview: {
        width: "100%",
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    feeds_contentview: {
        width: "50%",
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
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
    },
});

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(Details);