import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import axios from 'axios';
import { useMediaQuery } from "react-responsive";
import { connect } from "react-redux";
import { apiURL } from '../../config/config';
import isEmpty from '../../config/is-empty';

const MyChannel = (props) => {

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

    const channelDetail = (item) => {
        props.setflag("ViewChannel");
        props.setChannelData(item);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1, width: "100%" }}>
                <View style={styles.board}>
                    {result && result.map((index, key) => {
                        return (
                            <View style={isWide ? styles.wideitemview : isDesktop ? styles.desktopitemview : isTablet ? styles.tabletitemview : isTabletOrMobile ? styles.tabletormobileitemview : styles.mobileitemview} key={key} onPress={() => watchVideo(index, key)}>
                                <TouchableOpacity style={{ alignItems: 'center', width: "100%" }} onPress={() => channelDetail(index)}>
                                    <Image source={{ uri: index.photo }} style={{ width: "100%", height: Dimensions.get("window").height * 0.3, borderRadius: 12 }} />
                                </TouchableOpacity>
                                <View style={styles.channelDetail}>
                                    <View style={styles.channels}>
                                        <Text>{index.channelName}</Text>
                                        <Text>{index.aboutChannel}</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    })}
                    {isEmpty(result) && (
                        <View style={styles.nodataContainer}>
                            <Text style={styles.nodata_title}>No channels yet!</Text>
                            <Text style={styles.nodata_content}>Explore the moments. Create your channel</Text>
                        </View>
                    )}
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
    },
    nodataContainer: {
        flexDirection: "column",
        marginVertical: 20,
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    nodata_title: {
        color: "#3f29b2",
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 2
    },
    nodata_content: {
        color: "#000",
        marginVertical: 2,
        fontSize: 14,
    },
});

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(MyChannel);