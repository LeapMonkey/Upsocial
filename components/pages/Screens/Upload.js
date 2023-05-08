import React, { useState, useRef } from 'react';
import Ionicons from "react-native-vector-icons/Ionicons";
import { LinearGradient } from 'expo-linear-gradient';
import MultiSelect from "react-native-multiple-select";
import { FontAwesome5, MaterialCommunityIcons } from 'react-native-vector-icons';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text, TextInput, Image, Dimensions } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Video, ResizeMode } from "expo-av";
import { ToastAndroid, Platform } from 'react-native';
import axios from 'axios';
import { apiURL, API_UPLOAD_URL } from '../../config/config';
import { connect } from "react-redux";
import Modal from "react-native-modal";
import { generateVideoThumbnails } from "@rajesh896/video-thumbnails-generator";

const Upload = (props) => {

    const [image, setImage] = useState();
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

    const [cid, setCID] = useState("");

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
            alert("Max category is 3 !");
        } else {
            setSelectedItems(selectedItems);
        }
    };
    // Reset function
    const resetValues = () => {
        setTitle("");
        setDescription("");
        setKeyword("");
        setCategory([]);
        setKeywords([]);
        setImage("");
        setVideoUri("");
        setName("");
        setType("");

        if (Platform.OS === "android") {
            ToastAndroid.show("All values are cleared! Try again!", ToastAndroid.SHORT);
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
            console.log(err);
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
            console.log(err);
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
        let emb = `<iframe src="${cid}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" style="border:none; width:100%; height:100%; min-height:500px;" frameborder="0" scrolling="no"></iframe>`
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


    const [file, setFile] = useState({ file: null, error: '' });
    const [thumbnails, setThumbnails] = useState([]);


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
                        console.log(response.data.error);
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });

            setHashCode(cid);
            let URL = `${cid}`;
            setURL(URL);
            let emb = `<iframe src="${cid}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" style="border:none; width:100%; height:100%; min-height:500px;" frameborder="0" scrolling="no"></iframe>`
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

            await axios.post(apiURL + "/api/Upsocial/users/content/web/uploadContent", Thumbnail_formData, headers).then((res) => {
                if (res.data.status) {
                    setLoading(false);
                    setOpened(true);
                } else {
                    setLoading(false);
                }

            }).catch((err) => {
                console.log(err);
                setLoading(false);
            });
        }
    }

    const onFileChange = (event) => {
        const file = event.target.files[0];
        setFile({ file, error: '' });
        const url = URL.createObjectURL(file);
        setImage({ uri: url });

        if (file) {
            generateVideoThumbnails(file, 0).then((res) => {
                setThumbnails(res);
            }).catch((err) => console.log(err));
        }
    }
    return (
        <ScrollView style={styles.container} nestedScrollEnabled={true}>
            <Modal
                isVisible={opened}
                animationIn={'slideInRight'}
                animationOut={'slideOutRight'}
                style={{ margin: 0, padding: 0 }}
            >
                <View style={styles.videopage}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center", position: 'absolute', top: 0, left: 0, zIndex: 1000000 }}>
                        <TouchableOpacity onPress={() => setOpened(false)}>
                            <Ionicons name="arrow-back-sharp" color="#000" size={30} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "column", width: "100%", padding: 20, justifyContent: "center", alignItems: "center" }}>
                        <View style={{ flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontSize: 20, color: "#3f29b2" }}>HashCode: </Text>
                            <Text style={{ fontSize: 20 }}>{hashCode}</Text>
                        </View>
                        <View style={{ flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontSize: 20, color: "#3f29b2" }}>url: </Text>
                            <Text style={{ fontSize: 20 }}>{url}</Text>
                        </View>
                        <View style={{ flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontSize: 20, color: "#3f29b2" }}>embedCode: </Text>
                            <Text style={{ fontSize: 20 }}>{embedCode}</Text>
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
    }
});

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(Upload);