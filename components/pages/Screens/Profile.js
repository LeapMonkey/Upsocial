import React, { useState, useRef } from "react";
import {
    View,
    Text,
    ScrollView,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    Dimensions
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Video, ResizeMode } from "expo-av";

const Profile = (props) => {
    const video = useRef(null);
    const [status, setStatus] = useState({});

    const dataSource = [
        require('../../../assets/video/onboardingVideo.mp4'),
        require('../../../assets/video/onboardingVideo.mp4'),
        require('../../../assets/video/onboardingVideo.mp4'),
    ];

    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1, zIndex: 1 }}>
                <View>
                    <ImageBackground
                        source={require("../../../assets/profile.png")}
                        style={styles.profileImage}
                    >
                        <View style={styles.subContainer}>
                            <View style={styles.backArrow}>
                                <TouchableOpacity onPress={() => props.setName("explore")}>
                                    <Ionicons name="arrow-back-sharp" color="#fff" size={30} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.SubTitleView}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.Username}>Baby Yoda</Text>
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
                                        <Text style={styles.location}>Los Angeles, CA</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.contentsBox}>
                    <View style={styles.statusSection}>
                        <View style={styles.likeStatus}>
                            <Text style={styles.statusValue}>3436</Text>
                            <Text style={styles.statusLabel}>Ups</Text>
                        </View>
                        <View style={styles.likeStatus}>
                            <Text style={styles.statusValue}>522</Text>
                            <Text style={styles.statusLabel}>Pins</Text>
                        </View>
                        <View style={styles.likeStatus}>
                            <Text style={styles.statusValue}>324,093</Text>
                            <Text style={styles.statusLabel}>Followers</Text>
                        </View>
                    </View>
                    <View style={styles.RecentContents}>
                        <View style={styles.ViewHeader}>
                            <Text style={styles.HeaderTitle}>Recent Uploads</Text>
                            <TouchableOpacity>
                                <Text style={styles.BtnView}>View all</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.VideoContainer}>
                            {dataSource.map((item, key) => {
                                return (
                                    <Video
                                        key={key}
                                        ref={video}
                                        videoStyle={{ position: 'relative' }}
                                        style={styles.VideoItem}
                                        source={item}
                                        isLooping
                                        useNativeControls
                                        resizeMode={ResizeMode.STRETCH}
                                        onPlaybackStatusUpdate={status => setStatus(() => status)}
                                    />
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
    },
    VideoItem: {
        width: Dimensions.get("window").width * 0.25,
        height: Dimensions.get("window").width * 0.25,
        marginBottom: 10,
        borderRadius: 10,
        marginHorizontal: 2,
    },
});

export default Profile;