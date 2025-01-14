import React, { useState, useRef } from 'react';
import { connect } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { LinearGradient } from 'expo-linear-gradient';
import MultiSelect from "react-native-multiple-select";
import { FontAwesome5, MaterialCommunityIcons } from 'react-native-vector-icons';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text, TextInput, Image, Button, Dimensions } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from 'expo-video-thumbnails';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Video, ResizeMode } from "expo-av";
import { QRCodeCanvas } from "qrcode.react";
import { ToastAndroid, Platform } from 'react-native';
import axios from 'axios';
import { apiURL } from '../../config/config';
import Modal from "react-native-modal";
import { generateVideoThumbnails } from "@rajesh896/video-thumbnails-generator";
import toast from 'react-hot-toast';

const Upload = (props) => {

    const [image, setImage] = useState(null);
    const [email, setEmail] = useState('');
    const [showQRCode, setShowQRCode] = useState(false);
    const video = useRef(null);
    const [status, setStatus] = useState({});
    const [cameraStatus, requestPermission] = ImagePicker.useCameraPermissions();

    // Metadata values
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // Video file data
    const [videoUri, setVideoUri] = useState("");
    const [name, setName] = useState("");
    const [type, setType] = useState("");

    const [loading, setLoading] = useState(false);

    const [hashCode, setHashCode] = useState("");
    const [url, setURL] = useState("");
    const [embedCode, setEmbedCode] = useState("");
    const [opened, setOpened] = useState(false);

    // multi select options
    const [selectedItems, setSelectedItems] = useState([]);
    const [category, setCategory] = useState([]);

    // Keys
    const [keyword, setKeyword] = useState("");
    const [keywords, setKeywords] = useState([]);

    const [file, setFile] = useState({ file: null, error: '' });
    const [thumbnails, setThumbnails] = useState([]);

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

    const items = [
        { id: 1, name: 'Animation' },
        { id: 2, name: 'Autos & Vehicles' },
        { id: 3, name: 'Beauty & Fashion' },
        { id: 4, name: 'Comedy' },
        { id: 5, name: 'Cooking & Food' },
        { id: 6, name: 'DIY & Crafts' },
        { id: 7, name: 'Documentary' },
        { id: 8, name: 'Education' },
        { id: 9, name: 'Entertainment' },
        { id: 10, name: 'Film & Animation' },
        { id: 11, name: 'Gaming' },
        { id: 12, name: 'Health & Fitness' },
        { id: 13, name: 'How-to & Style' },
        { id: 14, name: 'Kids & Family' },
        { id: 15, name: 'Music' },
        { id: 16, name: 'News & Politics' },
        { id: 17, name: 'Nonprofits & Activism' },
        { id: 18, name: 'People & Blogs' },
        { id: 19, name: 'Pets & Animals' },
        { id: 20, name: 'Science & Technology' },
        { id: 21, name: 'Sports' },
        { id: 22, name: 'Travel & Events' },
        { id: 23, name: 'Unboxing & Reviews' },
        { id: 24, name: 'Blogs' },
    ];
    const onSelectedItemsChange = (selectedItems) => {
        if (selectedItems.length > 3) {
            toast("Max category is 3 !");
        } else {
            setSelectedItems(selectedItems);
        }
    };
    // Reset function
    const resetValues = () => {
        setTitle("");
        setDescription("");
        setKeyword("");
        setKeywords([]);
        setSelectedItems([]);
        setThumbnails([]);
        setFile({ file: null, error: '' });
        setImage(null);

        if (Platform.OS === "android") {
            ToastAndroid.show("All values are cleared! Try again!", ToastAndroid.SHORT);
        } else {
            toast("All values are cleared! Try again!");
        }
    };

    // Upload
    const uploadContent = async (e) => {
        e.preventDefault();

        setLoading(true);

        let headers = {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
        };
        let VideoFormData = new FormData();

        VideoFormData.append('video', {
            uri: videoUri,
            name: name,
            type: type
        });
        let cid = "";

        await axios.post(apiURL + "/api/Upsocial/upload/generate-ipfs", VideoFormData, headers).then((res) => {
            cid = res.data.data.ipfsUrl;
        }).catch((err) => {
            console.warn(err);
            setLoading(false);
        });



        const { uri } = await VideoThumbnails.getThumbnailAsync(
            cid,
            {
                time: 15000,
            }
        );

        let ThumbnailFormData = new FormData();
        let thumbnail = "";

        ThumbnailFormData.append('video', {
            uri: uri,
            name: "Thumbnail",
            type: "image/*"
        });

        await axios.post(apiURL + "/api/Upsocial/upload/generate-ipfs", ThumbnailFormData, headers).then((res) => {
            thumbnail = res.data.data.ipfsUrl;
        }).catch((err) => {
            console.warn(err);
        });

        const contentData = {
            title: title,
            description: description,
            keyword: keywords,
            category: selectedItems,
            userEmail: "kogutstt2@gmail.com", //props.auth.user.curUser
            ipfsUrl: cid,
            thumbnail: thumbnail
        };
        setHashCode(cid);
        let URL = `${cid}`;
        setURL(URL);
        let cid_hash = cid.slice(28, 74);
        let emb = `<iframe src="https://e.upsocial.com/?ipfs=${cid_hash}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" style="border:none; width:100%; height:100%; min-height:500px;" frameborder="0" scrolling="no"></iframe>`
        setEmbedCode(emb);
        axios
            .post(apiURL + "/api/Upsocial/users/content/uploadContent", contentData, {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
            })
            .then((res) => {
                setLoading(false);
                setOpened(true);
                if (Platform.OS === "android") {
                    ToastAndroid.show(res.data.msg, ToastAndroid.SHORT);
                }
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    const addImageGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4]
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

        setImage({ uri: localUri });
        setVideoUri(localUri);
        setName(filename);
        setType(type);
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

        setImage({ uri: localUri });
        setVideoUri(localUri);
        setName(filename);
        setType(type);
    };

    const uploadVideoWeb = async () => {
        if (file.file) {
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
                .then((response) => {
                    if (response.data.data) {
                        cid = response.data.data.ipfsUrl;
                    } else {
                        console.warn(response.data.error);
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    console.warn(error);
                    setLoading(false);
                });

            setHashCode(cid);
            let URL = `${cid}`;
            setURL(URL);
            let cid_hash = cid.slice(28, 74);
            let emb = `<iframe src="https://e.upsocial.com/?ipfs=${cid_hash}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" style="border:none; width:100%; height:100%; min-height:500px;" frameborder="0" scrolling="no"></iframe>`
            setEmbedCode(emb);

            var arr = thumbnails[0].split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            let img_file = new File([u8arr], `${title}.jpg`, { type: mime });

            let Thumbnail_formData = new FormData();

            Thumbnail_formData.append('thumbnail', img_file);
            Thumbnail_formData.append('title', title);
            Thumbnail_formData.append('description', description);
            Thumbnail_formData.append('keywords', keywords);
            Thumbnail_formData.append('category', selectedItems);
            Thumbnail_formData.append('userEmail', props.auth.user.curUser);
            Thumbnail_formData.append('video_src', cid);

            Thumbnail_formData.append('channelName', "Personal Profile");

            await axios.post(apiURL + "/api/Upsocial/users/content/web/uploadContent", Thumbnail_formData, headers).then((res) => {
                if (res.data.status) {
                    setLoading(false);
                    setOpened(true);
                } else {
                    setLoading(false);
                }

            }).catch((err) => {
                console.warn(err);
                setLoading(false);
            });
        }
    }

    const onFileChange = async (event) => {
        const file = event.target.files[0];
        setFile({ file, error: '' });
        const url = URL.createObjectURL(file);
        setImage({ uri: url });

        if (file) {
            try {
                const res = await generateVideoThumbnails(file, 3);
                setThumbnails(res);
            } catch (error) {
                window.location.reload();
            }
        }
    }

    const onShareSocial = (type) => {
        let shareUrl = ''
        if (type === 'whatsapp') {
            shareUrl = `https://api.whatsapp.com/send?text=${url}`;
        } else if (type === 'facebook') {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        } else if (type === 'twitter') {
            shareUrl = `https://twitter.com/share?url=${url}`;
        } else if (type === 'wordpress') {
            shareUrl = `https://upsocial.com/wp/v2/posts?url=${url}`;
        }
        window.open(shareUrl, '_blank');
    }
    const onGenerateQRCode = () => {
        setShowQRCode(true);
    }

    const onCloseQRCode = () => {
        setShowQRCode(false);
    }


    const onNotify = () => {

    }

    return (
        <ScrollView style={styles.container} nestedScrollEnabled={true}>
            <Modal
                isVisible={opened}
                animationIn={'slideInRight'}
                animationOut={'slideOutRight'}
                style={{ margin: 0, padding: 0 }}
            >
                <TouchableOpacity onPress={() => setOpened(false)}>
                    <Ionicons name="arrow-back-sharp" color="#000" size={30} />
                </TouchableOpacity>
                {showQRCode ? (
                    <View style={styles.qrCodeDialogWrapper}>
                        <div style={styles.qrCodeDialog}>
                            <img style={styles.closeImage} source={require("../../../assets/modal/icon_close.png")} onClick={onCloseQRCode} />
                            <QRCodeCanvas
                                id="qrCode"
                                value={url}
                                size={300}
                                bgColor={"#ffffff"}
                                level={"H"}
                            />
                        </div>
                    </View>
                ) : (
                    <View style={styles.videopage}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center", position: 'absolute', top: 0, left: 0, zIndex: 1000000 }}>
                            <TouchableOpacity onPress={() => setOpened(false)}>
                                <Ionicons name="arrow-back-sharp" color="#000" size={30} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.labelText}>Your shareable URL:</Text>
                            <View style={styles.rowCenter}>
                                <TextInput
                                    style={styles.urlInput}
                                    type={'text'}
                                    value={url}
                                    editable={false}
                                />
                                <CopyToClipboard text={url}
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
                    </View>)}
            </Modal>
            {loading && <View style={styles.loadingView}>
                <Image
                    source={require("../../../assets/loading.gif")}
                    style={{ width: 140, height: 140 }}
                />
            </View>}
            <View>
                {image ? (
                    <Video
                        ref={video}
                        videoStyle={Platform.OS === 'android' || Platform.OS === 'ios' ? { position: "relative", width: Dimensions.get("window").width, height: Dimensions.get("window").height * 0.7, margin: 'auto', maxWidth: 400 } : { position: "relative", width: "100%", height: "100%", margin: 'auto', maxWidth: 400 }}
                        style={styles.videoPreviewer}
                        source={Platform.OS === 'android' || Platform.OS === 'ios' ? image : image}
                        isLooping
                        shouldPlay
                        useNativeControls
                        resizeMode={ResizeMode.STRETCH}
                        onPlaybackStatusUpdate={status => setStatus(() => status)}
                    />) :
                    (
                        <View style={styles.uploadvideoview}>
                            <View style={styles.uploadiconview}>
                                <FontAwesome5 name='photo-video' style={styles.whitecolor} size={70} />
                                <View style={styles.subiconview}>
                                    <MaterialCommunityIcons style={styles.bluecolor} name="upload" size={30} />
                                </View>
                            </View>
                            <View style={styles.uploadviewtext}>
                                <Text style={styles.uploadtextfirst}>No videos yet!</Text>
                                <Text style={styles.uploadtextsecond}>Explore the moments. Upload your video</Text>
                            </View>
                            <View style={styles.uploadbtngroupview}>
                                {Platform.OS === "android" || Platform.OS === "ios" ? (<>
                                    <LinearGradient
                                        colors={['#621a9f', '#3521b3']}
                                        style={styles.uploadlinearview}
                                    >
                                        <TouchableOpacity style={styles.uploadiconbtn} onPress={addImageGallery}>
                                            <Ionicons name="md-folder-outline" color="#fff" size={30} />
                                        </TouchableOpacity>
                                    </LinearGradient>
                                    <LinearGradient
                                        colors={['#621a9f', '#3521b3']}
                                        style={styles.uploadlinearview}
                                    >

                                        <TouchableOpacity style={styles.uploadiconbtn} onPress={addImageCamera}>
                                            <Ionicons name="camera-sharp" color="#fff" size={30} />
                                        </TouchableOpacity>
                                    </LinearGradient>
                                </>) : (
                                    Platform.OS === 'android' || Platform.OS === 'ios' ? (<LinearGradient
                                        colors={['#621a9f', '#3521b3']}
                                        style={styles.uploadlinearview}
                                    >
                                        <TouchableOpacity style={styles.uploadbtn} onPress={addImageGallery}>
                                            <Text style={styles.uploadbtntext}>UPLOAD</Text>
                                        </TouchableOpacity>
                                    </LinearGradient>) : (
                                        <LinearGradient
                                            colors={['#621a9f', '#3521b3']}
                                            style={styles.uploadlinearview}
                                        >
                                            <label htmlFor="fileuploadinput">
                                                <TouchableOpacity style={styles.uploadbtn}>
                                                    <Text style={styles.uploadbtntext}>UPLOAD</Text>
                                                </TouchableOpacity>
                                            </label>
                                            <input style={{ display: "none" }} type='file' id='fileuploadinput' accept='video/mp4,video/x-m4v,video/*' onChange={onFileChange} />
                                        </LinearGradient>
                                    )
                                )}
                            </View>
                        </View>
                    )}
            </View>
            {
                image && (
                    <LinearGradient colors={['#fcfbff', '#f9f9fb']} style={styles.metadataview}>
                        <View style={{ position: "relative", marginBottom: 50 }}>
                            <View style={{ position: "relative", top: 0, left: "10%", transform: [{ translateY: -100 }], width: "80%", backgroundColor: "#fff", borderRadius: 5, flexDirection: "column", alignItems: "center" }}>
                                <View style={styles.videoDetailView}>
                                    <Text>Title</Text>
                                    <TextInput value={title} onChangeText={(e) => setTitle(e)} placeholder="Content Title" placeholderTextColor="#adb2b6" style={styles.videoDetailTextInput} />
                                </View>
                                <View style={styles.videoDetailView}>
                                    <Text>Description</Text>
                                    <TextInput value={description} onChangeText={(e) => setDescription(e)} placeholder="Content Description" placeholderTextColor="#adb2b6" style={styles.videoDetailTextInput} />
                                </View>
                                <View style={styles.videoDetailView}>
                                    <Text>Keywords</Text>
                                    <TextInput value={keyword} onKeyPress={(e) => addKeyword(e)} onChangeText={(e) => setKeyword(e)} placeholder="keyword: You can enter 10 keywords" placeholderTextColor="#adb2b6" style={styles.videoDetailTextInput} />
                                    <View style={{ flexDirection: "row", gap: 20, width: "100%", flexWrap: "wrap" }}>
                                        {keywords.map((index, key) => {
                                            return (
                                                <Text key={key}>{index}</Text>
                                            );
                                        })}
                                    </View>
                                </View>
                                <View style={styles.videoDetailView}>
                                    <Text style={{ marginBottom: 10 }}>Category</Text>
                                    {/* <TextInput value={category} onChangeText={(e) => setCategory(e)} placeholder="Category" placeholderTextColor="#adb2b6" style={styles.videoDetailTextInput} /> */}
                                    <MultiSelect
                                        hideTags
                                        items={items}
                                        uniqueKey="id"
                                        onSelectedItemsChange={onSelectedItemsChange}
                                        selectedItems={selectedItems}
                                        selectText="Pick Categories"
                                        searchInputPlaceholderText="Search Items..."
                                        flatListProps={{ nestedScrollEnabled: true }}
                                        nestedScrollEnabled={true}
                                        tagRemoveIconColor="#CCC"
                                        tagBorderColor="#CCC"
                                        tagTextColor="#CCC"
                                        selectedItemTextColor="#CCC"
                                        selectedItemIconColor="#CCC"
                                        itemTextColor="#000"
                                        displayKey="name"
                                        searchInputStyle={{ color: '#CCC' }}
                                        submitButtonColor="#48d22b"
                                    />
                                </View>
                                <View style={Platform.OS === 'android' || Platform.OS === 'ios' ? { width: Dimensions.get("window").width - 30, flexDirection: "row", justifyContent: "space-around" } : { width: "100%", flexDirection: "row", justifyContent: "space-around" }}>
                                    <LinearGradient
                                        colors={['#621a9f', '#3521b3']}
                                        style={styles.videouploadlinearview}
                                    >
                                        {<TouchableOpacity onPress={Platform.OS === 'android' || Platform.OS === 'ios' ? uploadContent : uploadVideoWeb}>
                                            <Text style={styles.whitecolor}>UPLOAD</Text>
                                        </TouchableOpacity>}
                                    </LinearGradient>
                                    <LinearGradient
                                        colors={['#621a9f', '#3521b3']}
                                        style={styles.videouploadlinearview}
                                    >
                                        <TouchableOpacity onPress={resetValues}>
                                            <Text style={styles.whitecolor}>Reset</Text>
                                        </TouchableOpacity>
                                    </LinearGradient>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>)
            }
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        height: Dimensions.get("window").height
    },
    videopage: {
        width: "100%",
        height: Dimensions.get('window').height,
        justifyContent: "center",
        backgroundColor: "#fff",
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
    backArrow: {
        flexDirection: "row",
        alignItems: "center"
    },
    Title: {
        color: "#fff",
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
        marginVertical: 10,
    },
    MetadataTitle: {
        color: "#fff",
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 40,
    },
    videoPreviewer: {
        width: Platform.OS === 'android' || Platform.OS === 'ios' ? Dimensions.get("window").width : '100%',
        height: Dimensions.get("window").height * 0.75
    },
    loginbtn: {
        width: 70,
        height: 50,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10
    },
    btnGroup: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 100,
        marginTop: 30
    },
    TextInput: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        borderBottomColor: "#3b8ad0",
        borderBottomWidth: 2,
        width: "100%",
        color: "#fff",
        marginVertical: 10
    },
    btnUpload: {
        marginTop: 30,
        marginBottom: 100,
        flexDirection: "row",
        gap: 30
    },
    upload: {
        width: 150,
        height: 50,
        flex: 1,
        gap: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
    uploadTitle: {
        color: "#fff",
        fontSize: 20
    },
    uploadvideoview: {
        height: Dimensions.get('window').height - 96,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    uploadiconview: {
        backgroundColor: "#3f29b2",
        position: "relative",
        width: 150,
        height: 150,
        borderRadius: 50,
        flexDirection: "row",
        justifyContent: "center", alignItems: "center"
    },
    whitecolor: {
        color: "#fff"
    },
    subiconview: {
        position: "absolute",
        top: 85,
        right: 25,
        borderRadius: 50,
        border: "1px solid #3f29b2",
        backgroundColor: "#fff"
    },
    bluecolor: {
        color: "#3f29b2"
    },
    uploadviewtext: {
        flexDirection: "column",
        marginVertical: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    uploadtextfirst: {
        color: "#3f29b2",
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 2
    },
    uploadtextsecond: {
        color: "#000",
        marginVertical: 2,
        fontSize: 14,
    },
    uploadbtngroupview: {
        flexDirection: "row"
    },
    uploadlinearview: {
        borderRadius: 30,
        justifyContent: "space-between",
        marginHorizontal: 20
    },
    uploadiconbtn: {
        padding: 10
    },
    uploadbtn: {
        paddingHorizontal: 40,
        paddingVertical: 10
    },
    uploadbtntext: {
        color: "#fff",
        fontSize: 14,
        fontWeight: 500
    },
    metadataview: {
        backgroundColor: "#fff",
        width: "100%",
        flexDirection: "column",
        justifyContent: "flex-end"
    },
    videoDetailView: {
        width: "100%",
        padding: 15
    },
    videoDetailTextInput: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        fontSize: 14,
        borderBottomColor: "#3b8ad0",
        borderBottomWidth: 2,
        width: "100%",
        color: "#000",
    },
    videouploadlinearview: {
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 30,
        position: "relative",
        overflow: "hidden"
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
    codeWrapper: {
        width: "50%",
        marginTop: 40
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
    button: {
        marginTop: 30,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    qrCodeDialogWrapper: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        left: 0,
        top: 0,
    },
    qrCodeDialog: {
        position: 'absolute',
        maxWidth: 330,
        maxHeight: 360,
        padding: 15,
        borderRadius: 5,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'right',
        backgroundColor: 'white'
    },
    closeImage: {
        width: 15,
        height: 15,
        marginBottom: 10,
        marginLeft: 'auto'
    }
});

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(Upload);