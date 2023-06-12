import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TextInput, StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { connect } from "react-redux";
import { loginUser } from "../Actions/authAction";
import axios from "axios";
import { apiURL } from "../config/config";
import { ToastAndroid, Platform } from 'react-native';
import { useMediaQuery } from "react-responsive";
import { validate } from 'email-validator';

const SignUP = (props) => {
    const isDesktopOrLaptop = useMediaQuery({
        query: "(min-device-width: 500px)"
    });

    const [loading, setLoading] = useState(false);

    const [isLogin, SetIsLogin] = useState(false);

    const [forgotPassword, setForgotPassword] = useState(false);

    // User Register
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [invalid, setInvalid] = useState(true);

    const [password, setPassword] = useState("");
    const [pass_length, setPass_length] = useState(true);
    const [pass_num, setPass_num] = useState(true);
    const [pass_cap, setPass_cap] = useState(true);

    // User Login
    const [uEmail, setUEmail] = useState("");
    const [uPassword, setUPassword] = useState("");

    //forgot password email
    const [forEmail, setForEmail] = useState("");
    const [codeFlag, setCodeFlag] = useState(false);
    const [recoveryCode, setCode] = useState("");
    const [verified, setVerified] = useState(false);
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const ForgotPassword = () => {
        setForgotPassword(true);
    };

    const UserRegister = (e) => {
        if (username.trim() === "") {
            if (Platform.OS === "android" || Platform.OS === "ios") {
                ToastAndroid.show("Please input username!", ToastAndroid.SHORT);
            } else {
                alert("Please input username!");
            }
        } else if (email.trim() === "") {
            if (Platform.OS === "android" || Platform.OS === "ios") {
                ToastAndroid.show("Please input email!", ToastAndroid.SHORT);
            } else {
                alert("Please input email!");
            }
        } else if (password.trim() === "") {
            if (Platform.OS === "android" || Platform.OS === "ios") {
                ToastAndroid.show("Please input password!", ToastAndroid.SHORT);
            } else {
                alert("Please input password!");
            }
        } else {
            e.preventDefault();
            setLoading(true);
            const userData = {
                username: username,
                email: email,
                password: password,
            };
            axios
                .post(apiURL + "/api/Upsocial/users/register", userData, {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': '*',
                })
                .then((res) => {
                    if (Platform.OS === "android") {
                        ToastAndroid.show(res.data.msg, ToastAndroid.SHORT);
                    }
                    SetIsLogin(true);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }

    const UserLogin = (e) => {
        if (uEmail.trim() === "") {
            if (Platform.OS === "android" || Platform.OS === "ios") {
                ToastAndroid.show("Please input email!", ToastAndroid.SHORT);
            } else {
                alert("Please input email!");
            }
        } else if (uPassword.trim() === "") {
            if (Platform.OS === "android" || Platform.OS === "ios") {
                ToastAndroid.show("Please input password!", ToastAndroid.SHORT);
            } else {
                alert("Please input password!");
            }
        } else {
            e.preventDefault();
            const userData = {
                email: uEmail,
                password: uPassword
            };
            props.loginUser(userData);
        }
    }

    const ValidateEmail = (e) => {
        if (validate(e)) {
            setEmail(e);
            setUEmail(e);
            setForEmail(e);
            setInvalid(true);
        } else {
            setInvalid(false);
        }
    }

    const ValidatePassword = (e) => {
        if (e.length >= 8) {
            setPass_length(true);
        } else {
            setPass_length(false);
        }

        if (/[A-Z]/.test(e)) {
            setPass_cap(true);
        } else {
            setPass_cap(false);
        }

        if (/[0-9]/.test(e)) {
            setPass_num(true);
        } else {
            setPass_num(false);
        }

        if (pass_length && pass_cap && pass_num) {
            setPassword(e);
            setNewPass(e);
            setConfirmPass(e);
        }
    }

    const setRecoveryCode = (e) => {
        setCode(e);
    };

    const GetCode = () => {
        axios.post(apiURL + "/api/Upsocial/users/reset-password", { userEmail: forEmail }, {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            if (res.data.status) {
                alert(res.data.msg);
                setCodeFlag(true);
            } else {
                alert(res.data.msg);
            }
        }).catch((err) => {
            console.warn(err);
        });
    };

    const confirmCode = () => {
        axios.post(apiURL + "/api/Upsocial/users/verify-code", { userEmail: forEmail, code: recoveryCode }, {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            if (res.data.status) {
                alert(res.data.msg);
                setVerified(true);
            } else {
                alert(res.data.msg);
                setCodeFlag(false);
            }
        }).catch((err) => {
            console.warn(err);
        });

    };

    const confirmNewPass = () => {
        if (newPass == confirmPass) {
            axios.post(apiURL + "/api/Upsocial/users/set-new-password", { userEmail: forEmail, password: newPass }, {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
            }).then((res) => {
                if (res.data.status) {
                    alert(res.data.msg);
                    setCodeFlag(false);
                    SetIsLogin(true);
                    setVerified(false);
                    setForgotPassword(false);
                } else {
                    alert(res.data.msg);
                }
            }).catch((err) => {
                console.warn(err);
            });
        } else {
            alert("Please input correct confirm password!")
        }
    }

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
                {!isLogin && !forgotPassword && (<ScrollView style={styles.main}>
                    <View style={styles.logoView}>
                        <Image
                            source={require("../../assets/logos/logo.png")}
                            style={styles.logoImage}
                        />
                    </View>
                    <View style={styles.CreateAccountView}>
                        <TouchableOpacity onPress={() => props.setflag("onboarding")}>
                            <Ionicons name="md-chevron-back" color="#fff" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.create_account_title}>Create Account</Text>
                    </View>
                    <View style={styles.loginotherview}>
                        <View style={styles.subotherview}>
                            <TouchableOpacity style={[{ backgroundColor: '#4468b0' }, styles.loginbtn]}>
                                <Ionicons name="logo-facebook" color="#fff" size={30} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[{ backgroundColor: '#3cbff8' }, styles.loginbtn]}>
                                <Ionicons name="ios-logo-twitter" color="#fff" size={30} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[{ backgroundColor: '#ea4c89' }, styles.loginbtn]}>
                                <Ionicons name="ios-logo-dribbble" color="#fff" size={30} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.loginothertitle}>
                            <Text style={styles.loginothertitletxt}>or be classical</Text>
                        </View>
                    </View>
                    <View style={styles.TextGroupView}>
                        <View style={styles.TextView}>
                            <TextInput placeholder="Username" placeholderTextColor="#adb2b6"
                                style={styles.TextInput} onChangeText={(e) => setUsername(e)} />
                        </View>
                        <View style={styles.TextView}>
                            <TextInput placeholder="Email" placeholderTextColor="#adb2b6"
                                style={invalid ? styles.TextInput : styles.Error_TextInput} onChangeText={(e) => ValidateEmail(e)} />
                            {!invalid && <Text style={{ color: "red", fontSize: 16 }}>Invalid Email Address!</Text>}
                        </View>
                        <View style={styles.TextView}>
                            <TextInput placeholder="Password" placeholderTextColor="#adb2b6"
                                secureTextEntry={true}
                                style={pass_length && pass_num && pass_cap ? styles.TextInput : styles.Error_TextInput} onChangeText={(e) => ValidatePassword(e)} />
                            {!pass_length && <Text style={{ color: "red", fontSize: 16 }}>Password has more than 8 characters!</Text>}
                            {!pass_num && <Text style={{ color: "red", fontSize: 16 }}>Password has a number!</Text>}
                            {!pass_cap && <Text style={{ color: "red", fontSize: 16 }}>Password has a capital letter!</Text>}
                        </View>
                        <View style={styles.TextView}>
                            <TouchableOpacity style={styles.regbtn} onPress={UserRegister}>
                                <Text style={styles.regbtntext}>SIGN UP</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.RouteView}>
                            <View>
                                <Text style={styles.routetext}>Already have an account?</Text>
                            </View>
                            <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => SetIsLogin(true)}>
                                <Text style={styles.routetext}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.TextView}>
                            <TouchableOpacity style={[styles.regbtn, { backgroundColor: "#433b45" }]} onPress={() => props.setflag("Anonymous")}>
                                <Text style={styles.regbtntext}>
                                    Anonymous account
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.RouteView}>
                            <View>
                                <Text style={styles.routetext}>Already have your </Text>
                            </View>
                            <TouchableOpacity onPress={() => SetIsLogin(true)}>
                                <Text style={styles.routetext}>login</Text>
                            </TouchableOpacity>
                            <View>
                                <Text style={styles.routetext}> code?</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>)}
                {isLogin && !forgotPassword && (<ScrollView style={styles.main}>
                    <View style={styles.logoView}>
                        <Image
                            source={require("../../assets/logos/logo.png")}
                            style={styles.logoImage}
                        />
                    </View>
                    <View style={styles.CreateAccountView}>
                        <TouchableOpacity onPress={() => SetIsLogin(false)}>
                            <Ionicons name="md-chevron-back" color="#fff" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.create_account_title}>Sign In</Text>
                    </View>
                    <View style={styles.TextGroupView}>
                        <View style={styles.TextView}>
                            <TextInput placeholder="Email" placeholderTextColor="#adb2b6" onChangeText={(e) => ValidateEmail(e)}
                                style={styles.TextInput} />
                            {!invalid && <Text style={{ color: "red" }}>Invalid Email Address!</Text>}
                        </View>
                        <View style={styles.TextView}>
                            <TextInput placeholder="Password" placeholderTextColor="#adb2b6" onChangeText={(e) => setUPassword(e)}
                                secureTextEntry={true}
                                style={styles.TextInput} />
                        </View>
                        <View style={styles.RouteView}>
                            <TouchableOpacity style={styles.forgotLabel} onPress={() => ForgotPassword()}>
                                <Text style={styles.routetext}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.TextView}>
                            <TouchableOpacity style={styles.regbtn} onPress={UserLogin}>
                                <Text style={styles.regbtntext}>SIGN IN</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.TextView}>
                            <TouchableOpacity style={[styles.regbtn, { backgroundColor: "#433b45" }]} onPress={() => props.setflag("Anonymous")}>
                                <Text style={styles.regbtntext}>
                                    Anonymous account
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.RouteView}>
                            <View>
                                <Text style={styles.routetext}>Don't have account? </Text>
                            </View>
                            <TouchableOpacity onPress={() => SetIsLogin(false)}>
                                <Text style={styles.routetext}>SIGN UP</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>)}
                {forgotPassword && !codeFlag && (<ScrollView style={styles.main}>
                    <View style={styles.logoView}>
                        <Image
                            source={require("../../assets/logos/logo.png")}
                            style={styles.logoImage}
                        />
                    </View>
                    <View style={styles.CreateAccountView}>
                        <TouchableOpacity onPress={() => setForgotPassword(false)}>
                            <Ionicons name="md-chevron-back" color="#fff" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.create_account_title}>Forgot Password</Text>
                    </View>
                    <View style={styles.TextGroupView}>
                        <View style={styles.TextView}>
                            <TextInput placeholder="Email" placeholderTextColor="#adb2b6" onChangeText={(e) => ValidateEmail(e)}
                                style={styles.TextInput} />
                            {!invalid && <Text style={{ color: "red" }}>Invalid Email Address!</Text>}
                        </View>
                        <View style={styles.RouteView}>
                            <TouchableOpacity style={styles.forgotLabel} onPress={() => setForgotPassword(false)}>
                                <Text style={styles.routetext}>Return to Login</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.TextView}>
                            <TouchableOpacity style={styles.regbtn} onPress={GetCode}>
                                <Text style={styles.regbtntext}>Get Code</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>)}
                {codeFlag && !verified && (<ScrollView style={styles.main}>
                    <View style={styles.logoView}>
                        <Image
                            source={require("../../assets/logos/logo.png")}
                            style={styles.logoImage}
                        />
                    </View>
                    <View style={styles.CreateAccountView}>
                        <TouchableOpacity onPress={() => setCodeFlag(false)}>
                            <Ionicons name="md-chevron-back" color="#fff" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.create_account_title}>Input Recovery Code</Text>
                    </View>
                    <View style={styles.TextGroupView}>
                        <View style={styles.TextView}>
                            <TextInput placeholder="Recovery Code" placeholderTextColor="#adb2b6" style={styles.TextInput} onChangeText={(e) => setRecoveryCode(e)} />
                        </View>
                        <View style={styles.TextView}>
                            <TouchableOpacity style={styles.regbtn} onPress={confirmCode}>
                                <Text style={styles.regbtntext}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>)}
                {verified && (<ScrollView style={styles.main}>
                    <View style={styles.logoView}>
                        <Image
                            source={require("../../assets/logos/logo.png")}
                            style={styles.logoImage}
                        />
                    </View>
                    <View style={styles.CreateAccountView}>
                        <TouchableOpacity onPress={() => setCodeFlag(false)}>
                            <Ionicons name="md-chevron-back" color="#fff" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.create_account_title}>Reset your Password</Text>
                    </View>
                    <View style={styles.TextGroupView}>
                        <View style={styles.TextView}>
                            <TextInput placeholder="New Password" placeholderTextColor="#adb2b6"
                                secureTextEntry={true}
                                style={pass_length && pass_num && pass_cap ? styles.TextInput : styles.Error_TextInput} onChangeText={(e) => ValidatePassword(e)} />
                            {!pass_length && <Text style={{ color: "red", fontSize: 16 }}>Password has more than 8 characters!</Text>}
                            {!pass_num && <Text style={{ color: "red", fontSize: 16 }}>Password has a number!</Text>}
                            {!pass_cap && <Text style={{ color: "red", fontSize: 16 }}>Password has a capital letter!</Text>}
                        </View>
                        <View style={styles.TextView}>
                            <TextInput placeholder="Confirm Password" placeholderTextColor="#adb2b6"
                                secureTextEntry={true}
                                style={pass_length && pass_num && pass_cap ? styles.TextInput : styles.Error_TextInput} onChangeText={(e) => ValidatePassword(e)} />
                            {!pass_length && <Text style={{ color: "red", fontSize: 16 }}>Password has more than 8 characters!</Text>}
                            {!pass_num && <Text style={{ color: "red", fontSize: 16 }}>Password has a number!</Text>}
                            {!pass_cap && <Text style={{ color: "red", fontSize: 16 }}>Password has a capital letter!</Text>}
                        </View>
                        <View style={styles.TextView}>
                            <TouchableOpacity style={styles.regbtn} onPress={confirmNewPass}>
                                <Text style={styles.regbtntext}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>)}
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
    loginotherview: {
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    subotherview: {
        flexDirection: "row"
    },
    loginothertitle: {
        marginTop: 20
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
    loginothertitletxt: {
        color: "#fff",
        fontWeight: "bold"
    },
    TextGroupView: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 45,
        marginBottom: 160
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
    Error_TextInput: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        borderBottomColor: "red",
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

export default connect(mapStateToProps, { loginUser })(SignUP);