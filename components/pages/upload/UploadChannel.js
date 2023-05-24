import React, { useState, useEffect } from "react";
import {
    Image,
    View,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function UploadChannel(props) {
    const [image, setImage] = useState(null);
    const [platformstate, setPlatformstate] = useState("web");
    const [webimage, setWebImage] = useState("");

    const addImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 4],
        });

        if (result.cancelled) {
            return;
        }

        // ImagePicker saves the taken photo to disk and returns a local URI to it
        let localUri = result.uri;
        let filename = localUri.split("/").pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        let pdata = { uri: localUri, name: filename, type };

        setImage(localUri);
    };

    const propicURL = async (input) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            setWebImage(e.target.result);
        }

        reader.readAsDataURL(input.target.files[0]);

        props.setimagefunc(input.target.files[0]);
    }

    return (
        <>
            {platformstate === "android" ? (
                <TouchableOpacity style={imageUploaderStyles.container} onPress={addImage}>
                    {image ? (
                        <Image source={{ uri: image }} style={{ width: 300, height: 150 }} />
                    ) : (
                        <Image source={require("../../../assets/logos/previewImage.png")} style={{ width: 300, height: 150 }} />
                    )}
                    <View style={imageUploaderStyles.uploadBtnContainer}>
                        <TouchableOpacity
                            onPress={addImage}
                            style={imageUploaderStyles.uploadBtn}
                        >
                            <MaterialCommunityIcons name="pencil-plus-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            ) : (
                <>
                    <label style={imageUploaderStyles.container} htmlFor="fileuploadinput">
                        {
                            webimage !== "" ? (
                                <Image source={{ uri: webimage }} style={{ width: 300, height: 150 }
                                } />
                            ) : (
                                <Image source={require("../../../assets/logos/previewImage.png")} style={{ width: 300, height: 150 }} />
                            )
                        }
                        <View style={imageUploaderStyles.uploadBtnContainer}>
                            <label htmlFor="fileuploadinput">
                                <AntDesign name="camera" size={24} color="#fff" />
                            </label>
                            <input onChange={propicURL} type="file" style={{ display: "none" }} id="fileuploadinput" />
                        </View >
                    </label>
                    <input onChange={propicURL} type="file" style={{ display: "none" }} id="fileuploadinput" />
                </>
            )}
        </>
    );
}
const imageUploaderStyles = StyleSheet.create({
    container: {
        elevation: 2,
        height: 150,
        width: 300,
        position: "relative",
        borderRadius: 10,
        overflow: "hidden",
    },
    uploadBtnContainer: {
        opacity: 0.7,
        position: "absolute",
        right: 0,
        bottom: 0,
        backgroundColor: "transparent",
        width: "100%",
        height: "25%",
        justifyContent: "flex-end",
        alignItems: "flex-end"
    },
    uploadBtn: {
        marginTop: 5,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
    },
});
