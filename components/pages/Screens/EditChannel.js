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
import { connect } from "react-redux";
import { apiURL } from "../../config/config";
import axios from "axios";

const EditChannel = (props) => {
    const [channelName, setChannelName] = useState("");
    const [handleUrl, setHandleUrl] = useState("");
    const [aboutChannel, setAboutChannel] = useState("");
    const [location, setLocation] = useState("");
    const [url, setUrl] = useState("");
    const [uploadimagedata, setUploadimagedata] = useState(null);
    const [loading, setLoading] = useState(false);

    const setimagefunc = (imagedata) => {
        setUploadimagedata(imagedata);
    };

    // tags
    const [keyword, setKeyword] = useState("");
    const [keywords, setKeywords] = useState([]);
    // end

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
                    props.navigation.navigate("Channel Lists");
                } else {
                    setLoading(false);
                    alert(res.data.msg);
                }
            }).catch((error) => {
                console.warn(error);
                setLoading(false);
            })

        }
    };

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
                            onChangeText={(e) => setLocation(e)}
                        />
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
                                <Text style={{ color: "#fff", fontSize: 24 }} key={key}>{index}</Text>
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
});


const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(EditChannel);
