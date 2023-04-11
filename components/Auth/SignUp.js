import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TextInput, StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { loginUser } from "../Actions/authAction";
import axios from "axios";
import { apiURL } from "../config/config";
import Notification from "../Actions/Notification";

const SignUP = (props) => {

    const [isLogin, SetIsLogin] = useState(false);

    // User Register
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // User Login
    const [uEmail, setUEmail] = useState("");
    const [uPassword, setUPassword] = useState("");

    const UserRegister = (e) => {
        e.preventDefault();
        const userData = {
            username: username,
            email: email,
            password: password,
        };
        axios
            .post(apiURL + "/api/Upsocial/users/register", userData)
            .then((res) => {
                Notification(res.data.msg);
                SetIsLogin(true)
            })
            .catch((err) => {
                console.error(err)
            });
    }

    const UserLogin = (e) => {
        e.preventDefault();
        const userData = {
            email: uEmail,
            password: uPassword
        };
        props.loginUser(userData);
    }

    return (
        <LinearGradient
            colors={['#2ab4fad9', '#1D2145']}
            style={styles.container}
        >
            {!isLogin && (<ScrollView style={styles.main}>
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
                            style={styles.TextInput} onChangeText={(e) => setEmail(e)} />
                    </View>
                    <View style={styles.TextView}>
                        <TextInput placeholder="Password" placeholderTextColor="#adb2b6"
                            secureTextEntry={true}
                            style={styles.TextInput} onChangeText={(e) => setPassword(e)} />
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
                        <TouchableOpacity style={[styles.regbtn, { backgroundColor: "#433b45" }]}>
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
            {isLogin && (<ScrollView style={styles.main}>
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
                        <TextInput placeholder="Email" placeholderTextColor="#adb2b6" onChangeText={(e) => setUEmail(e)}
                            style={styles.TextInput} />
                    </View>
                    <View style={styles.TextView}>
                        <TextInput placeholder="Password" placeholderTextColor="#adb2b6" onChangeText={(e) => setUPassword(e)}
                            secureTextEntry={true}
                            style={styles.TextInput} />
                    </View>
                    <View style={styles.RouteView}>
                        <TouchableOpacity style={styles.forgotLabel}>
                            <Text style={styles.routetext}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.TextView}>
                        <TouchableOpacity style={styles.regbtn} onPress={UserLogin}>
                            <Text style={styles.regbtntext}>SIGN IN</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.TextView}>
                        <TouchableOpacity style={[styles.regbtn, { backgroundColor: "#433b45" }]}>
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
        </LinearGradient >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        justifyContent: "center"
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
    auth: state.auth
});

export default connect(mapStateToProps, { loginUser })(SignUP);