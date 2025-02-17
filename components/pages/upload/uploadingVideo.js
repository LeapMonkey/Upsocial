import React, { useState, useEffect, useRef } from 'react';
import { connect } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, TextInput, Button, Dimensions, Platform } from 'react-native';
import SelectDropdown from "react-native-select-dropdown";
import { MultiSelect } from 'react-native-element-dropdown';
import { MaterialCommunityIcons, MaterialIcons, Feather, Ionicons, FontAwesome, AntDesign } from 'react-native-vector-icons';
import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";
import { Video, ResizeMode } from "expo-av";
import { generateVideoThumbnails } from "@rajesh896/video-thumbnails-generator";
import { apiURL } from '../../config/config';
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Country } from "country-state-city";
import toast from 'react-hot-toast';

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

const UploadingVideo = (props) => {

    const [loading, setLoading] = useState(false);
    // Video Picker
    const [cameraStatus, requestPermission] = ImagePicker.useCameraPermissions();
    const [videoSrc, setVideoSrc] = useState(null);
    const [file, setFile] = useState({ file: null });
    const video = useRef(null);
    const [status, setStatus] = useState({});
    const [thumbnails, setThumbnails] = useState([]);
    // Video Data
    const [videoKeyword, setVideoKeyword] = useState("");
    const [videoKeywords, setVideoKeywords] = useState([]);
    const tagRef = useRef(null);

    const [v_title, setV_title] = useState("");
    const [v_description, setV_description] = useState("");
    const [v_channelName, setV_channelName] = useState("");
    const [v_channelAdmin, setV_channelAdmin] = useState("");
    const [location, setLocation] = useState("");
    const [optionlists, setOptionLists] = useState(null);
    const [allData, setAllData] = useState(null);

    const [channels, setChannels] = useState([{ channelName: "Personal Profile" }]);
    const [selected, setSelected] = useState([]);

    const [opened, setOpened] = useState(false);

    const [isSelectable, setIsSelectable] = useState(false);

    // Camera recorded video file
    const [camera_VideoUri, set_camera_VideoUri] = useState("");
    const [camera_Name, set_camera_Name] = useState("");
    const [camera_Type, set_camera_Type] = useState("");
    const [uploadVideoType, setUploadVideoType] = useState(false);

    // Confirm Modal
    const [hashCode, setHashCode] = useState("");
    const [videoResult, setVideoResult] = useState("");
    const [embedCode, setEmbedCode] = useState("");
    const [confirmModal, setConfirmModal] = useState(false);
    const [email, setEmail] = useState('');

    const [searchtext, setSearchtext] = useState("");

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

        setVideoSrc({ uri: localUri });
        set_camera_VideoUri(localUri);
        set_camera_Name(filename);
        set_camera_Type(type);
        setUploadVideoType(true);
    };

    const onFileChange = async (event) => {
        const file = event.target.files[0];
        setFile({ file });
        setUploadVideoType(false);
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

        if (Platform.OS === "android") {
            ToastAndroid.show("All values are cleared! Try again!", ToastAndroid.SHORT);
        } else {
            toast("All values are cleared! Try again!");
        }
    };

    const uploadVideo = async () => {
        if (!file.file && camera_VideoUri == "") {
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
        else if (videoKeywords.length == 0) {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input at least 1 keywords, tags!", ToastAndroid.SHORT);
            } else if (Platform.OS === "web") {
                toast("Please input at least 1 keywords, tags!");
            } else {
                AlertIOS.alert("Please input at least 1 keywords, tags!");
            }
        }
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
                                    resetValues();
                                    toast("Success");
                                    setConfirmModal(true);
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
                                    resetValues();
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
    }

    useEffect(() => {
        axios.post(apiURL + "/api/Upsocial/getAll/channels", {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            if (res.data.channelData) {
                setChannels([...channels, ...res.data.channelData]);
            }
        }).catch((err) => {
            console.warn(err);
        });
    }, []);

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


    const onSearch = (e) => {
        setSearchtext(e);
        var searchresult = optionlists.filter((item) => {
            return item.name.toLowerCase().indexOf(e.toLowerCase()) > -1 || item.flag.toLowerCase().includes(e.toLowerCase());
        });
        if (e === "") {
            setOptionLists(allData);
        } else {
            setOptionLists(searchresult);
        }
    }

    return (
        <LinearGradient
            colors={['#2ab4fad9', '#1D2145']}
            style={styles.container}
        >
            {loading && <View style={styles.loadingView}>
                <Image
                    source={require("../../../assets/loading.gif")}
                    style={{ width: 140, height: 140 }}
                />
            </View>}
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
                    {/* <TouchableOpacity style={{ flexDirection: "row", gap: 50, justifyContent: "center", alignItems: "center" }} onPress={addImageCamera}>
                        <Text style={{ color: "#FFF" }}>Record A Video</Text>
                        <Ionicons name="camera-sharp" color="#fff" size={30} />
                    </TouchableOpacity> */}
                    <label htmlFor="fileuploadinput">
                        <TouchableOpacity style={{ flexDirection: "row", gap: 50, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: "#FFF" }}>Record A Video</Text>
                            <Ionicons name="camera-sharp" color="#fff" size={30} />
                        </TouchableOpacity>
                    </label>
                    <input style={{ display: "none" }} type='file' id='fileuploadinput' accept='video/mp4,video/x-m4v,video/*' onChange={onFileChange} />
                    <label htmlFor="fileuploadinput">
                        <TouchableOpacity style={{ flexDirection: "row", gap: 50, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: "#FFF" }}>Upload A Video</Text>
                            <Ionicons name="md-folder-outline" color="#fff" size={30} />
                        </TouchableOpacity>
                    </label>
                    <input style={{ display: "none" }} type='file' id='fileuploadinput' accept='video/mp4,video/x-m4v,video/*' onChange={onFileChange} />
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
                        <TouchableOpacity style={styles.iconbtn}>
                            <MaterialIcons name="search" color="#fff" size={22} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconbtn} onPress={() => props.navigation.toggleDrawer()}>
                            <Feather name="menu" color="#fff" size={22} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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
                            <TouchableOpacity style={styles.uploadimageview} onPress={cameraOption}>
                                <Text style={styles.uploadimagetext}>Add Or Upload A Video</Text>
                                <View>
                                    <FontAwesome name='camera' color="#fff" size={140} />
                                    <View style={styles.uploadbtnicon}>
                                        <FontAwesome name='plus-circle' color="#000" size={34} />
                                    </View>
                                </View>
                            </TouchableOpacity>)}
                        <View style={styles.TextView}>
                            <TextInput placeholder="Title" placeholderTextColor="#adb2b6"
                                style={styles.TextInput} value={v_title} onChangeText={(e) => setV_title(e)} />
                        </View>
                        <View style={styles.TextView}>
                            <TextInput placeholder="Description" placeholderTextColor="#adb2b6"
                                style={styles.TextArea} value={v_description} onChangeText={(e) => setV_description(e)} multiline={true} />
                        </View>
                        <View style={styles.TextView}>
                            <TextInput placeholder='Tags' ref={tagRef} placeholderTextColor="#adb2b6" style={styles.TextArea} multiline={true} numberOfLines={1} value={videoKeyword} onKeyPress={(e) => addVideoKeyword(e)} onChangeText={(e) => setVideoKeyword(e)} />
                            <View style={{ flexDirection: "row", gap: 15, width: '100%', flexWrap: "wrap", marginTop: 5 }}>
                                {videoKeywords.map((index, key) => {
                                    return (
                                        <Text key={key} style={{ color: "#fff", paddingHorizontal: 10 }}>{index}</Text>
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
                                        <Feather name={!isOpened ? 'chevron-down' : 'chevron-up'} color="#fff" size={20} />
                                    </View>
                                }}
                                dropdownIconPosition={"right"}
                                dropdownStyle={styles.dropdown4DropdownStyle}
                                rowStyle={styles.dropdown4RowStyle}
                                rowTextStyle={styles.dropdown4RowTxtStyle}
                            />
                            <TouchableOpacity style={styles.DropBtnIcon}>
                                <MaterialCommunityIcons name='plus-circle-outline' color="#fff" size={30} />
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
                                value={searchtext}
                                onChangeText={(e) => onSearch(e)}
                                onFocus={() => setIsSelectable(true)}
                            />
                            {isSelectable && (
                                <ScrollView style={{ marginVertical: 5, maxHeight: 300, minHeight: 300 }}>
                                    {optionlists && optionlists.map((item, key) => {
                                        return (
                                            <TouchableOpacity style={{ paddingVertical: 2 }} onPress={() => {
                                                setLocation(item.name);
                                                setSearchtext(item.name);
                                                setIsSelectable(false)
                                            }} key={key}>
                                                <Text style={{ color: "#FFF" }}>
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
                                <Text style={{ fontSize: 14, color: "#fff" }}>Clear</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <Modal
                isVisible={confirmModal}
                animationIn={'slideInRight'}
                animationOut={'slideOutRight'}
                style={{ margin: 0, padding: 0 }}
            >
                <View style={styles.videopage}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center", position: 'absolute', top: 0, left: 0, zIndex: 1000000 }}>
                        <TouchableOpacity onPress={() => window.location.reload()}>
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
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignItems: "center",
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
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        left: 0,
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
        marginLeft: 10,
    },
    scrollcontentsection: {
        marginTop: 100,
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
        color: "#fff",
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
        borderBottomColor: "#fff",
        borderBottomWidth: 1,
    },
    dropdown4BtnTxtStyle: {
        color: "#fff",
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
        borderBottomColor: "#fff",
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
        shadowColor: '#fff',
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
        borderBottomColor: "#fff",
        borderBottomWidth: 1,
        color: "#fff"
    },
    TextInput: {
        width: "100%",
        fontSize: 20,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomColor: "#fff",
        borderBottomWidth: 1,
        color: "#fff"
    },
    subinputtext: {
        marginHorizontal: 10,
        color: "#fff",
        fontSize: 16,
    },
    videopage: {
        width: "100%",
        height: "100%",
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
});

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(UploadingVideo);