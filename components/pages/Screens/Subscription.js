import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useMediaQuery } from "react-responsive";
import { connect } from "react-redux";
import { apiURL } from '../../config/config';
import isEmpty from '../../config/is-empty';

const Subscription = (props) => {
    const [channelName, setchannelName] = useState("");
    const [result, setResult] = useState([]);
    const [feeds, setFeeds] = useState([]);

    // mobile and desktop variable for responsive
    const isMobile = useMediaQuery({
        query: "(max-device-width: 500px)"
    });

    const isTabletOrMobile = useMediaQuery({
        query: "(min-device-width: 500px)"
    });

    const isTablet = useMediaQuery({
        query: "(min-device-width: 768px)"
    });

    const isDesktop = useMediaQuery({
        query: "(min-device-width: 1024px)"
    });

    const isWide = useMediaQuery({
        query: "(min-device-width: 1441px)"
    });
    // end

    const changeCategoryItem = (itemname) => {
        setchannelName(itemname);
        const feeds = result.filter((item) => item.channelName == itemname);
        console.log("feeds===>>", feeds[0].contents);
        if (!isEmpty(feeds[0].contents)) {
            feeds[0].contents.sort((a, b) => {
                return new Date(b.postDate) - new Date(a.postDate);
            });
        }
        setFeeds(feeds[0].contents);
    };

    useEffect(() => {
        axios.post(apiURL + "/api/Upsocial/getAll/channels", {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            const result = res.data.channelData.filter((item) => item.followers.includes(props.auth.user.curUser));
            setResult(result);
            console.log(result);
        }).catch((err) => {
            console.warn(err);
        });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.topSection}>
                <Text style={styles.Followed}>Followed Channel!</Text>
            </View>
            <View style={styles.channelList}>
                {result && result.map((index, key) => {
                    return (
                        <TouchableOpacity key={key} style={channelName === index.channelName ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem(index.channelName)}>
                            <Image source={{ uri: index.photo }} style={{ width: 40, height: 40, borderRadius: 12 }} />
                            <Text style={channelName === index.channelName ? styles.active_categorytext : styles.categorytext}>{index.channelName}</Text>
                        </TouchableOpacity>
                    )
                })}
                {!result && <Text>No Data</Text>}
            </View>
            <View style={styles.feedSection}>
                <Text style={styles.Followed}>Recommended Videos</Text>
            </View>
            <View style={styles.board}>
                {!isEmpty(feeds) && feeds.map((index, key) => {
                    return (
                        <TouchableOpacity style={isWide ? styles.wideitemview : isDesktop ? styles.desktopitemview : isTablet ? styles.tabletitemview : isTabletOrMobile ? styles.tabletormobileitemview : styles.mobileitemview} key={key} onPress={() => watchVideo(index)}>
                            <View style={{ alignItems: 'center', width: "100%" }}>
                                <Image source={{ uri: index.thumbnail }} style={{ width: "100%", height: Dimensions.get("window").height * 0.3, borderRadius: 12 }} />
                                <Image source={require("../../../assets/logos/playvideo.png")} style={{ width: 50, height: 50, position: "absolute", top: "40%" }} />
                            </View>
                            <Text>{index.title}</Text>
                            <Text>{index.description}</Text>
                            <Text>{new Date(new Date() - new Date(index.postDate)).getHours()} hours before</Text>
                        </TouchableOpacity>
                    )
                })}
                {isEmpty(feeds) && <Text>No Data</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topSection: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    Followed: {
        fontSize: 20,
    },
    feedSection: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    channelList: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        overflow: "auto",
    },
    categoryitem: {
        paddingVertical: 20,
        marginHorizontal: 10,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "transparent",
        justifyContent: "center",
        alignItems: "center"
    },
    active_categoryitem: {
        paddingVertical: 20,
        marginHorizontal: 10,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "transparent",
        borderBottomColor: "rgb(156, 38, 176)",
        justifyContent: "center",
        alignItems: "center"
    },
    categorytext: {
        fontSize: 14,
        color: "rgb(197, 197, 197)",
    },
    active_categorytext: {
        color: "rgb(156, 38, 176)",
        fontSize: 14
    },
    board: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",

    },
    wideitemview: {
        alignItems: "center",
        width: "20%",
        padding: 10
    },
    mobileitemview: {
        alignItems: "center",
        width: "50%",
        padding: 10,
    },
    tabletitemview: {
        alignItems: "center",
        width: "33%",
        padding: 10
    },
    desktopitemview: {
        alignItems: "center",
        width: "25%",
        padding: 10
    },
    tabletormobileitemview: {
        alignItems: 'center',
        width: "50%",
        padding: 10
    },
});

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(Subscription);