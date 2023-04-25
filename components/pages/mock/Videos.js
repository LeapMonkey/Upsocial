import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, SectionList, SafeAreaView } from "react-native";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import Modal from "react-native-modal";

const Videos = () => {
    const video = useRef(null);
    const [status, setStatus] = useState({});
    const [opened, setOpened] = useState(false);
    let A = [
        {
            id: '1', value: 'Play next in queue', name: "featured-play-list"
        },
        { id: '2', value: 'Save to Watch later', name: 'access-time' },
        { id: '3', value: 'Save to Playlist', name: "add-to-photos" },
        { id: '4', value: 'Download Video', name: "file-download" },
        { id: '5', value: 'Share', name: "share" },
    ];

    return (

        <View style={styles.container}>
            <Modal
                isVisible={opened}
                style={{
                    margin: 0, padding: 0, justifyContent: 'flex-end'
                }}
            >
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={() => setOpened(false)}>
                        <View style={styles.ListContainer}>
                            <SectionList
                                sections={[{ data: A }]}
                                renderItem={({ item }) => (
                                    // Single Comes here which will be repeatative for the FlatListItems
                                    <TouchableOpacity style={styles.sectionListItemStyle}>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                            <MaterialIcons name={item.name} size={30} color="#fff" />
                                            <Text style={{ color: "#fff", fontSize: 20 }}>{item.value}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item, index) => index}
                            />
                        </View>
                        <View style={styles.button}>
                            <Text>Close</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </Modal>
            <ScrollView style={{ flex: 1 }}>
                <Text style={styles.title}>Videos</Text>
                <View style={styles.Sections}>
                    <View style={styles.VideoSections}>
                        <Video
                            ref={video}
                            videoStyle={{ position: 'relative', aspectRatio: 1 / 1 }}
                            style={{ width: Dimensions.get("window").width * 0.35 }}
                            source={{ uri: "https://g.upsocial.com/ipfs/QmXF1SaqxcFCTDrBrygXqdrHFT9nUhroHZDQ6p672xCRns" }}
                            rate={1.0}
                            isLooping
                            volume={1.0}
                            shouldPlay
                            useNativeControls
                            resizeMode={ResizeMode.STRETCH}
                            onPlaybackStatusUpdate={status => setStatus(() => status)}
                            onLoad={() => { video.current.playAsync() }}
                        />
                        <View style={styles.videoDetails}>
                            <Text style={styles.videoTitle}>Professional analysis on FBI's Most Wanted...</Text>
                            <Text style={styles.review}>1.2K Views</Text>
                            <Text style={styles.date}>15 hours ago</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.MenuSections} onPress={() => setOpened(true)}>
                        <Entypo name="dots-three-vertical" size={30} color="#000" />
                    </TouchableOpacity>
                </View>

                <View style={styles.Sections}>
                    <View style={styles.VideoSections}>
                        <Video
                            ref={video}
                            videoStyle={{ position: 'relative', aspectRatio: 1 / 1 }}
                            style={{ width: Dimensions.get("window").width * 0.35 }}
                            source={{ uri: "https://g.upsocial.com/ipfs/QmXF1SaqxcFCTDrBrygXqdrHFT9nUhroHZDQ6p672xCRns" }}
                            rate={1.0}
                            isLooping
                            volume={1.0}
                            shouldPlay
                            useNativeControls
                            resizeMode={ResizeMode.STRETCH}
                            onPlaybackStatusUpdate={status => setStatus(() => status)}
                            onLoad={() => { video.current.playAsync() }}
                        />
                        <View style={styles.videoDetails}>
                            <Text style={styles.videoTitle}>Professional analysis on FBI's Most Wanted...</Text>
                            <Text style={styles.review}>1.2K Views</Text>
                            <Text style={styles.date}>15 hours ago</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.MenuSections} onPress={() => setOpened(true)}>
                        <Entypo name="dots-three-vertical" size={30} color="#000" />
                    </TouchableOpacity>
                </View>

                <View style={styles.Sections}>
                    <View style={styles.VideoSections}>
                        <Video
                            ref={video}
                            videoStyle={{ position: 'relative', aspectRatio: 1 / 1 }}
                            style={{ width: Dimensions.get("window").width * 0.35 }}
                            source={{ uri: "https://g.upsocial.com/ipfs/QmXF1SaqxcFCTDrBrygXqdrHFT9nUhroHZDQ6p672xCRns" }}
                            rate={1.0}
                            isLooping
                            volume={1.0}
                            shouldPlay
                            useNativeControls
                            resizeMode={ResizeMode.STRETCH}
                            onPlaybackStatusUpdate={status => setStatus(() => status)}
                            onLoad={() => { video.current.playAsync() }}
                        />
                        <View style={styles.videoDetails}>
                            <Text style={styles.videoTitle}>Professional analysis on FBI's Most Wanted...</Text>
                            <Text style={styles.review}>1.2K Views</Text>
                            <Text style={styles.date}>15 hours ago</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.MenuSections} onPress={() => setOpened(true)}>
                        <Entypo name="dots-three-vertical" size={30} color="#000" />
                    </TouchableOpacity>
                </View>

                <View style={styles.Sections}>
                    <View style={styles.VideoSections}>
                        <Video
                            ref={video}
                            videoStyle={{ position: 'relative', aspectRatio: 1 / 1 }}
                            style={{ width: Dimensions.get("window").width * 0.35 }}
                            source={{ uri: "https://g.upsocial.com/ipfs/QmXF1SaqxcFCTDrBrygXqdrHFT9nUhroHZDQ6p672xCRns" }}
                            rate={1.0}
                            isLooping
                            volume={1.0}
                            shouldPlay
                            useNativeControls
                            resizeMode={ResizeMode.STRETCH}
                            onPlaybackStatusUpdate={status => setStatus(() => status)}
                            onLoad={() => { video.current.playAsync() }}
                        />
                        <View style={styles.videoDetails}>
                            <Text style={styles.videoTitle}>Professional analysis on FBI's Most Wanted...</Text>
                            <Text style={styles.review}>1.2K Views</Text>
                            <Text style={styles.date}>15 hours ago</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.MenuSections} onPress={() => setOpened(true)}>
                        <Entypo name="dots-three-vertical" size={30} color="#000" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.moreBtn}>
                    <FontAwesome name="caret-down" color="#000" size={30} />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    ListContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    sectionListItemStyle: {
        fontSize: 15,
        padding: 15,
        color: '#fff',
        backgroundColor: "#000",
        width: Dimensions.get("window").width,
    },
    container: {
        flex: 1,
        position: "relative",
        flexDirection: "column",
        maxHeight: Dimensions.get('window').height * 0.8 * 0.65
    },

    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
        margin: 20,
    },

    Sections: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 5,
        padding: 10
    },

    VideoSections: {
        flexDirection: "row",
        gap: 5
    },

    MenuSections: {
    },

    videoDetails: {
        flexDirection: "column",
        gap: 10,
        justifyContent: "center",
        width: Dimensions.get("window").width * 0.2
    },

    videoTitle: {
        fontSize: 12,
        color: "#000",
        fontWeight: "bold"
    },

    review: {
        fontSize: 12,
        color: "#000",
    },

    date: {
        fontSize: 12,
        color: "#000",
    },

    moreBtn: {
        justifyContent: "center",
        alignItems: "center"
    },
    modalContent: {
        backgroundColor: '#000',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    button: {
        backgroundColor: 'lightblue',
        padding: 12,
        margin: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    }
});

export default Videos;