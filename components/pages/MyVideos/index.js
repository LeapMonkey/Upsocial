import React, { useState, useEffect, useRef } from 'react';
import { connect } from "react-redux";
import { MaterialCommunityIcons, MaterialIcons, Feather, Ionicons, FontAwesome, AntDesign, Entypo } from 'react-native-vector-icons';
import {
    Text, StyleSheet, Image, View, ScrollView, TouchableOpacity, Dimensions,
    Platform, TextInput
} from 'react-native';
import SelectDropdown from "react-native-select-dropdown";
import Modal from "react-native-modal";
import { MultiSelect } from 'react-native-element-dropdown';
import { useMediaQuery } from "react-responsive";
import { Video, ResizeMode } from "expo-av";
import { generateVideoThumbnails } from "@rajesh896/video-thumbnails-generator";
import isEmpty from '../../config/is-empty';
import { apiURL } from '../../config/config';
import axios from 'axios';
import UploadChannel from '../upload/UploadChannel';
import * as ImagePicker from "expo-image-picker";

const items = [
    { id: 1, name: 'CHANNELS' },
    { id: 2, name: 'RECENT UPLOADS' },
    { id: 3, name: 'HISTORY' },
];

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
    { value: '14', label: 'Kvalues ' & ' Family' },
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


const MyVideos = (props) => {
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

    const [categoryName, setCategoryName] = useState("CHANNELS");
    const [optionName, setOptionName] = useState("My Channels");
    const [result, setResult] = useState([]);
    const [channelAllData, setChannelAllData] = useState([]);
    const [recentUploads, setRecentUploads] = useState([]);
    const [recentAllUploads, setRecentAllUploads] = useState([]);
    const [limit, setLimit] = useState(5);
    const [searchflag, setSearchflag] = useState(false);
    const [searchtext, setSearchtext] = useState("");

    const [channels, setChannels] = useState([{ channelName: "Personal Profile" }]);

    const [selected, setSelected] = useState([]);

    const [options, setOptions] = useState([
        { id: 1, name: 'My Channels', icon: "list-sharp" },
        { id: 2, name: 'Add a Channel', icon: "add-circle" },
    ]);

    const [isSelectable, setIsSelectable] = useState(false);

    const [scrollVal, setScrollVal] = useState(0);
    const [viewVal, setViewVal] = useState(0);

    const [optionlists, setOptionLists] = useState(null);

    // add a channel

    const [channelName, setChannelName] = useState("");
    const [handleUrl, setHandleUrl] = useState("");
    const [aboutChannel, setAboutChannel] = useState("");
    const [location, setLocation] = useState("");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadimagedata, setUploadimagedata] = useState(null);
    const [keyword, setKeyword] = useState("");
    const [keywords, setKeywords] = useState([]);

    // Video Data
    const [videoKeyword, setVideoKeyword] = useState("");
    const [videoKeywords, setVideoKeywords] = useState([]);

    const [v_title, setV_title] = useState("");
    const [v_description, setV_description] = useState("");
    const [v_channelName, setV_channelName] = useState("");
    const [v_channelAdmin, setV_channelAdmin] = useState("");
    // End

    // Video Picker
    const [cameraStatus, requestPermission] = ImagePicker.useCameraPermissions();
    const [videoSrc, setVideoSrc] = useState(null);
    const [file, setFile] = useState({ file: null });
    const video = useRef(null);
    const [status, setStatus] = useState({});
    const [thumbnails, setThumbnails] = useState([]);

    const [opened, setOpened] = useState(false);

    const changeCategoryItem = (itemname) => {
        setCategoryName(itemname);
        if (itemname == 'CHANNELS') {
            setOptions([
                { id: 1, name: 'My Channels', icon: "list-sharp" },
                { id: 2, name: 'Add a Channel', icon: "add-circle" },
            ]);
            setOptionName('My Channels');
        } else if (itemname == 'RECENT UPLOADS') {
            setOptions([
                { id: 1, name: 'Recent Uploads', icon: "list-sharp" },
                { id: 2, name: 'Add a Video', icon: "add-circle" },
            ]);
            setOptionName('Recent Uploads');
        } else {
            setOptions([]);
        }
    };

    const onSearch = (e) => {
        setSearchtext(e);
        if (categoryName == "CHANNELS" && optionName == "My Channels") {
            var searchresult = result.filter((item) => {
                return item.channelName.toLowerCase().indexOf(e.toLowerCase()) > -1;
            });
            if (e === "") {
                setResult(channelAllData);
            } else {
                setResult(searchresult);
            }
        } else if (categoryName == "RECENT UPLOADS" && optionName == "Recent Uploads") {
            var searchresult = recentUploads.filter((item) => {
                return item.title.toLowerCase().indexOf(e.toLowerCase()) > -1 || item.keyword.toLowerCase().includes(e.toLowerCase());
            });
            if (e === "") {
                setRecentUploads(recentAllUploads);
            } else {
                setRecentUploads(searchresult);
            }

        }
    };

    const changeOptionItem = (itemname) => {
        setOptionName(itemname);
        if (itemname === "My Channels") {
            axios.post(apiURL + "/api/Upsocial/getAll/channels", {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
            }).then((res) => {
                let result = res.data.channelData.filter((item) => item.email == props.auth.user.curUser);
                let feeds = result.reverse();
                setResult(feeds);
                setChannelAllData(feeds);
            }).catch((err) => {
                console.warn(err);
            });
        }
    };

    const channelDetail = async (index) => {
        props.setflag("detail");
        props.setChannelData(index);
    };

    const addChannel = () => {
        setCategoryName("CHANNELS");
        setOptionName("Add a Channel");
        setOptions([
            { id: 1, name: 'My Channels', icon: "list-sharp" },
            { id: 2, name: 'Add a Channel', icon: "add-circle" },
        ]);
    };

    const setimagefunc = (imagedata) => {
        setUploadimagedata(imagedata);
    };

    const addKeyword = (e) => {
        if (e.nativeEvent.key == "Enter") {
            if (keywords.length == 10) {
                alert("Max keywords number is 10 !");
                setKeyword("");
                return;
            } else {
                var tempkeys = keyword.split(/\s*,\s*/);
                if (tempkeys.length + keywords.length > 10) {
                    alert("Max keywords number is 10 !");
                } else {
                    setKeywords(keywords => [...keywords, ...tempkeys]);
                    setKeyword("");
                }
            }
        }
    };

    const addVideoKeyword = (e) => {
        if (e.nativeEvent.key == "Enter") {
            if (videoKeywords.length == 10) {
                alert("Max keywords number is 10 !");
                setVideoKeyword("");
                return;
            } else {
                var tempkeys = videoKeyword.split(/\s*,\s*/);
                if (tempkeys.length + videoKeywords.length > 10) {
                    alert("Max keywords number is 10 !");
                } else {
                    setVideoKeywords(keyword => [...keyword, ...tempkeys]);
                    setVideoKeyword("");
                }
            }
        }
    };

    const uploadData = async () => {
        if (uploadimagedata === null) {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please select Image!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                alert("Please select image!");
            } else {
                AlertIOS.alert("Please select image!");
            }
        } else if (channelName.trim() === "") {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input Channel Name!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                alert("Please input Channel Name!");
            } else {
                AlertIOS.alert("Please Channel Name!");
            }
        } else if (handleUrl.trim() === "") {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input handle Url!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                alert("Please input handle Url!");
            } else {
                AlertIOS.alert("Please handle Url!");
            }
        } else if (aboutChannel.trim() === "") {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input description!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                alert("Please input description!");
            } else {
                AlertIOS.alert("Please input description!");
            }
        } else if (location.trim() === "") {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input location!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                alert("Please input location!");
            } else {
                AlertIOS.alert("Please input location!");
            }
        } else if (keywords.length == 0) {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input at least 1 tag!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                alert("Please input at least 1 tag!");
            } else {
                AlertIOS.alert("Please input at least 1 tag!");
            }
        } else if (url.trim() === "") {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input url!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                alert("Please input url!");
            } else {
                AlertIOS.alert("Please input url!");
            }
        } else {
            setLoading(true);
            let formdata = new FormData();
            formdata.append("userEmail", props.auth.user.curUser);
            formdata.append("photo", uploadimagedata);
            formdata.append("channelName", channelName);
            formdata.append("handleUrl", handleUrl);
            formdata.append("aboutChannel", aboutChannel);
            formdata.append("location", location);
            formdata.append("tags", keywords);
            formdata.append("url", url);

            const headers = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            };

            await axios.post(apiURL + "/api/Upsocial/create/channel", formdata, headers).then((res) => {
                if (res.data.status) {
                    setLoading(false);
                    alert("Creating Channel success !");
                    setOptionName("My Channels");
                } else {
                    setLoading(false);
                    alert(res.data.msg);
                }
            }).catch((error) => {
                console.log(error);
                setLoading(false);
            });
        }
    };

    // Reset function
    const resetValues = () => {
        setThumbnails([]);
        setV_title("");
        setV_description("");
        setVideoKeyword("");
        setVideoKeywords([]);
        setSelected([]);
        setVideoSrc(null);
        setV_channelName("");
        setV_channelAdmin("");
        setLocation("");
        setKeyword("");
        setKeywords([]);

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
        } else if (videoKeywords.length == 0) {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input at least 1 keywords, tags!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                alert("Please input at least 1 keywords, tags!");
            } else {
                AlertIOS.alert("Please input at least 1 keywords, tags!");
            }
        } else if (selected.length == 0) {
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
                            Thumbnail_formData.append('userEmail', props.auth.user.curUser);
                            Thumbnail_formData.append('video_src', cid);

                            console.log('thumbnail', img_file);
                            console.log('title', v_title);
                            console.log('description', v_description);
                            console.log('keywords', videoKeywords);
                            console.log('category', selected);
                            console.log('userEmail', props.auth.user.curUser);
                            console.log('video_src', cid);

                            await axios.post(apiURL + "/api/Upsocial/users/content/web/uploadContent", Thumbnail_formData, headers).then((res) => {
                                if (res.data.status) {
                                    setLoading(false);
                                    resetValues();
                                    alert("Success");
                                } else {
                                    setLoading(false);
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
                            Thumbnail_formData.append('userEmail', props.auth.user.curUser);
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
                                } else {
                                    setLoading(false);
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

    const renderDataItem = (item) => {
        return (
            <View style={styles.item}>
                <Text style={styles.selectedTextStyle}>{item.label}</Text>
                <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
            </View>
        );
    };

    const cameraOption = () => {
        setOpened(true);
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

    const onFileChange = (event) => {
        const file = event.target.files[0];
        setFile({ file });
        const url = URL.createObjectURL(file);
        setVideoSrc({ uri: url });
        if (file) {
            generateVideoThumbnails(file, 0).then((res) => {
                setThumbnails(res);
            }).catch((err) => console.log(err));
        }
    };

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

    useEffect(() => {
        fetch("http://api.geonames.org/searchJSON?q=" + location + "&maxRows=10&username=secretsuperdev")
            .then(response => response.json())
            .then(data => {
                var fakeoptionlists = [];
                // iterate through the data and add each location to the datalist
                data.geonames.forEach(location => {
                    fakeoptionlists.push(location.name);
                });
                setOptionLists(fakeoptionlists);
            })
            .catch(err => console.log(err));
    }, [location]);

    useEffect(() => {
        axios.post(apiURL + "/api/Upsocial/getAll/channels", {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            let result = res.data.channelData.filter((item) => item.email == props.auth.user.curUser);
            let feeds = result.reverse();
            setResult(feeds);
            setChannelAllData(feeds);
            setChannels([...channels, ...res.data.channelData]);
        }).catch((err) => {
            console.warn(err);
        });
    }, [optionName]);

    useEffect(() => {
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
                setRecentUploads(resultVideo);
                setRecentAllUploads(resultVideo);
                setLoading(false);
            }).catch((err) => {
                console.warn(err);
            });
        }).catch((err) => {
            console.warn(err);
            setLoading(false);
        });
    }, [limit]);

    return (
        <View style={styles.main}>
            {loading && <View style={styles.loadingView}>
                <Image
                    source={require("../../../assets/loading.gif")}
                    style={{ width: 140, height: 140 }}
                />
            </View>}
            <View style={styles.headersection}>
                <View style={styles.subheadersection}>
                    <View style={styles.headerimage}>
                        <Image
                            source={require("../../../assets/logos/logo_wh.png")}
                            style={{ height: 30, width: 158 }}
                        />
                    </View>
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
                        <TouchableOpacity style={styles.iconbtn} onPress={() => props.toggle()}>
                            <Feather name="menu" color="#fff" size={35} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {searchflag && <View style={styles.searchbar}>
                <TextInput placeholder="search by title & Tags" placeholderTextColor="#fff"
                    style={styles.SearchTextInput} value={searchtext} onChangeText={(e) => onSearch(e)} />
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
            {categoryName == "CHANNELS" && optionName == "My Channels" && (<View style={styles.feedsContainer}>
                <ScrollView style={styles.scrollview}>
                    <View style={styles.contentview}>
                        {result && result.map((index, key) => {
                            return (
                                <TouchableOpacity key={key} style={isWide ? styles.wideitemview : isDesktop ? styles.desktopitemview : isTablet ? styles.tabletitemview : isTabletOrMobile ? styles.tabletormobileitemview : styles.mobileitemview} >
                                    <TouchableOpacity style={{ position: "relative", alignItems: 'center', width: "100%" }} onPress={() => channelDetail(index)}>
                                        <Image source={{ uri: index.photo }} style={{ width: "100%", height: Dimensions.get("window").height * 0.3, borderRadius: 8 }} />
                                    </TouchableOpacity>
                                    <View style={styles.channelDetail}>
                                        <Text style={styles.channelTitle} >{index.channelName}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                        {isEmpty(result) && (
                            <View style={styles.nodataContainer}>
                                <Text style={styles.nodata_title}>No Datas!</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>)}
            {categoryName == "CHANNELS" && optionName == "Add a Channel" && (<View style={styles.addChannel_container}>
                <ScrollView
                    style={styles.mainsection}
                    contentContainerStyle={{
                        alignItems: "center",
                    }}
                >
                    <View style={styles.uploadsection}>
                        <View style={styles.imagesection}>
                            <UploadChannel setimagefunc={setimagefunc} />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.TextInput}
                                placeholder="Channel Name"
                                placeholderTextColor="#adb2b6"
                                onChangeText={(e) => setChannelName(e)}
                            />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.TextInput}
                                placeholder="URL Handle(Coming Soon)"
                                placeholderTextColor="#adb2b6"
                                onChangeText={(e) => setHandleUrl(e)}
                            />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.TextInput}
                                placeholder="About the channel"
                                placeholderTextColor="#adb2b6"
                                multiline={true}
                                numberOfLines={4}
                                onChangeText={(e) => setAboutChannel(e)}
                            />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.TextInput}
                                placeholder="Location (City, State)"
                                placeholderTextColor="#adb2b6"
                                value={location}
                                onChangeText={(e) => setLocation(e)}
                                onFocus={() => setIsSelectable(true)}
                            />
                            {isSelectable && (
                                <View style={{ marginVertical: 5 }}>
                                    {optionlists && optionlists.map((item, key) => {
                                        return (
                                            <TouchableOpacity style={{ paddingVertical: 2 }} onPress={() => {
                                                setLocation(item);
                                                setIsSelectable(false)
                                            }} key={key}>
                                                <Text>
                                                    {item}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            )}
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                value={keyword}
                                onKeyPress={(e) => addKeyword(e)}
                                style={styles.TextInput}
                                placeholder="Channel Tags (Up to 10)"
                                placeholderTextColor="#adb2b6"
                                onChangeText={(e) => setKeyword(e)}
                            />
                        </View>
                        <View style={{ flexDirection: "row", gap: 20, width: "100%", flexWrap: "wrap" }}>
                            {keywords.map((index, key) => {
                                return (
                                    <Text style={{ color: "#000", fontSize: 24 }} key={key}>{index}</Text>
                                );
                            })}
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.TextInput}
                                placeholder="URL"
                                placeholderTextColor="#adb2b6"
                                onChangeText={(e) => setUrl(e)}
                            />
                        </View>
                        <View style={styles.TextInput}>
                            <TouchableOpacity
                                style={styles.uploadbtn}
                                onPress={() => uploadData()}
                            >
                                <Text style={styles.uploadbtntext}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View >)}
            {categoryName == "RECENT UPLOADS" && optionName == "Recent Uploads" && (
                <ScrollView style={{ flex: 1 }} onLayout={(event) => { find_scroll(event.nativeEvent.layout) }} onScroll={handleScroll}>
                    <View style={styles.contentview} onLayout={(event) => { find_dimesions(event.nativeEvent.layout) }}>
                        {recentUploads && recentUploads.map((index, key) => {
                            return (
                                <TouchableOpacity style={isWide ? styles.wideitemview : isDesktop ? styles.desktopitemview : isTablet ? styles.tabletitemview : isTabletOrMobile ? styles.tabletormobileitemview : styles.mobileView} key={key}>
                                    <View style={{ alignItems: 'center', width: "100%" }}>
                                        <Image source={{ uri: index.thumbnail }} style={{ width: "100%", height: Dimensions.get("window").height * 0.3, borderRadius: 12 }} />
                                        <Image source={require("../../../assets/logos/playvideo.png")} style={{ width: 50, height: 50, position: "absolute", top: "40%" }} />
                                    </View>
                                    <Text style={styles.metadata_title}>{index.title}</Text>
                                    <Text style={styles.metadata_description}>{index.description}</Text>
                                </TouchableOpacity>
                            )
                        })}
                        {isEmpty(recentUploads) && (
                            <View style={styles.nodataContainer}>
                                <Text style={styles.nodata_title}>No Videos yet!</Text>
                                <Text style={styles.nodata_content}>Upload your first video!</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            )}
            {categoryName == "RECENT UPLOADS" && optionName == "Add a Video" && (<View style={styles.contentsection}>
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
                                <TextInput placeholder='Tags' placeholderTextColor="#adb2b6" style={styles.TextInput} value={videoKeyword} onKeyPress={(e) => addVideoKeyword(e)} onChangeText={(e) => setVideoKeyword(e)} />
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
                                <TouchableOpacity style={styles.DropBtnIcon} onPress={addChannel}>
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
                                    value={location}
                                    onChangeText={(e) => setLocation(e)}
                                    onFocus={() => setIsSelectable(true)}
                                />
                                {isSelectable && (
                                    <View style={{ marginVertical: 5 }}>
                                        {optionlists && optionlists.map((item, key) => {
                                            return (
                                                <TouchableOpacity style={{ paddingVertical: 2 }} onPress={() => {
                                                    setLocation(item);
                                                    setIsSelectable(false)
                                                }} key={key}>
                                                    <Text>
                                                        {item}
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
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
        </View >
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        width: "100%",
        position: "relative"
    },
    searchbar: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2AB4FA"
    },
    SearchTextInput: {
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
    scrollview: {
        backgroundColor: "#eee",
        flex: 1
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
        fontSize: 14,
        fontWeight: "bold"
    },
    categorytext: {
        fontSize: 14,
        color: "rgb(197, 197, 197)",
        fontWeight: "bold"
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
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold"
    },
    feedsContainer: {
        backgroundColor: "#eee",
        height: "100%",
    },
    contentview: {
        marginHorizontal: 20,
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
    channelDetail: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 5,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: 'translate(-50%, -50%)',
    },
    channelTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff"
    },
    // Add a channel
    addChannel_container: {
        flex: 1,
        width: '100%',
        alignItems: "center"
    },
    mainsection: {
        width: "100%",
        flex: 1,
    },
    uploadsection: {
        width: "85%",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingBottom: 30,
        paddingTop: 15,
    },
    imagesection: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
    },
    inputView: {
        borderRadius: 5,
        backgroundColor: "transparent",
        marginVertical: 10,
        borderWidth: 2,
        borderStyle: "solid",
        borderRightColor: "transparent",
        borderLeftColor: "transparent",
        borderTopColor: "transparent",
        borderBottomColor: "#000",
        width: "100%",
    },
    errinputView: {
        borderRadius: 5,
        backgroundColor: "rgb(239, 239, 239)",
        marginVertical: 10,
        borderColor: "#30b98f",
        borderWidth: 3,
        borderStyle: "solid",
        width: "100%",
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
    uploadbtn: {
        width: "100%",
        backgroundColor: "rgb(156, 38, 176)",
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 30,
    },
    uploadbtntext: {
        color: "#fff",
        letterSpacing: 1,
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center",
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
    // Add a video
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
        width: "calc(100% - 40px)",
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
        width: "60%",
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
});


const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(MyVideos);