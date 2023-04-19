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
            </TouchableOpacity>
        );
    };

    const TopVideo = useRef(null);
    const [status, setStatus] = useState({});
    const [data, setData] = useState([]);
    const [limit, setLimit] = useState(5);

    useEffect(() => {
        axios.post(apiURL + "/api/Upsocial/users/getAll/UploadedContent", { limit: limit }).then((res) => {
            setData(res.data.data);
        }).catch((err) => {
            console.warn(err);
        });
    }, []);

    return (
        <View style={styles.container}>
            <View>
                <View style={{ height: Dimensions.get("window").height * 0.35 }}>
                    <Video
                        ref={TopVideo}
                        style={{ width: "100%", height: Dimensions.get("window").height * 0.35 }}
                        source={videoSource}
                        isLooping
                        useNativeControls
                        resizeMode={ResizeMode.STRETCH}
                        onPlaybackStatusUpdate={status => setStatus(() => status)}
                    />
                </View>
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
            <VirtualizedList
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
            />
            <View style={{ flexDirection: "row", height: "10%", justifyContent: "center", gap: 20 }}>
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
    },
    itemPhoto: {
        width: 200,
        height: 200,
        borderRadius: 12,
        borderColor: "red"
    },
    itemText: {
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: 5,
    },
});

export default Watch;