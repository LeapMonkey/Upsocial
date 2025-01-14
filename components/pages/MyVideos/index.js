import React, { useState, useEffect, useRef } from 'react';
import { connect } from "react-redux";
import { MaterialCommunityIcons, MaterialIcons, Feather, Ionicons, FontAwesome, AntDesign, Entypo } from 'react-native-vector-icons';
import {
    Text, StyleSheet, Image, View, ScrollView, TouchableOpacity, Dimensions,
    Platform, TextInput, Button, ToastAndroid
} from 'react-native';
import { CopyToClipboard } from 'react-copy-to-clipboard';
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
import { Country } from "country-state-city";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import toast from 'react-hot-toast';

const items = [
    { id: 1, name: 'CHANNELS' },
    { id: 2, name: 'RECENT UPLOADS' },
    { id: 3, name: 'PLAYLISTS' },
    { id: 4, name: 'HISTORY' },
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
    const [limit, setLimit] = useState(100);
    const [searchflag, setSearchflag] = useState(false);
    const [searchtext, setSearchtext] = useState("");
    const [searchLocation, setSearchLocation] = useState("");

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
    const [allData, setAllData] = useState(null);

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
    const tagRef = useRef(null);

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

    // Confirm Modal
    const [hashCode, setHashCode] = useState("");
    const [videoResult, setVideoResult] = useState("");
    const [embedCode, setEmbedCode] = useState("");
    const [confirmModal, setConfirmModal] = useState(false);
    const [email, setEmail] = useState('');

    const [opened, setOpened] = useState(false);

    // Playlist
    const [playlist_title, setPlaylist_title] = useState("");
    const [playlist_description, setPlaylist_description] = useState("");
    const [playlistImagedata, setPlaylistImagedata] = useState(null);

    const [playlistData, setPlaylistData] = useState([]);

    // video play modal
    const [videoPlayOpened, setVideoPlayOpened] = useState(false);
    const [source, SetSource] = useState();
    const TopVideo = useRef(null);

    const [isOpen, setIsOpen] = useState(-1);
    const [dumpVar, setDumpVar] = useState(-1);

    const [historyData, setHistoryData] = useState([]);

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
        } else if (itemname == "PLAYLISTS") {
            setOptions([
                { id: 1, name: 'Playlists', icon: "list-sharp" },
                { id: 2, name: 'Add a playlist', icon: "add-circle" },
            ]);
            setOptionName('Playlists');
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
    }

    const changeOptionItem = (itemname) => {
        setOptionName(itemname);
        if (itemname === "My Channels") {
            axios.post(apiURL + "/api/Upsocial/getAll/channels", {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
            }).then((res) => {
                let result = res.data.channelData.filter((item) => item.email == (props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser));
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

    const playlistDetail = async (data) => {
        props.setflag("playlistView");
        props.setPlaylistDetail(data);
    };

    const addChannel = () => {
        setCategoryName("CHANNELS");
        setOptionName("Add a Channel");
        setOptions([
            { id: 1, name: 'My Channels', icon: "list-sharp" },
            { id: 2, name: 'Add a Channel', icon: "add-circle" },
        ]);
    };

    const addPlaylists = () => {
        setCategoryName("PLAYLISTS");
        setOptionName("Add a playlist");
        setOptions([
            { id: 1, name: 'Playlists', icon: "list-sharp" },
            { id: 2, name: 'Add a playlist', icon: "add-circle" },
        ]);
    };

    const goToAddVideo = () => {
        setCategoryName("RECENT UPLOADS");
        setOptionName("Add a Video");
        setOptions([
            { id: 1, name: 'Recent Uploads', icon: "list-sharp" },
            { id: 2, name: 'Add a Video', icon: "add-circle" },
        ]);
    };

    const setimagefunc = (imagedata) => {
        setUploadimagedata(imagedata);
    };

    const setPlaylistImagefunc = (imageData) => {
        setPlaylistImagedata(imageData);
    }

    const addKeyword = (e) => {
        if (e.nativeEvent.key == "Enter") {
            if (keywords.length == 10) {
                toast("Max keywords number is 10 !");
                setKeyword("");
                return;
            } else {
                var tempkeys = keyword.split(/\s*,\s*/);
                if (tempkeys.length + keywords.length > 10) {
                    toast("Max keywords number is 10 !");
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
                toast("Max keywords number is 10 !");
                setVideoKeyword("");
                tagRef.current.focus();
                tagRef.current.blur();
                return;
            } else {
                var tempkeys = videoKeyword.split(/\s*,\s*/);
                if (tempkeys.length + videoKeywords.length > 10) {
                    toast("Max keywords number is 10 !");
                } else {
                    setVideoKeywords(keyword => [...keyword, ...tempkeys]);
                    setVideoKeyword("");
                    tagRef.current.focus();
                    tagRef.current.blur();
                }
            }
        }
    };

    const uploadData = async () => {
        if (uploadimagedata === null) {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please select Image!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                toast("Please select image!");
            } else {
                AlertIOS.alert("Please select image!");
            }
        } else if (channelName.trim() === "") {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input Channel Name!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                toast("Please input Channel Name!");
            } else {
                AlertIOS.alert("Please Channel Name!");
            }
        } else if (handleUrl.trim() === "") {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input handle Url!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                toast("Please input handle Url!");
            } else {
                AlertIOS.alert("Please handle Url!");
            }
        } else if (aboutChannel.trim() === "") {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input description!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                toast("Please input description!");
            } else {
                AlertIOS.alert("Please input description!");
            }
        } else if (location.trim() === "") {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input location!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                toast("Please input location!");
            } else {
                AlertIOS.alert("Please input location!");
            }
        } else if (keywords.length == 0) {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input at least 1 tag!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                toast("Please input at least 1 tag!");
            } else {
                AlertIOS.alert("Please input at least 1 tag!");
            }
        } else if (url.trim() === "") {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input url!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                toast("Please input url!");
            } else {
                AlertIOS.alert("Please input url!");
            }
        } else {
            setLoading(true);
            let formdata = new FormData();
            formdata.append("userEmail", props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser);
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
                    toast("Creating Channel success !");
                    setOptionName("My Channels");
                    window.location.reload();
                } else {
                    setLoading(false);
                    toast(res.data.msg);
                }
            }).catch((error) => {
                console.warn(error);
                setLoading(false);
            });
        }
    };

    const uploadPlaylistData = async () => {
        if (playlistImagedata === null) {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please Select Image !", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                toast("Please Select Image !");
            } else {
                AlertIOS.toast("Please Select Image !")
            }
        } else if (playlist_title.trim() === "") {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please Input Playlist Name !", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                toast("Please Input Playlist Name !");
            } else {
                AlertIOS.toast("Please Input Playlist Name !")
            }
        } else if (playlist_description.trim() === "") {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please Input Playlist Description!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                toast("Please Input Playlist Description!");
            } else {
                AlertIOS.alert("Please Input Playlist Description!")
            }
        } else {
            setLoading(true);

            let formdata = new FormData();
            formdata.append("userEmail", props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser);
            formdata.append("photo", playlistImagedata);
            formdata.append("playlistTitle", playlist_title);
            formdata.append("playlistDescription", playlist_description);

            const headers = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            };

            await axios.post(apiURL + "/api/Upsocial/create/playlist", formdata, headers).then((res) => {
                if (res.data.status) {
                    setLoading(false);
                    toast("Creating Playlist success !");
                    setOptionName("Playlists");
                    window.location.reload();
                } else {
                    setLoading(false);
                    toast(res.data.msg);
                }
            }).catch((error) => {
                console.warn(error);
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
        tagRef.current.focus();
        tagRef.current.blur();
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
            toast("All values are cleared! Try again!");
            window.location.reload();
        }
    };

    const uploadVideo = async () => {
        if (!file.file) {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please upload your video!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                toast("Please upload your video!");
            } else {
                AlertIOS.alert("Please upload your video!");
            }
        } else if (v_title.trim() == "") {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input Video title!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                toast("Please input Video title!");
            } else {
                AlertIOS.alert("Please input Video title!");
            }
        } else if (v_description.trim() == "") {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input Video Description!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                toast("Please input Video Description!");
            } else {
                AlertIOS.alert("Please input Video Description!");
            }
        }
        // else if (videoKeywords.length == 0) {
        //     if (Platform.OS === "android") {
        //         ToastAndroid.show("Please input at least 1 keywords, tags!", ToastAndroid.SHORT);
        //     } else if (Platform.OS === "web") {
        //         alert("Please input at least 1 keywords, tags!");
        //     } else {
        //         AlertIOS.alert("Please input at least 1 keywords, tags!");
        //     }
        // }
        else if (selected.length == 0) {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input at least 1 category!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                toast("Please input at least 1 category!");
            } else {
                AlertIOS.alert("Please input at least 1 category!");
            }
        } else {
            if (v_channelName == "Personal Profile") {
                setLoading(true);
                if (thumbnails[2]) {
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

                    await axios.post(apiURL + "/api/Upsocial/upload/generate-ipfs", formData, headers)
                        .then(async (response) => {
                            if (response.data.data) {
                                cid = response.data.data.ipfsUrl;
                                setHashCode(cid);
                                let URL = `${cid}`;
                                setVideoResult(URL);
                                let cid_hash = cid.slice(28, 74);
                                let emb = `<iframe src="https://e.upsocial.com/?ipfs=${cid_hash}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" style="border:none; width:100%; height:100%; min-height:500px;" frameborder="0" scrolling="no"></iframe>`
                                setEmbedCode(emb);

                                var arr = thumbnails[2].split(','), mime = arr[0].match(/:(.*?);/)[1],
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

                                await axios.post(apiURL + "/api/Upsocial/users/content/web/uploadContent", Thumbnail_formData, headers).then((res) => {
                                    if (res.data.status) {
                                        setLoading(false);
                                        setConfirmModal(true);
                                        toast("Success");
                                    } else {
                                        setLoading(false);
                                    }

                                }).catch((err) => {
                                    console.warn(err);
                                    setLoading(false);
                                });

                            } else {
                                console.warn(response.data.error);
                                setLoading(false);
                            }
                        })
                        .catch((error) => {
                            console.warn(error);
                            setLoading(false);
                        });
                } else {
                    toast("Your network is slow, Try again!");
                    resetValues();
                    setLoading(false);
                    window.location.reload();
                    return;
                }
            } else {
                setLoading(true);

                if (thumbnails[2]) {
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

                                setHashCode(cid);
                                let URL = `${cid}`;
                                setVideoResult(URL);
                                let cid_hash = cid.slice(28, 74);
                                let emb = `<iframe src="https://e.upsocial.com/?ipfs=${cid_hash}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" style="border:none; width:100%; height:100%; min-height:500px;" frameborder="0" scrolling="no"></iframe>`
                                setEmbedCode(emb);

                                var arr = thumbnails[2].split(','), mime = arr[0].match(/:(.*?);/)[1],
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
                                        toast("Success");
                                        setConfirmModal(true);
                                    } else {
                                        setLoading(false);
                                    }
                                }).catch((err) => {
                                    setLoading(false);
                                });

                            } else {
                                console.warn(response.data.error);
                                setLoading(false);
                            }
                        })
                        .catch((error) => {
                            console.warn(error);
                            setLoading(false);
                        });
                } else {
                    toast("Your network is slow, Try again!")
                    resetValues();
                    setLoading(false);
                    window.location.reload();
                    return;
                }
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
                window.location.reload();
            }
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
            setLoading(true);
            setLimit(limit + 5);
        }
    };

    const onNotify = () => {

    };

    const onShareSocial = (type) => {
        let shareUrl = ''
        if (type === 'whatsapp') {
            shareUrl = `https://api.whatsapp.com/send?text=${videoResult}`;
        } else if (type === 'facebook') {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${videoResult}`;
        } else if (type === 'twitter') {
            shareUrl = `https://twitter.com/share?url=${videoResult}`;
        } else if (type === 'wordpress') {
            shareUrl = `https://upsocial.com/wp/v2/posts?url=${videoResult}`;
        }
        window.open(shareUrl, '_blank');
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

    const EditVideos = (data) => {
        // console.log(data);
    };

    const RemoveVideos = (data) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteVideos(data)
                },
                {
                    label: 'No',
                    onClick: () => toast('Try Later !')
                }
            ]
        });
    };

    const deleteVideos = async (data) => {
        const datas = {
            userEmail: props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser,
            channelName: data.channelName,
            ID: data.ID,
        };

        axios.post(apiURL + "/api/Upsocial/users/content/web/remove/uploadContent", datas, {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            if (res.data.status) {
                toast(res.data.msg);
                setLoading(false);
                window.location.reload();
            } else {
                toast(res.data.msg);
                setLoading(false);
            }
        }).catch((err) => {
            console.warn(err);
            setLoading(false);
        });
    };

    useEffect(() => {
        const getAllCountries = async () => {
            try {
                let countries = await Country.getAllCountries();
                setOptionLists(countries);
                setAllData(countries);
            } catch (err) {
                console.warn(err);
            }
        };
        getAllCountries();
    }, []);

    useEffect(() => {
        if (optionName == "Playlists") {
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
                res.data.PlaylistData.sort((a, b) => {
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                let result = res.data.PlaylistData.filter((item) => item.userEmail == (props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser));
                setPlaylistData(result);
            }).catch((err) => {
                console.warn(err);
            });
        }
    }, [optionName]);

    useEffect(() => {
        axios.post(apiURL + "/api/Upsocial/getAll/channels", {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            let result = res.data.channelData.filter((item) => item.email == (props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser));
            let feeds = result.reverse();
            setResult(feeds);
            setChannelAllData(feeds);
            setChannels([...channels, ...res.data.channelData]);
        }).catch((err) => {
            console.warn(err);
        });
    }, [])

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
                var res_videofeeds1 = videofeeds1.filter((item) => item.email == (props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser));
                var res_videofeeds2 = videofeeds2.filter((item) => item.email == (props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser));
                var resultVideo = [...res_videofeeds1, ...res_videofeeds2];
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

    useEffect(() => {
        if (props.lastDetailName === "channelDetail") {
            setCategoryName("CHANNELS");
            setOptionName("My Channels");
            setOptions([
                { id: 1, name: 'My Channels', icon: "list-sharp" },
                { id: 2, name: 'Add a Channel', icon: "add-circle" },
            ]);
        } else if (props.lastDetailName === "playlistDetail") {
            setCategoryName("PLAYLISTS");
            setOptionName("Playlists");
            setOptions([
                { id: 1, name: 'Playlists', icon: "list-sharp" },
                { id: 2, name: 'Add a playlist', icon: "add-circle" },
            ]);
        } else {
            setCategoryName("CHANNELS");
            setOptionName("My Channels");
            setOptions([
                { id: 1, name: 'My Channels', icon: "list-sharp" },
                { id: 2, name: 'Add a Channel', icon: "add-circle" },
            ]);
        }
    }, [props.lastDetailName]);

    useEffect(() => {
        axios.post(apiURL + "/api/Upsocial/users/content/getHistory", { curUser: props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser },
            {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
            }).then((res) => {
                if (res.data.status) {
                    setHistoryData(res.data.data);
                    res.data.data.sort((a, b) => {
                        return new Date(b.viewDate) - new Date(a.viewDate);
                    });
                } else {
                    setHistoryData([]);
                }
            }).catch((err) => console.log(err))
    }, [categoryName])

    return (
        <View style={styles.main}>
            <Modal
                isVisible={confirmModal}
                animationIn={'slideInRight'}
                animationOut={'slideOutRight'}
                style={{ margin: 0, padding: 0 }}
            >
                <View style={styles.videopage}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center", position: 'absolute', top: 0, left: 0, zIndex: 1000000 }}>
                        <TouchableOpacity onPress={() => { setConfirmModal(false); window.location.reload(); }}>
                            <Ionicons name="arrow-back-sharp" color="#000" size={30} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.labelText}>Your shareable URL:</Text>
                        <View style={styles.rowCenter}>
                            <TextInput
                                style={styles.urlInput}
                                type={'text'}
                                value={videoResult}
                                editable={false}
                            />
                            <CopyToClipboard text={videoResult}
                                onCopy={() => toast('Copied')}>
                                <Image style={styles.actionImage} source={require("../../../assets/modal/icon_copy_link.png")} />
                            </CopyToClipboard>
                        </View>
                        <View style={styles.codeWrapper}>
                            <Text style={styles.labelText}>Your Embed Code</Text>
                            <View style={[styles.rowCenter, { width: "100% !important" }]}>
                                <TextInput
                                    style={styles.urlInput}
                                    multiline={true}
                                    numberOfLines={5}
                                    type={'textarea'}
                                    value={embedCode}
                                    editable={false}
                                />
                                <View style={styles.actionsWrapper}>
                                    <CopyToClipboard text={embedCode}
                                        onCopy={() => toast('Copied')}>
                                        <Image style={styles.actionImage} source={require("../../../assets/modal/icon_copy_link.png")} />
                                    </CopyToClipboard>
                                    <Image style={styles.actionImage} source={require("../../../assets/modal/icon_wordpress.png")} onClick={() => onShareSocial('wordpress')} />
                                    <Image style={styles.actionImage} source={require("../../../assets/modal/icon_facebook.png")} onClick={() => onShareSocial('facebook')} />
                                    <Image style={styles.actionImage} source={require("../../../assets/modal/icon_twitter.png")} onClick={() => onShareSocial('twitter')} />
                                    <Image style={styles.actionImage} source={require("../../../assets/modal/icon_whatsapp.png")} onClick={() => onShareSocial('whatsapp')} />
                                    <Image style={styles.actionImage} source={require("../../../assets/modal/icon_chat.png")} />
                                    {/* <Image style={styles.actionImage} source={require("../../../assets/modal/icon_qr_code.png")} onClick={onGenerateQRCode} /> */}
                                </View>
                            </View>
                        </View>
                        <View style={styles.soonWrapper}>
                            <Text style={styles.labelText}>Coming Soon!</Text>
                            <Text style={styles.descriptionText}>Want to automatically backup all new videos posted to your youtube channel forever?</Text>
                            <TextInput
                                style={styles.urlInput}
                                type={'text'}
                                value={email}
                                onChange={(text) => setEmail(email)}
                            />
                        </View>
                        <View style={styles.rowCenter}>
                            <Button
                                style={styles.button}
                                title={'Notify Me'}
                                disabled={true}
                                onClick={onNotify}
                            />
                        </View>
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
                    <TouchableOpacity style={styles.headerimage} onPress={() => props.goToHome()}>
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
                        <TouchableOpacity style={styles.iconbtn} onPress={() => props.toggle()}>
                            <Feather name="menu" color="#fff" size={22} />
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
                {isEmpty(options) && (<View>
                    <Text style={styles.active_optiontext}>My Histories</Text>
                </View>)}
            </View>
            {categoryName == "CHANNELS" && optionName == "My Channels" && (<View style={styles.feedsContainer}>
                <ScrollView style={styles.scrollview}>
                    <View style={styles.contentview}>
                        {result && result.map((index, key) => {
                            return (
                                <TouchableOpacity key={key} style={isWide ? styles.wideitemview : isDesktop ? styles.desktopitemview : isTablet ? styles.tabletitemview : isTabletOrMobile ? styles.tabletormobileitemview : styles.mobileitemview} onPress={() => channelDetail(index)}>
                                    <TouchableOpacity style={{ position: "relative", alignItems: 'center', width: "100%" }} onPress={() => channelDetail(index)} >
                                        <Image source={{ uri: index.photo }} style={{ width: "100%", height: Dimensions.get("window").height * 0.3, borderRadius: 8 }} />
                                    </TouchableOpacity>
                                    <View style={styles.channelDetail}>
                                        <Text style={styles.channelTitle} >{index.channelName}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                        {isEmpty(result) && (
                            <TouchableOpacity style={styles.nodataContainer} onPress={addChannel}>
                                <Text style={styles.nodata_title}>Add your first channel!</Text>
                            </TouchableOpacity>
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
                <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} onLayout={(event) => { find_scroll(event.nativeEvent.layout) }} onScroll={handleScroll}>
                    {isEmpty(recentUploads) ? (
                        <TouchableOpacity style={styles.nodataContainer} onPress={goToAddVideo}>
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
                                                                <TouchableOpacity onPress={() => RemoveVideos(index)}>
                                                                    <Text>Remove</Text>
                                                                </TouchableOpacity>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={styles.videoplayitem}>
                                                                <TouchableOpacity onPress={() => EditVideos(index)}>
                                                                    <Text>Edit</Text>
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
                                                                <TouchableOpacity onPress={() => RemoveVideos(index)}>
                                                                    <Text>Remove</Text>
                                                                </TouchableOpacity>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={styles.videoplayitem}>
                                                                <TouchableOpacity onPress={() => EditVideos(index)}>
                                                                    <Text>Edit</Text>
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
                                <TouchableOpacity style={{ marginTop: 10 }} onPress={resetValues}>
                                    <Text style={{ fontSize: 14, color: "#000" }}>Clear</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>)}
            {categoryName == "PLAYLISTS" && optionName == "Playlists" && (<View style={styles.feedsContainer}>
                <ScrollView style={styles.scrollview}>
                    <View style={styles.contentview}>
                        {playlistData && playlistData.map((index, key) => {
                            return (
                                <TouchableOpacity key={key} style={isWide ? styles.wideitemview : isDesktop ? styles.desktopitemview : isTablet ? styles.tabletitemview : isTabletOrMobile ? styles.tabletormobileitemview : styles.mobileitemview} onPress={() => playlistDetail(index)}>
                                    <View style={{ position: "relative", alignItems: 'center', width: "100%" }}>
                                        <Image source={{ uri: index.image }} style={{ width: "100%", height: Dimensions.get("window").height * 0.3, borderRadius: 8 }} />
                                    </View>
                                    <View style={styles.channelDetail}>
                                        <Text style={styles.channelTitle} >{index.title}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                        {isEmpty(playlistData) && (
                            <TouchableOpacity style={styles.nodataContainer} onPress={addPlaylists}>
                                <Text style={styles.nodata_title}>Add your first Playlists!</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>
            </View>)}
            {categoryName == "PLAYLISTS" && optionName == "Add a playlist" && (<View style={styles.addChannel_container}>
                <ScrollView
                    style={styles.mainsection}
                    contentContainerStyle={{
                        alignItems: "center",
                    }}
                >
                    <View style={styles.uploadsection}>
                        <View style={styles.imagesection}>
                            <UploadChannel setimagefunc={setPlaylistImagefunc} />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.TextInput}
                                placeholder="Playlists Name"
                                placeholderTextColor="#adb2b6"
                                onChangeText={(e) => setPlaylist_title(e)}
                            />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.TextInput}
                                placeholder="Description"
                                placeholderTextColor="#adb2b6"
                                multiline={true}
                                numberOfLines={4}
                                onChangeText={(e) => setPlaylist_description(e)}
                            />
                        </View>
                        <View style={styles.TextInput}>
                            <TouchableOpacity
                                style={styles.uploadbtn}
                                onPress={() => uploadPlaylistData()}
                            >
                                <Text style={styles.uploadbtntext}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View >)}
            {categoryName == "HISTORY" && (
                <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} onLayout={(event) => { find_scroll(event.nativeEvent.layout) }} onScroll={handleScroll}>
                    {isEmpty(historyData) ? (
                        <View style={styles.nodataContainer}>
                            <Text style={styles.nodata_title}>No Histories yet!</Text>
                            <Text style={styles.nodata_content}>Watch videos!</Text>
                        </View>
                    ) : (
                        <View style={styles.videoLists}>
                            <View style={styles.feeds_contentview}>
                                {!isEmpty(historyData) && historyData.map((index, key) => {
                                    if (Number(key + 1) <= Number(Math.ceil(historyData.length / 2))) {
                                        return (
                                            <View style={isWide ? styles.wideitemview : isDesktop ? styles.desktopitemview : isTablet ? styles.tabletitemview : isTabletOrMobile ? styles.tabletormobileitemview : styles.mobileitemview} key={key}>
                                                <TouchableOpacity style={{ alignItems: 'center', width: "100%", borderRadius: 10 }} onPress={() => watchVideo(index, key)}>
                                                    <img src={index.thumbnail} style={{ width: "100%", borderRadius: 10 }} />
                                                    <Image source={require("../../../assets/logos/playvideo.png")} style={{ width: 50, height: 50, position: "absolute", top: "40%" }} />
                                                </TouchableOpacity>
                                                <View style={styles.maincontentview}>
                                                    <View style={{ width: "100%" }}>
                                                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                                                            <Text style={styles.metadata_description}>Watched At:</Text>
                                                            <Text style={styles.metadata_description}>{new Date(index.viewDate).toLocaleDateString()}</Text>
                                                        </View>
                                                        <Text style={styles.metadata_title}>{index.title}</Text>
                                                        <Text style={styles.metadata_description}>{index.description}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    }
                                })}
                            </View>
                            <View style={styles.feeds_contentview}>
                                {!isEmpty(historyData) && historyData.map((index, key) => {
                                    if (Number(key + 1) > Number(Math.ceil(historyData.length / 2))) {
                                        return (
                                            <View style={isWide ? styles.wideitemview : isDesktop ? styles.desktopitemview : isTablet ? styles.tabletitemview : isTabletOrMobile ? styles.tabletormobileitemview : styles.mobileitemview} key={key}>
                                                <TouchableOpacity onPress={() => watchVideo(index, key)} style={{ alignItems: 'center', width: "100%", borderRadius: 10 }}>
                                                    <img src={index.thumbnail} style={{ width: "100%", borderRadius: 10 }} />
                                                    <Image source={require("../../../assets/logos/playvideo.png")} style={{ width: 50, height: 50, position: "absolute", top: "40%" }} />
                                                </TouchableOpacity>
                                                <View style={styles.maincontentview}>
                                                    <View style={{ width: "100%" }}>
                                                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                                                            <Text style={styles.metadata_description}>Watched At:</Text>
                                                            <Text style={styles.metadata_description}>{new Date(index.viewDate).toLocaleDateString()}</Text>
                                                        </View>
                                                        <Text style={styles.metadata_title}>{index.title}</Text>
                                                        <Text style={styles.metadata_description}>{index.description}</Text>
                                                    </View>
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
                    {/* <TouchableOpacity style={{ flexDirection: "row", gap: 20, justifyContent: "center", alignItems: "center" }} onPress={addImageCamera}>
                        <Text style={{ color: "#FFF" }}>Record A Video</Text>
                        <Ionicons name="camera-sharp" color="#fff" size={30} />
                    </TouchableOpacity> */}
                    <label htmlFor="fileuploadinput">
                        <TouchableOpacity style={{ flexDirection: "row", gap: 20, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: "#FFF" }}>Record A Video</Text>
                            <Ionicons name="camera-sharp" color="#fff" size={30} />
                        </TouchableOpacity>
                    </label>
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
        justifyContent: "center",
        paddingTop: 50
    },
    nodata_title: {
        marginVertical: 2,
        backgroundColor: "#c081ff",
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 15,
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center"
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
        fontWeight: "bold",
        textAlign: "center"
    },
    metadata_description: {
        color: "#000",
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center"
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
    videopage: {
        width: "100%",
        height: Dimensions.get('window').height,
        justifyContent: "center",
        backgroundColor: "#fff",
        alignItems: "center",
    },
    inputWrapper: {
        marginTop: 20,
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    labelText: {
        fontSize: 16,
        fontWeight: 600,
        color: 'rgb(51, 51, 51)',
        textAlign: 'center',
        marginBottom: 10
    },
    rowCenter: {
        flex: 1,
        width: "50%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    urlInput: {
        flexGrow: 1,
        marginRight: 10,
        width: '100%'
    },
    actionsWrapper: {
        flexDirection: 'column',
        justifyContent: 'center'
    },
    actionImage: {
        width: 24,
        height: 24,
        marginBottom: 10
    },
    soonWrapper: {
        marginTop: 20,
        marginBottom: 20
    },
    descriptionText: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 10
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

export default connect(mapStateToProps, {})(MyVideos);