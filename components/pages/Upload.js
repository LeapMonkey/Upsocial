import React, { useState, useRef } from 'react';
import Ionicons from "react-native-vector-icons/Ionicons";
import Foundation from "react-native-vector-icons/Foundation";
import { ScrollView, StyleSheet, View, TouchableOpacity, Text, TextInput, Image } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import { Video, ResizeMode } from "expo-av";
import Notification from '../Actions/Notification';
import axios from 'axios';
import { apiURL, API_UPLOAD_URL } from '../config/config';
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
    const [uri, setUri] = useState("");
    const [name, setName] = useState("");
    const [type, setType] = useState("");

    const [loading, setLoading] = useState(false);

    // Reset function
    const resetValues = () => {
        setTitle("");
        setDescription("");
        setKeyword("");
        setCategory("");
        setImage("");
        setUri("");
        setName("");
        setType("");

        Notification("All values are cleared! Try again!");
    };

    // Upload
    const uploadContent = async (e) => {
        e.preventDefault();

        setLoading(true);

        let formData = new FormData();
        let cid;

        formData.append('video', {
            uri: uri,
            name: name,
            type: type
        });

        let headers = {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
        };

        await axios.post(API_UPLOAD_URL + "/generate-ipfs", formData, { headers }).then((res) => {
            console.log(res.data.data.ipfsUrl);
            cid = res.data.data.ipfsUrl;
        }).catch((err) => {
            console.log(err);
            setLoading(false);
        });

        const contentData = {
            title: title,
            description: description,
            keyword: keyword,
            category: category,
            userEmail: props.auth.user.curUser,
            ipfsUrl: cid
        };
        axios
            .post(apiURL + "/api/Upsocial/users/content/uploadContent", contentData)
            .then((res) => {
                setLoading(false);
                Notification(res.data.msg);
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

        setUri(localUri);
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

        setImage(localUri);

        setUri(localUri);
        setName(filename);
        setType(type);
    };

    return (
        <ScrollView style={styles.container}>
            {loading && (
                <View style={styles.loadingView}>
                    <Image
                        source={require("../../assets/loading.gif")}
                        style={{ width: 140, height: 140 }}
                    />
                </View>
            )}
            <View style={styles.backArrow}>
                <TouchableOpacity onPress={() => props.setName("explore")}>
                    <Ionicons name="arrow-back-sharp" color="#fff" size={30} />
                </TouchableOpacity>
            </View>
            <View>
                <Text style={styles.Title}>Upload your content</Text>
            </View>
            <View>
                {image ? (
                    <Video
                        ref={video}
                        style={styles.videoPreviewer}
                        source={{ uri: image }}
                        isLooping
                        useNativeControls
                        resizeMode={ResizeMode.STRETCH}
                        onPlaybackStatusUpdate={status => setStatus(() => status)}
                    />) :
                    (
                        <Image source={require("../../assets/videoPreviewer.png")} style={styles.videoPreviewer} />
                    )}

            </View>
            <View style={styles.btnGroup}>
                <TouchableOpacity style={[{ backgroundColor: '#4468b0' }, styles.loginbtn]} onPress={addImageGallery}>
                    <Ionicons name="md-folder-outline" color="#fff" size={30} />
                </TouchableOpacity>
                <TouchableOpacity style={[{ backgroundColor: '#4468b0' }, styles.loginbtn]} onPress={addImageCamera}>
                    <Ionicons name="camera-sharp" color="#fff" size={30} />
                </TouchableOpacity>
            </View>
            {image && (<><View>
                <Text style={styles.MetadataTitle}>Complete metadata</Text>
            </View>
                <View>
                    <TextInput value={title} onChangeText={(e) => setTitle(e)} placeholder="Content Title" placeholderTextColor="#adb2b6" style={styles.TextInput} />
                </View>
                <View>
                    <TextInput value={description} onChangeText={(e) => setDescription(e)} placeholder="Content Description" placeholderTextColor="#adb2b6" style={styles.TextInput} />
                </View>
                <View>
                    <TextInput value={keyword} onChangeText={(e) => setKeyword(e)} placeholder="keyword" placeholderTextColor="#adb2b6" style={styles.TextInput} />
                </View>
                <View>
                    <TextInput value={category} onChangeText={(e) => setCategory(e)} placeholder="Category" placeholderTextColor="#adb2b6" style={styles.TextInput} />
                </View>
                <View style={styles.btnUpload}>
                    <TouchableOpacity style={[{ backgroundColor: '#4468b0' }, styles.upload]} onPress={uploadContent}>
                        <Foundation name="upload" color="#fff" size={30} />
                        <Text style={styles.uploadTitle}>Upload</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[{ backgroundColor: '#4468b0' }, styles.upload]} onPress={resetValues}>
                        <Ionicons name="refresh" color="#fff" size={30} />
                        <Text style={styles.uploadTitle}>Reset</Text>
                    </TouchableOpacity>
                </View></>)}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000"
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
        height: 400,
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
    }
});

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(Upload);