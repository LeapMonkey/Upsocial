import React, { useState, useEffect } from "react";
import {
    Image,
    View,
    Platform,
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function UploadChannel(props) {
    const [image, setImage] = useState(null);

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
        props.setimagefunc(pdata);
    };

    return (
        <View style={imageUploaderStyles.container}>
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
        </View>
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