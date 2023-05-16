import React, { useState, useEffect, useRef } from 'react';
import { connect } from "react-redux";
import { MaterialCommunityIcons, MaterialIcons, Feather, Ionicons } from 'react-native-vector-icons';
import { Text, StyleSheet, Image, View, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { useMediaQuery } from "react-responsive";
import { Video, ResizeMode } from "expo-av";
import isEmpty from '../../config/is-empty';
import { apiURL } from '../../config/config';
import axios from 'axios';
import UploadChannel from '../upload/UploadChannel';

const items = [
    { id: 1, name: 'CHANNELS' },
    { id: 2, name: 'RECENT UPLOADS' },
    { id: 3, name: 'HISTORY' },
];


const MyVideos = (props) => {

    useEffect(() => {
        axios.post(apiURL + "/api/Upsocial/getAll/channels", {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            const result = res.data.channelData.filter((item) => item.email == props.auth.user.curUser);
            setResult(result);

        }).catch((err) => {
            console.warn(err);
        });
    }, []);

    const [categoryName, setCategoryName] = useState("CHANNELS");
    const [optionName, setOptionName] = useState("My Channels");
    const [result, setResult] = useState([]);

    const [options, setOptions] = useState([
        { id: 1, name: 'My Channels', icon: "list-sharp" },
        { id: 2, name: 'Add a Channel', icon: "add-circle" },
    ])

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

    const changeOptionItem = (itemname) => {
        setOptionName(itemname);
        console.log(itemname);
    };

    const channelDetail = (item) => {
        console.log(item);
    };

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
                console.log(res.data);
                if (res.data.status) {
                    setLoading(false);
                    alert("Creating Channel success !");
                    props.navigation.navigate("Channel Lists");
                } else {
                    setLoading(false);
                    alert(res.data.msg);
                }
            }).catch((error) => {
                console.log(error);
                setLoading(false);
            })

        }
    };

    return (
        <View style={styles.main}>
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
                        <TouchableOpacity style={styles.iconbtn}>
                            <MaterialIcons name="search" color="#fff" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconbtn}>
                            <Feather name="user" color="#fff" size={35} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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
                                <TouchableOpacity key={key} style={styles.mobileitemview}>
                                    <TouchableOpacity style={{ alignItems: 'center', width: "100%" }} onPress={() => channelDetail(index)}>
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
            </View>)}
        </View >
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        width: "100%",
        position: "relative"
    },
    scrollview: {
        backgroundColor: "#eee",
        flex: 1
    },
    headersection: {
        height: Dimensions.get("window").height * 0.05,
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
        marginVertical: 30,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    mobileitemview: {
        alignItems: "center",
        width: "100%",
        padding: 10,
        position: "relative",
        height: "100%"
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
    TextInput: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        color: "#000",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
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
        color: "#000",
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

export default connect(mapStateToProps, {})(MyVideos);