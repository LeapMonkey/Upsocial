import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView, SectionList, SafeAreaView, FlatList } from "react-native";
import { Video, ResizeMode } from "expo-av";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";



const SECTIONS = [
    {
        title: 'Made for you',
        horizontal: true,
        data: [
            {
                key: '1',
                text: 'Item text 1',
                uri: 'https://g.upsocial.com/ipfs/QmYrC4BL87hVcLCbNiRQwtjPnCoN1kvSLi221oSrA6vqXt',
            },
            {
                key: '2',
                text: 'Item text 2',
                uri: 'https://g.upsocial.com/ipfs/QmYrC4BL87hVcLCbNiRQwtjPnCoN1kvSLi221oSrA6vqXt',
            },

            {
                key: '3',
                text: 'Item text 3',
                uri: 'https://g.upsocial.com/ipfs/QmYrC4BL87hVcLCbNiRQwtjPnCoN1kvSLi221oSrA6vqXt',
            },
            {
                key: '4',
                text: 'Item text 4',
                uri: 'https://g.upsocial.com/ipfs/QmYrC4BL87hVcLCbNiRQwtjPnCoN1kvSLi221oSrA6vqXt',
            },
            {
                key: '5',
                text: 'Item text 5',
                uri: 'https://g.upsocial.com/ipfs/QmYrC4BL87hVcLCbNiRQwtjPnCoN1kvSLi221oSrA6vqXt',
            },
        ],
    },
];


const ListItem = ({ item }) => {
    return (
        <View style={styles.item}>
            <Image
                source={{
                    uri: item.uri,
                }}
                style={styles.itemPhoto}
                resizeMode="cover"
            />
        </View>
    );
};

const Watch = (props) => {
    const TopVideo = useRef(null);
    const [status, setStatus] = useState({});

    return (
        <View style={styles.container}>
            <View>
                <View style={{ height: Dimensions.get("window").height * 0.35 }}>
                    <Video
                        ref={TopVideo}
                        style={{ width: "100%", height: Dimensions.get("window").height * 0.35 }}
                        source={require("../../assets/video/elonmusk.mp4")}
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
                                    source={require("../../assets/logos/fox.png")}
                                    style={{
                                        height: 50,
                                        width: 80
                                    }}
                                />
                            </View>
                            <Text style={{ color: "#fff", fontWeight: "bold" }}>Fox News</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ flex: 1, flexDirection: "column", gap: 10 }}>
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>Elon Musk Lanunches Another rocket into space making history again</Text>
                        <Text style={{ color: "#5a5a5a", fontWeight: "bold" }}>333k views | 3,784 UPs | 11 hours ago</Text>
                    </View>
                </View>
            </View>
            <SafeAreaView style={{ flex: 1 }}>
                <SectionList
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    stickySectionHeadersEnabled={false}
                    sections={SECTIONS}
                    renderSectionHeader={({ section }) => (
                        <>
                            {section.horizontal ? (
                                <FlatList
                                    horizontal
                                    data={section.data}
                                    renderItem={({ item }) => <ListItem item={item} />}
                                    showsHorizontalScrollIndicator={false}
                                />
                            ) : null}
                        </>
                    )}
                    renderItem={({ item, section }) => {
                        if (section.horizontal) {
                            return null;
                        }
                        return <ListItem item={item} />;
                    }}
                />
            </SafeAreaView>
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
    },
    itemText: {
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: 5,
    },
});

export default Watch;