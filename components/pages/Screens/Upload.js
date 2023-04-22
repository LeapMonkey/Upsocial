import React, { useState, useRef } from 'react';
import Ionicons from "react-native-vector-icons/Ionicons";
import { LinearGradient } from 'expo-linear-gradient';
import Foundation from "react-native-vector-icons/Foundation";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ScrollView, StyleSheet, View, TouchableOpacity, Text, TextInput, Image, Dimensions } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Video, ResizeMode } from "expo-av";
import { ToastAndroid, Platform } from 'react-native';
import axios from 'axios';
import { apiURL, API_UPLOAD_URL } from '../../config/config';
import { connect } from "react-redux";

const Upload = (props) => {

    const [image, setImage] = useState(null);
    const video = useRef(null);
    const [status, setStatus] = useState({});
    const [cameraStatus, requestPermission] = ImagePicker.useCameraPermissions();

    // Metadata values
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState("");

    // Video file data
    const [videoUri, setVideoUri] = useState("");
    const [name, setName] = useState("");
    const [type, setType] = useState("");

    const [cid, setCID] = useState("");

    const [loading, setLoading] = useState(false);

    // Reset function
    const resetValues = () => {
        setTitle("");
        setDescription("");
        setKeyword("");
        setCategory("");
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

        await axios.post(API_UPLOAD_URL + "/generate-ipfs", VideoFormData, { headers }).then((res) => {
            console.log(res.data.data.ipfsUrl);
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

        await axios.post(API_UPLOAD_URL + "/generate-ipfs", ThumbnailFormData, { headers }).then((res) => {
            console.log(res.data.data.ipfsUrl);
            thumbnail = res.data.data.ipfsUrl;
        }).catch((err) => {
            console.log(err);
        });

        const contentData = {
            title: title,
            description: description,
            keyword: keyword,
            category: category,
            userEmail: "kogutstt2@gmail.com", //props.auth.user.curUser
            ipfsUrl: cid,
            thumbnail: thumbnail
        };
        console.log(contentData);
        axios
            .post(apiURL + "/api/Upsocial/users/content/uploadContent", contentData)
            .then((res) => {
                setLoading(false);
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

        setImage(localUri);
        console.log(localUri);
        setVideoUri(localUri);
        setName(filename);
        console.log(filename);
        setType(type);
        console.log(type);

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

        setImage(localUri);

        setVideoUri(localUri);
        setName(filename);
        setType(type);
    };

    return (
        <View style={styles.container}>
            {loading && (
                <View style={styles.loadingView}>
                    <Image
                        source={require("../../../assets/loading.gif")}
                        style={{ width: 140, height: 140 }}
                    />
                </View>
            )}
            <View>
                {image ? (
                    <Video
                        ref={video}
                        videoStyle={{ position: "relative", margin: 'auto', maxWidth: 400 }}
                        style={styles.videoPreviewer}
                        source={{ uri: image }}
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
                                </>) : (<LinearGradient
                                    colors={['#621a9f', '#3521b3']}
                                    style={styles.uploadlinearview}
                                >
                                    <TouchableOpacity style={styles.uploadbtn} onPress={addImageGallery}>
                                        <Text style={styles.uploadbtntext}>UPLOAD</Text>
                                    </TouchableOpacity>
                                </LinearGradient>)}
                            </View>
                        </View>
                    )}
            </View>
            {
                image && (
                    <LinearGradient colors={['#fcfbff', '#f9f9fb']} style={styles.metadataview}>
                        <View style={{ position: "relative", marginBottom: 50 }}>
                            <View style={{ position: "absolute", top: 0, left: "10%", transform: [{ translateY: -100 }], width: "80%", backgroundColor: "#fff", borderRadius: 5, flexDirection: "column", alignItems: "center" }}>
                                <View style={styles.videoDetailView}>
                                    <Text>Title</Text>
                                    <TextInput value={title} onChangeText={(e) => setTitle(e)} placeholder="Content Title" placeholderTextColor="#adb2b6" style={styles.videoDetailTextInput} />
                                </View>
                                <View style={styles.videoDetailView}>
                                    <Text>Description</Text>
                                    <TextInput value={description} onChangeText={(e) => setDescription(e)} placeholder="Content Description" placeholderTextColor="#adb2b6" style={styles.videoDetailTextInput} />
                                </View>
                                <View style={styles.videoDetailView}>
                                    <Text>Keyword</Text>
                                    <TextInput value={keyword} onChangeText={(e) => setKeyword(e)} placeholder="keyword" placeholderTextColor="#adb2b6" style={styles.videoDetailTextInput} />
                                </View>
                                <View style={styles.videoDetailView}>
                                    <Text>Category</Text>
                                    <TextInput value={category} onChangeText={(e) => setCategory(e)} placeholder="Category" placeholderTextColor="#adb2b6" style={styles.videoDetailTextInput} />
                                </View>
                                <View style={{ width: Dimensions.get("window").height - 30, flexDirection: "row", justifyContent: "space-between" }}>
                                    <LinearGradient
                                        colors={['#621a9f', '#3521b3']}
                                        style={styles.videouploadlinearview}
                                    >
                                        <TouchableOpacity onPress={uploadContent}>
                                            <Text style={styles.whitecolor}>UPLOAD</Text>
                                        </TouchableOpacity>
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
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
        width: "100%"
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
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "50%",
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