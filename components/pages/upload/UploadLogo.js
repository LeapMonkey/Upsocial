import React, { useState, useEffect } from "react";
import {
    Image,
    View,
    Platform,
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function UploadLogo(props) {
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
                <View style={imageUploaderStyles.container} >
                    {
                        image ? (
                            <Image source={{ uri: image }} style={{ width: 150, height: 150, borderRadius: 100 }
                            } />
                        ) : (
                            <Image source={require("../../../assets/logos/preview.png")} style={{ width: 150, height: 150, borderRadius: 100 }} />
                        )
                    }
                    <View style={imageUploaderStyles.uploadBtnContainer}>
                        <TouchableOpacity
                            onPress={addImage}
                            style={imageUploaderStyles.uploadBtn}
                        >
                            <AntDesign name="camera" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View >
                </View>
            ) : (
                <View style={imageUploaderStyles.container} >
                    {
                        webimage !== "" ? (
                            <Image source={{ uri: webimage }} style={{ width: 150, height: 150, borderRadius: 100 }
                            } />
                        ) : (
                            <Image source={require("../../../assets/logos/preview.png")} style={{ width: 150, height: 150, borderRadius: 100 }} />
                        )
                    }
                    <View style={imageUploaderStyles.uploadBtnContainer}>
                        <label htmlFor="fileuploadinput">
                            <AntDesign name="camera" size={24} color="#fff" />
                        </label>
                        <input onChange={propicURL} type="file" style={{ display: "none" }} id="fileuploadinput" />
                    </View >
                </View>
            )}
        </>
    );
}


const imageUploaderStyles = StyleSheet.create({
    container: {
        elevation: 2,
        height: 150,
        width: 150,
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
