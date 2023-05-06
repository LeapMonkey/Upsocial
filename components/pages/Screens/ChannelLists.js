import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import axios from 'axios';
import { useMediaQuery } from "react-responsive";
import { connect } from "react-redux";
import { apiURL } from '../../config/config';

const ChannelLists = (props) => {

    // responsive
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
    // End

    const [result, setResult] = useState([]);
    const [followed, setFollowed] = useState(false);

    useEffect(() => {
        axios.post(apiURL + "/api/Upsocial/getAll/channels", {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            setResult(res.data.channelData);
            setFollowed(!followed);
        }).catch((err) => {
            console.warn(err);
        });
    }, [followed]);

    const followChannel = (channelData) => {
        axios.post(apiURL + "/api/Upsocial/follow/channel", {
            curUser: props.auth.user.curUser,
            channelName: channelData.channelName,
            aboutChannel: channelData.aboutChannel,
            handleUrl: channelData.handleUrl,
            location: channelData.location,
            tags: channelData.tags,
            url: channelData.url,
            photo: channelData.photo,
            userEmail: channelData.email,
        }, {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            if (res.data.channelData.followers.includes(props.auth.user.curUser)) {
                setFollowed(true);
            }
            alert("success!")
        }).catch((err) => {
            console.warn(err);
        });
    };

    const unfollowChannel = (channelData) => {
        axios.post(apiURL + "/api/Upsocial/unFollow/channel", {
            curUser: props.auth.user.curUser,
            channelName: channelData.channelName,
            aboutChannel: channelData.aboutChannel,
            handleUrl: channelData.handleUrl,
            location: channelData.location,
            tags: channelData.tags,
            url: channelData.url,
            photo: channelData.photo,
            userEmail: channelData.email,
        }, {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            if (!res.data.channelData.followers.includes(props.auth.user.curUser)) {
                setFollowed(false);
            }
            alert("success!")
        }).catch((err) => {
            console.warn(err);
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1, width: "100%" }}>
                <View style={styles.board}>
                    {result && result.map((index, key) => {
                        return (
                            <View style={isWide ? styles.wideitemview : isDesktop ? styles.desktopitemview : isTablet ? styles.tabletitemview : isTabletOrMobile ? styles.tabletormobileitemview : styles.mobileitemview} key={key} onPress={() => watchVideo(index, key)}>
                                <View style={{ alignItems: 'center', width: "100%" }}>
                                    <Image source={{ uri: index.photo }} style={{ width: "100%", height: Dimensions.get("window").height * 0.3, borderRadius: 12 }} />
                                </View>
                                <View style={styles.channelDetail}>
                                    <View style={styles.channels}>
                                        <Text>{index.channelName}</Text>
                                        <Text>{index.aboutChannel}</Text>
                                    </View>
                                    {index.followers.includes(props.auth.user.curUser) ? (
                                        <TouchableOpacity style={styles.section} onPress={() => unfollowChannel(index)}>
                                            <Text style={styles.paragraph}>UnFollow</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity style={styles.section} onPress={() => followChannel(index)}>
                                            <Text style={styles.paragraph}>Follow</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 20,
        marginBottom: 10,
    },
    board: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",

    },
    tabletormobileitemview: {
        alignItems: 'center',
        width: "50%",
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
    wideitemview: {
        alignItems: "center",
        width: "20%",
        padding: 10
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        backgroundColor: "#5E1DA6",
        color: "#fff",
        borderRadius: 2
    },
    paragraph: {
        color: "#fff"
    },
    channelDetail: {
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 5
    },
    channels: {
        width: "60%",
        flexDirection: "column",
        gap: 2.5,
        alignItems: "center",
        justifyContent: "center"
    }
});

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(ChannelLists);