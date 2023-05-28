import React, { useEffect, useState, useRef } from 'react';
import { connect } from "react-redux";
import { Text, StyleSheet, Image, View, ScrollView, TouchableOpacity, Dimensions, Platform, TextInput } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Feather, Ionicons, FontAwesome, AntDesign, Entypo } from 'react-native-vector-icons';
import isEmpty from '../../config/is-empty';
import SelectDropdown from "react-native-select-dropdown";
import * as ImagePicker from "expo-image-picker";
import { MultiSelect } from 'react-native-element-dropdown';
import { Video, ResizeMode } from "expo-av";
import { generateVideoThumbnails } from "@rajesh896/video-thumbnails-generator";
import Modal from "react-native-modal";
import { useMediaQuery } from "react-responsive";
import axios from 'axios';
import { apiURL } from '../../config/config';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const PlaylistView = (props) => {

    // mobile and desktop variable for responsive
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

    // Video Picker
    const video = useRef(null);
    const [status, setStatus] = useState({});

    const [playlist_title, setPlaylist_title] = useState("");
    const [playlist_description, setPlaylist_description] = useState("");
    const [playlist_image, setPlaylist_image] = useState("");
    const [playlist_feeds, setFeeds] = useState([]);
    const [playlist_all_feeds, setAllFeeds] = useState([]);

    const [loading, setLoading] = useState(false);

    const [isOpen, setIsOpen] = useState(-1);
    const [dumpVar, setDumpVar] = useState(-1);

    useEffect(() => {
        setPlaylist_title(props.playlistData.title);
        setPlaylist_description(props.playlistData.description);
        setPlaylist_image(props.playlistData.image);
        setFeeds(props.playlistData.feeds)
        setAllFeeds(props.playlistData.feeds)
    }, [props.playlistData]);

    const DeletePlaylist = () => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deletePlaylist()
                },
                {
                    label: 'No',
                    onClick: () => alert('Try Later !')
                }
            ]
        });
    }

    const deletePlaylist = () => {
        const data = {
            userEmail: props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser,
            playlistTitle: playlist_title,
        };

        axios.post(apiURL + "/api/Upsocial/remove/playlist", data, {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            if (res.data.status) {
                alert(res.data.msg);
                setLoading(false);
                window.location.reload();
            } else {
                alert(res.data.msg);
                setLoading(false);
            }
        }).catch((err) => {
            console.warn(err);
            setLoading(false);
        });
    }

    const toggleModal = (keys) => {
        if (dumpVar === keys) {
            setDumpVar(-1);
            setIsOpen(-1);
        } else {
            setDumpVar(keys);
            setIsOpen(keys);
        }
    }

    const RemoveVideoToPlaylist = (videoData) => {
        const data = {
            userEmail: props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser,
            playlistTitle: playlist_title,
            ID: videoData.ID,
        };

        axios.post(apiURL + "/api/Upsocial/playlist/removeVideo", data, {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            if (res.data.status) {
                alert(res.data.msg);
                setLoading(false);
            } else {
                alert(res.data.msg);
                setLoading(false);
            }
        }).catch((err) => {
            console.warn(err);
            setLoading(false);
        });
    };

    return (
        <View style={styles.container}>
            {loading && <View style={styles.loadingView}>
                <Image
                    source={require("../../../assets/loading.gif")}
                    style={{ width: 140, height: 140 }}
                />
            </View>}
            {/* <Modal
                isVisible={deleteModal}
            >

            </Modal> */}
            <View style={styles.headersection}>
                <View style={styles.subheadersection}>
                    <View style={styles.headerimage}>
                        <Image
                            source={require("../../../assets/logos/logo_wh.png")}
                            style={{ height: 30, width: 158 }}
                        />
                    </View>
                    <View style={styles.iconsection}>
                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => props.setflag("main")}>
                            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>BACK</Text>
                            <AntDesign name="right" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.playlistDataView}>
                    <Image source={{ uri: playlist_image }} style={{ width: "100%", height: Dimensions.get("window").height * 0.3, borderRadius: 12 }} />
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20 }}>
                        <View style={{ flexDirection: "column" }}>
                            <Text style={{ fontSize: 24, color: "#000", fontWeight: "bold" }}>{playlist_title}</Text>
                            <Text style={{ fontSize: 20, color: "#000", fontWeight: "bold" }}>{playlist_description}</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <TouchableOpacity onPress={() => DeletePlaylist()}><AntDesign name="delete" size={20} color="#000" /></TouchableOpacity>
                            <TouchableOpacity><AntDesign name="edit" size={20} color="#000" /></TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.contentview}>
                    {playlist_feeds && playlist_feeds.map((index, key) => {
                        return (
                            <View style={isWide ? styles.wideitemview : isDesktop ? styles.desktopitemview : isTablet ? styles.tabletitemview : isTabletOrMobile ? styles.tabletormobileitemview : styles.mobileView} key={key}>
                                <TouchableOpacity style={{ alignItems: 'center', width: "100%", borderRadius: 10 }}>
                                    <View style={{ alignItems: 'center', width: "100%" }}>
                                        <Image source={{ uri: index.thumbnail }} style={{ width: "100%", height: Dimensions.get("window").height * 0.3, borderRadius: 12 }} />
                                        <Image source={require("../../../assets/logos/playvideo.png")} style={{ width: 50, height: 50, position: "absolute", top: "40%" }} />
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.maincontentview}>
                                    <View>
                                        <Text style={styles.metadata_title}>{index.title}</Text>
                                        <Text style={styles.metadata_description}>{index.description}</Text>
                                    </View>
                                    {isOpen == key && (
                                        <TouchableOpacity style={styles.videoplayitem}>
                                            <TouchableOpacity onPress={() => RemoveVideoToPlaylist(index)}>
                                                <Text>Remove from Playlist</Text>
                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity onPress={(e) => toggleModal(key)}>
                                        <Entypo name="dots-three-vertical" color="#000" size={20} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })}
                    {isEmpty(playlist_feeds) && (
                        <View style={styles.nodataContainer}>
                            <Text style={styles.nodata_title}>No Videos yet!</Text>
                            <Text style={styles.nodata_content}>Upload your first video!</Text>
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
        width: "100%",
        position: "relative"
    },
    loadingView: {
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
    },
    headersection: {
        height: Dimensions.get("window").height * 0.08,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2AB4FA"
    },
    subheadersection: {
        width: "calc(100% - 30px)",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    headerimage: {
        flex: 1
    },
    iconsection: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    iconbtn: {
        marginLeft: 10
    },
    playlistDataView: {
        flexDirection: "column",
        marginVertical: 20,
        marginHorizontal: 10,
    },
    contentview: {
        marginHorizontal: 40,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    wideitemview: {
        alignItems: "center",
        width: "20%",
        padding: 10
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
    mobileView: {
        alignItems: "center",
        width: "90%",
        padding: 10,
    },
    mobileitemview: {
        alignItems: "center",
        width: "100%",
        padding: 10,
        position: "relative",
    },
    metadata_title: {
        color: "#000",
        fontSize: 14,
        fontWeight: "bold"
    },
    metadata_description: {
        color: "#000",
        fontSize: 14,
        fontWeight: "bold"
    },
    nodataContainer: {
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    nodata_title: {
        color: "#000",
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 2
    },
    metadata_description: {
        color: "#000",
        fontSize: 14,
        fontWeight: "bold"
    },
    contentsection: {
        marginTop: 60,
        flex: 1,
        width: "100%",
    },
    dropdown: {
        width: "100%",
        backgroundColor: 'transparent',
        paddingBottom: 10,
        paddingHorizontal: 10,
        borderBottomColor: "#000",
        borderBottomWidth: 1
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    maincontentview: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        position: "relative"
    },
    videoplaylistview: {
        position: "absolute",
        bottom: 30,
        right: 40,
        flexDirection: "column",
        backgroundColor: "#fff",
        borderRadius: 5
    },
    videoplayitem: {
        paddingVertical: 8,
        paddingHorizontal: 15
    }
});

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(PlaylistView);