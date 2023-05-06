import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, Ionicons, Zocial } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { connect } from "react-redux";
import Videos from "../mock/Videos";
import axios from "axios";
import { apiURL } from "../../config/config";

const Tab = createMaterialTopTabNavigator();
const ViewChannel = (props) => {

    const [location, setLocation] = useState("");
    const [channelName, setChannelName] = useState("");
    const [handleName, setHandleName] = useState("");
    const [handleURL, setHandleURL] = useState("");

    useEffect(() => {
        axios.post(apiURL + "/api/Upsocial/get/channel", { userEmail: props.auth.user.curUser }, {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            setLocation(res.data.channelData[0].location);
            setChannelName(res.data.channelData[0].channelName);
            setHandleName(res.data.channelData[0].handleUrl);
            setHandleURL(res.data.channelData[0].url);
        }).catch((err) => {
            console.warn(err);
        });
    })

    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1, zIndex: 1 }}>
                <Image source={require("../../../assets/background.png")} style={styles.background} />
                <View style={styles.section}>
                    <View style={styles.statusbar}>
                        <Text style={styles.statusLabel}>Web3 in 5 minutes</Text>
                        <View style={styles.logo}>
                            <Image style={styles.logoImage} source={require("../../../assets/logos/web3icon.png")} />
                        </View>
                    </View>
                    <View style={styles.userinfo}>
                        <View style={styles.sectionLeft}>
                            <Image style={styles.avatar} source={require("../../../assets/girl.png")} />
                            <View style={styles.nameGroup}>
                                <Text>{channelName}</Text>
                                <View style={styles.badgeGroup}>
                                    <Text style={styles.proBadge}>Pro</Text>
                                    <Text>Creator</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.sectionRight}>
                            <MaterialCommunityIcons name="bookmark" size={30} color="#7579ff" />
                            <MaterialCommunityIcons name="bell" size={30} color="#7579ff" />
                        </View>
                    </View>
                    <View style={styles.socialGroup}>
                        <View style={styles.location}>
                            <Ionicons name="location-outline" size={20} color="#000" />
                            <Text>{location}</Text>
                        </View>
                        <View style={styles.socialItems}>
                            <TouchableOpacity>
                                <MaterialCommunityIcons name="instagram" size={30} color="#7579ff" />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <MaterialCommunityIcons name="facebook" size={30} color="#7579ff" />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Zocial name="youtube" size={30} color="#7579ff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.moreData}>
                        <Text style={styles.handleId}>{handleName}</Text>
                        <Text style={styles.handleUrl}>{handleURL}</Text>
                    </View>
                    {/* <View style={styles.exploreSection}>
                        <View style={styles.exploreTab}>
                            <Tab.Navigator
                                screenOptions={({ route }) => ({
                                    tabBarLabelStyle: { fontSize: 15, color: "#fff", paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, backgroundColor: '#7579FF' },
                                    tabBarStyle: { backgroundColor: "#fff", width: Dimensions.get("window").width },
                                    tabBarScrollEnabled: true
                                })}
                            >
                                <Tab.Screen name="Home" options={{ tabBarItemStyle: { width: 100 } }} children={() => <Videos />} />
                                <Tab.Screen name="Videos" options={{ tabBarItemStyle: { width: 100 } }} children={() => <Videos />} />
                                <Tab.Screen name="Playlists" options={{ tabBarItemStyle: { width: 100 } }} children={() => <Videos />} />
                                <Tab.Screen name="About" options={{ tabBarItemStyle: { width: 100 } }} children={() => <Videos />} />
                            </Tab.Navigator>
                        </View>
                    </View> */}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        width: "100%",
        height: Dimensions.get("window").height * 0.5,
    },
    section: {
        backgroundColor: "#fff",
        width: "90%",
        height: "80%",
        marginHorizontal: "5%",
        position: "absolute",
        top: Dimensions.get("window").height * 0.2,
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        gap: 15
    },
    statusbar: {
        flexDirection: "row"
    },
    statusLabel: {
        fontSize: 18
    },
    logo: {
        position: "absolute",
        backgroundColor: "blue",
        borderRadius: 150,
        width: 60,
        height: 60,
        padding: 10,
        right: 25,
        top: -25
    },
    logoImage: {
        width: "100%",
        height: "100%"
    },
    userinfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    sectionLeft: {
        flexDirection: "row",
        gap: 10
    },
    avatar: {
        width: 40,
        height: 40,
    },
    nameGroup: {
        flexDirection: "column"
    },
    badgeGroup: {
        flexDirection: "row",
        gap: 10
    },
    proBadge: {
        color: "#fff",
        backgroundColor: "#fe2472",
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 12,
    },
    sectionRight: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    socialGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    location: {
        flexDirection: "row",
        gap: 15
    },
    socialItems: {
        flexDirection: "row",
        justifyContent: "center",
        // alignItems: "center ",
        gap: 5
    },
    moreData: {
        flexDirection: "row",
        justifyContent: "space-between",
        // alignItems: "center"
    },
    handleId: {
        fontSize: 15,
        color: "#000",
        fontWeight: "bold"
    },
    handleUrl: {
        fontSize: 15,
        color: "#000"
    },
    exploreSection: {
        flexDirection: "column",
    },
    exploreTab: {
        flexDirection: "row",
        justifyContent: "center",
        // alignItems: "center"
    },
    explore: {
        position: "relative",
        flexDirection: "column",
        height: Dimensions.get('window').height * 0.8 * 0.75
    }
});

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(ViewChannel);