import React, { useState, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

const Browse = (props) => {

    const data = [
        {
            email: "kogutstt2@gmail.com",
            title: "video2 title",
            ipfsUrl: "https://g.upsocial.com/ipfs/QmUQypwRoVf1PpwmDgHPP6Fear4Q7tdgE1D932itw13jJo",
            keyword: "introduction",
            category: "backend",
            thumbnail: "https://g.upsocial.com/ipfs/QmYrC4BL87hVcLCbNiRQwtjPnCoN1kvSLi221oSrA6vqXt",
            description: "video2 description"
        },
        {
            email: "kogutstt2@gmail.com",
            title: "video2 title",
            ipfsUrl: "https://g.upsocial.com/ipfs/QmUQypwRoVf1PpwmDgHPP6Fear4Q7tdgE1D932itw13jJo",
            keyword: "introduction",
            category: "backend",
            thumbnail: "https://g.upsocial.com/ipfs/QmYrC4BL87hVcLCbNiRQwtjPnCoN1kvSLi221oSrA6vqXt",
            description: "video2 description"
        },
        {
            email: "kogutstt2@gmail.com",
            title: "video2 title",
            ipfsUrl: "https://g.upsocial.com/ipfs/QmUQypwRoVf1PpwmDgHPP6Fear4Q7tdgE1D932itw13jJo",
            keyword: "introduction",
            category: "backend",
            thumbnail: "https://g.upsocial.com/ipfs/QmYrC4BL87hVcLCbNiRQwtjPnCoN1kvSLi221oSrA6vqXt",
            description: "video2 description"
        },
        {
            email: "tomford@gmail.com",
            title: "video2 title",
            ipfsUrl: "https://g.upsocial.com/ipfs/QmUQypwRoVf1PpwmDgHPP6Fear4Q7tdgE1D932itw13jJo",
            keyword: "introduction",
            category: "backend",
            thumbnail: "https://g.upsocial.com/ipfs/QmYrC4BL87hVcLCbNiRQwtjPnCoN1kvSLi221oSrA6vqXt",
            description: "video2 description"
        },
        {
            email: "tomford@gmail.com",
            title: "video2 title",
            ipfsUrl: "https://g.upsocial.com/ipfs/QmUQypwRoVf1PpwmDgHPP6Fear4Q7tdgE1D932itw13jJo",
            keyword: "introduction",
            category: "backend",
            thumbnail: "https://g.upsocial.com/ipfs/QmYrC4BL87hVcLCbNiRQwtjPnCoN1kvSLi221oSrA6vqXt",
            description: "video2 description"
        },
        {
            email: "tomford@gmail.com",
            title: "video2 title",
            ipfsUrl: "https://g.upsocial.com/ipfs/QmUQypwRoVf1PpwmDgHPP6Fear4Q7tdgE1D932itw13jJo",
            keyword: "introduction",
            category: "backend",
            thumbnail: "https://g.upsocial.com/ipfs/QmYrC4BL87hVcLCbNiRQwtjPnCoN1kvSLi221oSrA6vqXt",
            description: "video2 description"
        }
    ];

    const watchVideo = (videoData) => {
        props.setvideoflag(true, videoData);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.topBarContainer}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                        source={require("../../assets/logos/imagelogo.png")}
                        style={styles.topLogo}
                    />
                    <Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>UpSocial</Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="search" color="#fff" size={30} />
                </TouchableOpacity>
            </View>
            <View style={styles.board}>
                {data.map((index, key) => {
                    return (
                        <TouchableOpacity style={{ alignItems: 'center', width: "50%", padding: 10 }} key={key} onPress={() => watchVideo(index)}>
                            <View style={{ alignItems: 'center', width: "100%" }}>
                                <Image source={{ uri: index.thumbnail }} style={{ width: "100%", height: Dimensions.get("window").height * 0.3, borderRadius: 12 }} />
                            </View>
                            <Text>{index.title}</Text>
                            <Text>{index.description}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    board: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",

    },
    topBarContainer: {
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        flexDirection: "row",
        justifyContent: "space-between",
        height: 40,
        alignItems: "center",
        zIndex: 2,
    },
    topLogo: {
        height: 30,
        width: 30
    }
});

export default Browse;
