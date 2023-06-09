import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TextInput, StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { connect } from "react-redux";
import { loginUser } from "../Actions/authAction";
import axios from "axios";
import { apiURL } from "../config/config";
import { useMediaQuery } from "react-responsive";
import isEmpty from "../config/is-empty";
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Anonymous = (props) => {
    const isDesktopOrLaptop = useMediaQuery({
        query: "(min-device-width: 500px)"
    });

    const [loading, setLoading] = useState(false);

    const [nick_name, setNick_name] = useState("");
    const [nick_hashCode, setNick_hashCode] = useState("");

    const [hashCodeFromAPI, setHashCodeFromAPI] = useState("");

    const gethashCode = () => {
        if (nick_name == "") {
            alert("Please Enter your Nick Name!")
        } else {
            setLoading(true);
            axios.post(apiURL + "/api/Upsocial/anonymouse/get-hash-code", { nick_name: nick_name }, {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
            }).then((res) => {
                if (res.data.code) {
                    setHashCodeFromAPI(res.data.code);
                    alert(res.data.code);
                    setLoading(false);
                }
            }).catch((err) => {
                console.warn(err);
                setLoading(false);
            });
        }
    };

    const verify20HashCode = () => {
        if (nick_name == "" || nick_hashCode == "") {
            alert("Please Enter your Nick Name and Hash Code!")
        } else {
            setLoading(true);
            axios.post(apiURL + "/api/Upsocial/anonymouse/verify-hash-code", { nick_name: nick_name, code: nick_hashCode }, {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
            }).then((res) => {
                if (res.data.status) {
                    setLoading(false);
                    alert(res.data.msg);
                    window.open(`https://shiny-lab-8288.on.fleek.co/uploading/${nick_hashCode}`, "_blank");
                } else {
                    setLoading(false);
                    alert(res.data.msg);
                }
            }).catch((err) => {
                console.warn(err);
                setLoading(false);
            });
        }
    };

    return (
        <LinearGradient
            colors={['#2ab4fad9', '#1D2145']}
            style={styles.container}
        >
            {loading && <View style={styles.loadingView}>
                <Image
                    source={require("../../assets/loading.gif")}
                    style={{ width: 140, height: 140 }}
                />
            </View>}
            <View style={isDesktopOrLaptop ? styles.mainview : styles.responsiveview}>
                <ScrollView style={styles.main}>
                    <View style={styles.logoView}>
                        <Image
                            source={require("../../assets/logos/logo.png")}
                            style={styles.logoImage}
                        />
                    </View>
                    <View style={styles.CreateAccountView}>
                        <TouchableOpacity>
                            <Ionicons name="md-chevron-back" color="#fff" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.create_account_title}>Anonymous account</Text>
                    </View>
                    <View style={styles.TextGroupView}>
                        <View style={styles.TextView}>
                            <TextInput placeholder="Input your Nick Name" placeholderTextColor="#adb2b6" onChangeText={(e) => setNick_name(e)}
                                style={styles.TextInput} />
                        </View>
                        <View style={styles.TextView}>
                            <TextInput placeholder="Input your Hash Code to Join" placeholderTextColor="#adb2b6" onChangeText={(e) => setNick_hashCode(e)}
                                style={styles.TextInput} />
                        </View>
                        <View style={styles.RouteView}>
                            <TouchableOpacity style={styles.forgotLabel} onPress={() => props.setflag("SignUp")}>
                                <Text style={styles.routetext}>Return to Login</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.TextView}>
                            <TouchableOpacity style={styles.regbtn} onPress={() => verify20HashCode()}>
                                <Text style={styles.regbtntext}>JOIN NOW</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.TextView}>
                            <TouchableOpacity style={styles.regbtn} onPress={() => gethashCode()}>
                                <Text style={styles.regbtntext}>Get Code</Text>
                            </TouchableOpacity>
                        </View>
                        {!isEmpty(hashCodeFromAPI) && <View style={styles.ResultView}>
                            <Text style={styles.create_account_title}>{hashCodeFromAPI}</Text>
                            <CopyToClipboard text={hashCodeFromAPI}
                                onCopy={() => console.log('copied')}>
                                <Image style={styles.actionImage} source={require("../../assets/modal/icon_copy_link.png")} />
                            </CopyToClipboard>
                        </View>}
                    </View>
                </ScrollView>
            </View>
        </LinearGradient >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    responsiveview: {
        width: "100%",
    },
    loadingView: {
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        width: "100%",
        height: Dimensions.get('window').height,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
    },
    mainview: {
        width: 400
    },
    main: {
        flex: 1,
    },
    logoView: {
        width: "100%",
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
    },
    logoImage: {
        height: 80,
        width: "80%"
    },
    CreateAccountView: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingLeft: 20,
        marginTop: 10
    },
    create_account_title: {
        color: "#fff",
        fontSize: 18,
        marginLeft: 10
    },
    loginbtn: {
        width: 55,
        height: 55,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        marginLeft: 13,
        marginRight: 13
    },
    TextGroupView: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 45,
        marginBottom: 160
    },
    ResultView: {
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 2
    },
    actionImage: {
        width: 24,
        height: 24,
        marginBottom: 10
    },
    TextView: {
        width: "100%",
        alignItems: "center"
    },
    TextInput: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        borderBottomColor: "#3b8ad0",
        borderBottomWidth: 2,
        width: "90%",
        color: "#fff",
        marginVertical: 10
    },
    regbtn: {
        backgroundColor: "#9c26b0",
        width: "90%",
        marginVertical: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10
    },
    regbtntext: {
        color: "#fff",
        fontSize: 22,
        textTransform: "uppercase"
    },
    RouteView: {
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 10
    },
    routetext: {
        color: "#fff"
    },
});


const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { loginUser })(Anonymous);