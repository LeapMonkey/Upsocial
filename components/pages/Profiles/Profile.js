import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    ScrollView,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { connect } from "react-redux";
import { apiURL } from "../../config/config";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Video, ResizeMode } from "expo-av";
import { useMediaQuery } from "react-responsive";

const Profile = (props) => {
    const video = useRef(null);
    const [status, setStatus] = useState({});

    const [avatar, setAvatar] = useState(null);
    const [username, setUsername] = useState(null);
    const [location, setLocation] = useState(null);

    const [limit, setLimit] = useState(5);
    const [result, setResult] = useState([]);

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

    useEffect(() => {
        axios.post(apiURL + "/api/Upsocial/users/get/UploadedContent", { userEmail: props.auth.user.curUser }, {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            setResult(res.data.data);
        }).catch((err) => {
            console.warn(err);
        });
    });


    useEffect(() => {

        axios.post(apiURL + "/api/Upsocial/admin/getUsers",
            { userEmail: props.auth.user.curUser },
            {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }).then((res) => {
                console.log(res.data.data);
                if (res.data.data.photo) {
                    setAvatar({ uri: res.data.data.photo })
                }
                if (res.data.data.username) {
                    setUsername(res.data.data.username);
                }
                if (res.data.data.location) {
                    setLocation(res.data.data.location);
                }

            }).catch((err) => console.log(err));
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1, zIndex: 1 }}>
                <View>
                    <ImageBackground
                        source={avatar == null ? require("../../../assets/profile.png") : avatar}
                        style={styles.profileImage}
                    >
                        <View style={styles.subContainer}>
                            <View style={styles.backArrow}>
                                <TouchableOpacity onPress={() => props.setflag("EditProfile")} style={{ flexDirection: "row", gap: 5, alignItems: "center", justifyContent: "center" }}>
                                    <Ionicons name="arrow-back-sharp" color="#fff" size={15} />
                                    <Text style={{ fontSize: 15, color: "#fff" }} >Edit</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.SubTitleView}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.Username}>{username}</Text>
                                    <View>
                                        <TouchableOpacity>
                                            <Ionicons name="add-circle" color="#fff" size={24} />
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <TouchableOpacity>
                                            <MaterialCommunityIcons name="pin" color="#fff" size={24} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.description}>
                                    <View style={styles.userReview}>
                                        <Text style={styles.proBadge}>Pro</Text>
                                        <Text style={styles.userRole}>Creator</Text>
                                        <View style={styles.review}>
                                            <Text style={styles.reviewMark}>4.8</Text>
                                            <Ionicons name="add-circle-outline" color="#F58422" size={24} />
                                        </View>
                                    </View>
                                    <View style={styles.userLocation}>
                                        <Ionicons name="location-sharp" color="#fff" size={24} />
                                        <Text style={styles.location}>{location == null ? "Los Angeles, CA" : location}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.contentsBox}>
                    <View style={styles.statusSection}>
                        <View style={styles.likeStatus}>
                            <Text style={styles.statusValue}>0</Text>
                            <Text style={styles.statusLabel}>Ups</Text>
                        </View>
                        <View style={styles.likeStatus}>
                            <Text style={styles.statusValue}>0</Text>
                            <Text style={styles.statusLabel}>Pins</Text>
                        </View>
                        <View style={styles.likeStatus}>
                            <Text style={styles.statusValue}>0</Text>
                            <Text style={styles.statusLabel}>Followers</Text>
                        </View>
                    </View>
                    <View style={styles.RecentContents}>
                        <View style={styles.ViewHeader}>
                            <Text style={styles.HeaderTitle}>Recent Uploads</Text>
                            <TouchableOpacity onPress={() => props.viewall()}>
                                <Text style={styles.BtnView}>View all</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.board}>
                            {result && result.map((index, key) => {
                                return (
                                    <TouchableOpacity style={isWide ? styles.wideitemview : isDesktop ? styles.desktopitemview : isTablet ? styles.tabletitemview : isTabletOrMobile ? styles.tabletormobileitemview : styles.mobileitemview} key={key} onPress={() => watchVideo(index)}>
                                        <View style={{ alignItems: 'center', width: "100%" }}>
                                            <Image source={{ uri: index.thumbnail }} style={{ width: "100%", height: Dimensions.get("window").height * 0.3, borderRadius: 12 }} />
                                            <Image source={require("../../../assets/logos/playvideo.png")} style={{ width: 50, height: 50, position: "absolute", top: "40%" }} />
                                        </View>
                                        <Text>{index.title}</Text>
                                        <Text>{index.description}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profileImage: {
        height: 600,
        width: "100%",
    },
    subContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginTop: 30,
        marginBottom: 40,
    },
    backArrow: {
        height: 30,
        width: 30
    },
    SubTitleView: {
        gap: 10
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 5,
    },
    Username: {
        fontSize: 24,
        color: "#fff"
    },
    description: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    userReview: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    proBadge: {
        color: "#fff",
        backgroundColor: "#fe2472",
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 20,
    },
    userRole: {
        fontSize: 18,
        color: "#fff"
    },
    review: {
        flexDirection: "row",
        gap: 5
    },
    reviewMark: {
        fontSize: 18,
        color: "#F58422"
    },
    userLocation: {
        flexDirection: "row",
        alignItems: "center"
    },
    location: {
        fontSize: 18,
        color: "#fff"
    },
    contentsBox: {
        marginHorizontal: 20,
        marginTop: -20,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderColor: "#DCDCDC",
        borderWidth: 1,
        shadowOffset: { width: 10, height: 10 },
        shadowColor: "#000",
        shadowOpacity: 0.8
    },
    statusSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginTop: 20,
    },
    likeStatus: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    statusValue: {
        fontSize: 18,
        color: "#000"
    },
    statusLabel: {
        color: "#b3b3b3"
    },
    RecentContents: {
        flexDirection: "column",
        marginHorizontal: 10,
        marginTop: 30
    },
    ViewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30
    },
    HeaderTitle: {
        fontSize: 20,
        color: "#000"
    },
    BtnView: {
        fontSize: 12,
        color: "#9c26b0"
    },
    VideoContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        position: 'relative'
    },
    VideoItem: {
        width: Dimensions.get("window").width * 0.25,
        height: Dimensions.get("window").width * 0.25,
        marginBottom: 10,
        borderRadius: 10,
        marginHorizontal: 2,
        position: 'relative'
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

export default connect(mapStateToProps, {})(Profile);