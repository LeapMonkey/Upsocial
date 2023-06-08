import React, { useState, useEffect, useRef } from 'react';
import { connect } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, TextInput, Dimensions, Platform } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Feather, Ionicons, FontAwesome, AntDesign } from 'react-native-vector-icons';
import Modal from "react-native-modal";

const Settings = (props) => {
    const [opened, setOpened] = useState(false);
    const [title, setTitle] = useState("");

    const createModal = (title) => {
        setOpened(true);
        setTitle(title);
    }
    return (
        <LinearGradient
            colors={['#2ab4fad9', '#1D2145']}
            style={styles.container}
        >
            <View style={styles.headersection}>
                <View style={styles.subheadersection}>
                    <TouchableOpacity style={styles.headerimage} onPress={() => props.navigation.navigate("Home")}>
                        <Image
                            source={require("../../../assets/logos/logo_wh.png")}
                            style={{ height: 30, width: 158 }}
                        />
                    </TouchableOpacity>
                    <View style={styles.iconsection}>
                        <TouchableOpacity style={styles.iconbtn}>
                            <MaterialCommunityIcons name="cast" color="#fff" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconbtn}>
                            <MaterialCommunityIcons name="bell" color="#fff" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconbtn}>
                            <MaterialIcons name="search" color="#fff" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconbtn} onPress={() => props.navigation.toggleDrawer()}>
                            <Feather name="menu" color="#fff" size={35} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.back_btn}>
                <Ionicons name="arrow-back-sharp" color="#fff" size={30} />
                <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>Setting</Text>
            </TouchableOpacity>
            <View style={styles.settingGroup}>
                <Text style={styles.groupTitle}>Account Setting</Text>
                <Text style={styles.groupSummary}>change your account information</Text>
                <TouchableOpacity style={styles.itemBox} onPress={() => createModal("Change Email")}>
                    <Text style={styles.itemTitle}>Change Email</Text>
                    <AntDesign name="right" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemBox} onPress={() => createModal("Change Password")}>
                    <Text style={styles.itemTitle}>Change Password</Text>
                    <AntDesign name="right" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={styles.settingGroup}>
                <Text style={styles.groupTitle}>Legal Agreement</Text>
                <Text style={styles.groupSummary}>By using this app you have read and agree to the following:</Text>
                <TouchableOpacity style={styles.itemBox} onPress={() => createModal("Terms of Service")}>
                    <Text style={styles.itemTitle}>Terms of Service</Text>
                    <AntDesign name="right" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemBox} onPress={() => createModal("User Agreement")}>
                    <Text style={styles.itemTitle}>User Agreement</Text>
                    <AntDesign name="right" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemBox} onPress={() => createModal("Privacy")}>
                    <Text style={styles.itemTitle}>Privacy</Text>
                    <AntDesign name="right" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemBox} onPress={() => createModal("About")}>
                    <Text style={styles.itemTitle}>About</Text>
                    <AntDesign name="right" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            <Modal
                isVisible={opened}
                animationIn={'slideInRight'}
                animationOut={'slideOutRight'}
                style={{ margin: 0, padding: 0 }}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.modalTitle} onPress={() => setOpened(false)}>
                        <AntDesign name="left" size={20} color="#000" />
                        <Text style={{ color: "#000", fontSize: 20 }}>{title}</Text>
                    </TouchableOpacity>

                </View>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        position: "relative"
    },
    headersection: {
        height: Dimensions.get("window").height * 0.08,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
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
        marginLeft: 10,
    },
    back_btn: {
        flexDirection: "row",
        gap: 30,
        marginTop: 50
    },
    settingGroup: {
        flexDirection: "column",
        gap: 10,
        marginTop: 30,
        paddingHorizontal: 30
    },
    groupTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold"
    },
    groupSummary: {
        color: "#fff",
        fontSize: 12,
    },
    itemBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    itemTitle: {
        color: "#fff",
        fontSize: 15,
    },
    modalContainer: {
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        paddingVertical: 50,
    },
    modalTitle: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    }
});

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(Settings);