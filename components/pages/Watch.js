import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView, VirtualizedList, SafeAreaView, FlatList } from "react-native";
import { Video, ResizeMode } from "expo-av";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { apiURL } from "../config/config";

const Watch = (props) => {

    const [videoSource, SetVideoSource] = useState({ uri: "https://g.upsocial.com/ipfs/QmfATQNSR2sbFAQwfgycZyzXqYcAT4TXPSeyyMTjekaUR9" });
    const [title, setTitle] = useState("FOX News");
    const [description, setDescription] = useState("Elon Muck's rocket SpaceX launching");
    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState("");
    const [ID, setId] = useState("");
    const [thumbnail, setThumbnail] = useState({ uri: "https://g.upsocial.com/ipfs/QmYrC4BL87hVcLCbNiRQwtjPnCoN1kvSLi221oSrA6vqXt" });

    const setCurrentVideoData = (item) => {
        setId(item.ID);
        setTitle(item.title);
        setDescription(item.description);
        setKeyword(item.keyword);
        setCategory(item.category);
        SetVideoSource({ uri: item.ipfsUrl });
        setThumbnail({ uri: item.thumbnail });
    };

    const ListItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.item} onPress={() => setCurrentVideoData(item)}>
                <Image
                    source={{
                        uri: item.thumbnail,
                    }}
                    style={styles.itemPhoto}
                    resizeMode="cover"
                />
                <Image source={require("../../assets/logos/playvideo.png")} style={{ width: 50, height: 50, position: "absolute", top: "40%", left: "30%" }} />
            </TouchableOpacity>
        );
    };

    const TopVideo = useRef(null);
    const [status, setStatus] = useState({});
    const [data, setData] = useState([
        {
            "ID": 0,
            "email": "kogutstt2@gmail.com",
            "title": "How to learn music?",
            "status": true,
            "ipfsUrl": "https://g.upsocial.com/ipfs/QmUQypwRoVf1PpwmDgHPP6Fear4Q7tdgE1D932itw13jJo",
            "keyword": "introduction",
            "category": "backend",
            "thumbnail": "https://g.upsocial.com/ipfs/QmXJoA3vuqYZkEn5vsm2oscDuX1Y8yZVeZavDgzJYbUu9m",
            "description": "Learning music free online"
        },
        {
            "ID": 1,
            "email": "kogutstt2@gmail.com",
            "title": "Learning English",
            "status": false,
            "ipfsUrl": "https://g.upsocial.com/ipfs/QmUQypwRoVf1PpwmDgHPP6Fear4Q7tdgE1D932itw13jJo",
            "keyword": "introduction",
            "category": "backend",
            "thumbnail": "https://g.upsocial.com/ipfs/QmQGtYw4QpR8oucMEgNSTCrM1mnKu3GxePo3sSfES3QDZe",
            "description": "Learn english online free"
        },
        {
            "ID": 2,
            "email": "kogutstt2@gmail.com",
            "title": "what is cook?",
            "status": true,
            "ipfsUrl": "https://g.upsocial.com/ipfs/QmUQypwRoVf1PpwmDgHPP6Fear4Q7tdgE1D932itw13jJo",
            "keyword": "introduction",
            "category": "backend",
            "thumbnail": "https://g.upsocial.com/ipfs/QmeavuHFKnhKpw4Cha9ysRAuCr6peZPvG7penDMrygNjk3",
            "description": "BBC NEWs"
        },
        {
            "email": "tomford@gmail.com",
            "title": "Hello girls",
            "ipfsUrl": "https://g.upsocial.com/ipfs/QmUQypwRoVf1PpwmDgHPP6Fear4Q7tdgE1D932itw13jJo",
            "keyword": "introduction",
            "category": "backend",
            "thumbnail": "https://g.upsocial.com/ipfs/QmeCVhxEfsfz482iZEEUkRuAM5jqqBEbBBDXobTtxaebYD",
            "description": "How to talk to girl first?"
        },
        {
            "ID": 4,
            "title": "SpaceX launch",
            "status": true,
            "ipfsUrl": "https://g.upsocial.com/ipfs/QmW5SKwvKW3pb9YNxKD7up748ZJJzYoaLCRHBUYrarqFFS",
            "keyword": "asdad",
            "category": "sad",
            "thumbnail": "https://g.upsocial.com/ipfs/QmbU2GJMnQAJTHaedqGJXeGKo41Uec8UeDn6hcD28Xj2bQ",
            "description": "Elon Musk launched SpaceX"
        },
    ]);

    // useEffect(() => {
    //     axios.post(apiURL + "/api/Upsocial/users/getAll/UploadedContent", { limit: limit }).then((res) => {
    //         setData(res.data.data);
    //     }).catch((err) => {
    //         console.warn(err);
    //     });
    // }, []);

    return (
        <View style={styles.container}>
            <View>
                <View style={{ height: Dimensions.get("window").height * 0.35 }}>
                    <Video
                        ref={TopVideo}
                        videoStyle={{ position: 'relative', margin: 'auto', maxWidth: 400, width: "100%", height: "100%", aspectRatio: 1 / 2 }}
                        style={{ width: "100%", height: Dimensions.get("window").height * 0.35, justifyContent: "center", alignItems: "center" }}
                        source={videoSource}
                        isLooping
                        useNativeControls
                        resizeMode={ResizeMode.STRETCH}
                        onPlaybackStatusUpdate={status => setStatus(() => status)}
                    />
                </View>
                <View style={{ alignItems: "center" }}>
                    <View style={{ flexDirection: "row", gap: 20, marginHorizontal: 20, marginVertical: 10, backgroundColor: "#000" }}>
                        <TouchableOpacity onPress={() => props.setName("profile")}>
                            <View style={{ flexDirection: "column", alignItems: "center", gap: 5 }}>
                                <View style={{ color: "#fff", fontWeight: "bold" }}>
                                    <Image
                                        source={thumbnail}
                                        style={{
                                            height: 50,
                                            width: 80
                                        }}
                                    />
                                </View>
                                <Text style={{ color: "#fff", fontWeight: "bold" }}>{title}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ flex: 1, flexDirection: "column", gap: 10 }}>
                            <Text style={{ color: "#fff", fontWeight: "bold" }}>{description}</Text>
                            <Text style={{ color: "#5a5a5a", fontWeight: "bold" }}>333k views | 3,784 UPs | 11 hours ago</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ height: 200 }}>
                <FlatList
                    horizontal
                    data={data}
                    renderItem={({ item }) => <ListItem item={item} />}
                    showsHorizontalScrollIndicator={false}

                />
            </View>
            {/* <VirtualizedList
                keyExtractor={(item, key) => key}
                data={data}
                initialNumToRender={7}
                renderItem={() => {
                    return <FlatList
                        horizontal
                        data={data}
                        renderItem={({ item }) => <ListItem item={item} />}
                        showsHorizontalScrollIndicator={false}
                    />;
                }}
                getItem={(data, index) => {
                    return data[index];
                }}
                getItemCount={data => data.length}
            /> */}
            <View style={{ marginTop: 50, flexDirection: "row", height: "10%", justifyContent: "center", gap: 20 }}>
                <TouchableOpacity>
                    <Ionicons name="ios-home-sharp" color="#fff" size={50} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="lightning-bolt" color="#fff" size={50} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.setName("upload")}>
                    <Ionicons name="ios-add-circle" color="#fff" size={50} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="pin-outline" color="#fff" size={50} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="bookmark" color="#fff" size={50} />
                </TouchableOpacity>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000"
    },
    topBarContainer: {
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        flexDirection: "row",
        justifyContent: "space-between",
        height: 40,
        alignItems: "center",
        zIndex: 2,
        position: "absolute",
        top: 0,
        left: 0
    },
    topLogo: {
        height: 30,
        width: 30
    },
    sectionHeader: {
        fontWeight: '800',
        fontSize: 18,
        color: '#f4f4f4',
        marginTop: 20,
        marginBottom: 5,
    },
    item: {
        margin: 10,
        width: 200,
        height: 200,
    },
    itemPhoto: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
        borderColor: "red"
    },
    itemText: {
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: 5,
    },
});

export default Watch;