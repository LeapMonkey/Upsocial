import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    TextInput,
    ToastAndroid,
    Platform,
    AlertIOS,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import UploadChannel from "../upload/UploadChannel";

const EditChannel = (props) => {
    const [result, setResult] = useState([]);
    const [isEnabled, setIsEnabled] = useState(false);
    const [channelName, setChannelName] = useState("");
    const [handleUrl, setHandleUrl] = useState("");
    const [aboutChannel, setAboutChannel] = useState("");
    const [location, setLocation] = useState("");
    const [tags, setTags] = useState("");
    const [url, setUrl] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [uploadimagedata, setUploadimagedata] = useState(null);

    const toggleSwitch = () => {
        setIsEnabled((previousState) => !previousState);
    };

    const setimagefunc = (imagedata) => {
        setUploadimagedata(imagedata);
    };

    const uploadData = () => {
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
        } else if (tags.trim() === "") {
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
            let formdata = new FormData();
            formdata.append("photo", uploadimagedata);
            formdata.append("channelName", channelName);
            formdata.append("date", date);
            formdata.append("user_id", props.auth.user.id);
            formdata.append("description", description);
            formdata.append("flag", isEnabled);
        }
    };

    return (
        <LinearGradient
            colors={['#2ab4fad9', '#1D2145']}
            style={styles.container}
        >
            <View>
                <Image source={require("../../../assets/logos/logo_wh.png")} style={{ height: 40, width: 230, marginTop: 10 }} />
            </View>
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
                            placeholderTextColor="#fff"
                            onChangeText={(e) => setChannelName(e)}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="URL Handle(Coming Soon)"
                            placeholderTextColor="#fff"
                            onChangeText={(e) => setHandleUrl(e)}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="About the channel"
                            placeholderTextColor="#fff"
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={(e) => setAboutChannel(e)}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Location (City, State)"
                            placeholderTextColor="#fff"
                            onChangeText={(e) => setLocation(e)}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Channel Tags (Up to 10)"
                            placeholderTextColor="#fff"
                            onChangeText={(e) => setTags(e)}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="URL"
                            placeholderTextColor="#fff"
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
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignItems: "center",
    },
    headersection: {
        backgroundColor: "#1f1f1f",
        width: "100%",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: "center",
    },
    headersubsection: {
        width: "85%",
    },
    headertitlesection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    headertitle: {
        color: "#f9f9f9",
        fontSize: 24,
        fontWeight: "bold",
    },
    headershopsection: {
        borderRadius: 6,
        backgroundColor: "#ccff00",
        paddingBottom: 3,
        paddingTop: 3,
        paddingRight: 8,
        paddingLeft: 8,
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
        borderBottomColor: "#fff",
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
    TextInput: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        color: "#fff",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    subinputtext: {
        marginHorizontal: 10,
        color: "#000",
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
});


export default EditChannel
