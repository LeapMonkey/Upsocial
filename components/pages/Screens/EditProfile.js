import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    TextInput,
    ToastAndroid,
    Platform,
    AlertIOS,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import UploadLogo from "../upload/UploadLogo";

const EditProfile = (props) => {
    const [result, setResult] = useState([]);
    const [isEnabled, setIsEnabled] = useState(false);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [uploadimagedata, setUploadimagedata] = useState(null);

    const toggleSwitch = () => {
        setIsEnabled((previousState) => !previousState);
    };

    const setimagefunc = (imagedata) => {
        setUploadimagedata(imagedata);
    };

    const uploadData = () => {
        if (uploadimagedata === null) {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please select Image!", ToastAndroid.SHORT);
            } else {
                AlertIOS.alert("Please select image!");
            }
        } else if (title.trim() === "") {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input title!", ToastAndroid.SHORT);
            } else {
                AlertIOS.alert("Please input title!");
            }
        } else if (date.trim() === "") {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input date!", ToastAndroid.SHORT);
            } else {
                AlertIOS.alert("Please input date!");
            }
        } else if (description.trim() === "") {
            if (Platform.OS === "android") {
                ToastAndroid.show("Please input description!", ToastAndroid.SHORT);
            } else {
                AlertIOS.alert("Please input description!");
            }
        } else {
            let formdata = new FormData();
            formdata.append("photo", uploadimagedata);
            formdata.append("title", title);
            formdata.append("date", date);
            formdata.append("user_id", props.auth.user.id);
            formdata.append("description", description);
            formdata.append("flag", isEnabled);
        }
    };

    return (
        <LinearGradient
            colors={['#2ab4fad9', '#1D2145']}
            style={styles.container}
        >
            <View>
                <Image source={require("../../../assets/logos/logo_wh.png")} style={{ height: 40, width: 230, marginTop: 10 }} />
            </View>
            <ScrollView
                style={styles.mainsection}
                contentContainerStyle={{
                    alignItems: "center",
                }}
            >
                <View style={styles.uploadsection}>
                    <View style={styles.imagesection}>
                        <UploadLogo setimagefunc={setimagefunc} />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Name"
                            placeholderTextColor="#fff"
                            onChangeText={(e) => setTitle(e)}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Handle"
                            placeholderTextColor="#fff"
                            onChangeText={(e) => setDate(e)}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="About me"
                            placeholderTextColor="#fff"
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={(e) => setDescription(e)}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Location (City, State)"
                            placeholderTextColor="#fff"
                            onChangeText={(e) => setDate(e)}
                        />
                    </View>
                    <View style={styles.TextInput}>
                        <TouchableOpacity
                            style={styles.uploadbtn}
                            onPress={() => uploadData()}
                        >
                            <Text style={styles.uploadbtntext}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignItems: "center",
    },
    headersection: {
        backgroundColor: "#1f1f1f",
        width: "100%",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: "center",
    },
    headersubsection: {
        width: "85%",
    },
    headertitlesection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    headertitle: {
        color: "#f9f9f9",
        fontSize: 24,
        fontWeight: "bold",
    },
    headershopsection: {
        borderRadius: 6,
        backgroundColor: "#ccff00",
        paddingBottom: 3,
        paddingTop: 3,
        paddingRight: 8,
        paddingLeft: 8,
    },
    mainsection: {
        width: "100%",
        flex: 1,
    },
    uploadsection: {
        width: "85%",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingBottom: 30,
        paddingTop: 15,
    },
    imagesection: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
    },
    inputView: {
        borderRadius: 5,
        backgroundColor: "transparent",
        marginVertical: 10,
        borderWidth: 2,
        borderStyle: "solid",
        borderRightColor: "transparent",
        borderLeftColor: "transparent",
        borderTopColor: "transparent",
        borderBottomColor: "#fff",
        width: "100%",
    },
    errinputView: {
        borderRadius: 5,
        backgroundColor: "rgb(239, 239, 239)",
        marginVertical: 10,
        borderColor: "#30b98f",
        borderWidth: 3,
        borderStyle: "solid",
        width: "100%",
    },
    TextInput: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        color: "#fff",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    subinputtext: {
        marginHorizontal: 10,
        color: "#000",
        fontSize: 16,
    },
    uploadbtn: {
        width: "100%",
        backgroundColor: "rgb(156, 38, 176)",
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 30,
    },
    uploadbtntext: {
        color: "#fff",
        letterSpacing: 1,
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center",
    },
});


export default EditProfile
