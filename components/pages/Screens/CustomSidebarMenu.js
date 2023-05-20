import React from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from "react-native-vector-icons";
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const CustomSidebarMenu = (props) => {
    const navigation = useNavigation();
    const logout = () => {
        console.log("hello")
        localStorage.removeItem("isUser");
        localStorage.removeItem("username");
        window.location.reload();
    };

    // useEffect(() => {
    //     console.log("------1------", localStorage.routeName)
    //     navigation(localStorage.routeName);
    //     console.log("------2------", props.state.routes[props.state.index].name)
    //     localStorage.setItem('routeName', props.state.routes[props.state.index].name);
    // }, [props]);


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
                <View style={styles.topSection}>
                    <Image
                        source={require("../../../assets/girl.png")}
                        style={styles.sideMenuUserIcon}
                    />
                    <Image
                        source={require("../../../assets/logos/logo_wh.png")}
                        style={styles.sideMenuProfileIcon}
                    />
                </View>
                <View style={styles.headerBody}>
                    <Text style={styles.username}>{props.userName}</Text>
                    <View style={styles.userDetail}>
                        <Text style={styles.proBadge}>Pro</Text>
                        <Text style={styles.userRole}>Creator</Text>
                        <View style={styles.review}>
                            <Text style={styles.reviewMark}>4.8</Text>
                            <TouchableOpacity onPress={() => props.navigation.navigate("Add a Video")}><Ionicons name="add-circle-outline" color="#F58422" size={24} /></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            <DrawerContentScrollView {...props} >
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
            <TouchableOpacity style={{ marginBottom: 100, flexDirection: "row", alignItems: "center", gap: 20, marginLeft: 20 }} onPress={logout}>
                <MaterialCommunityIcons name="logout" size={30} color="#000" />
                <Text style={{ color: "#000", borderRadius: 5, paddingHorizontal: 10, fontSize: 20, }}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footer} onPress={() => props.navigation.toggleDrawer()}>
                <Text style={{ color: "#fff", backgroundColor: "#fe2472", borderRadius: 5, paddingHorizontal: 10, fontSize: 20, }}>Close</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#560057",
        height: 150,
        paddingVertical: 10,
    },
    footer: {
        height: 50,
        backgroundColor: "#560057",
        justifyContent: "center",
        alignItems: "center"
    },
    headerBody: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 15,
    },
    userDetail: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    proBadge: {
        color: "#fff",
        backgroundColor: "#fe2472",
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 20,
    },
    userRole: {
        fontSize: 18,
        color: "#fff"
    },
    review: {
        flexDirection: "row",
        gap: 5
    },
    reviewMark: {
        fontSize: 18,
        color: "#F58422"
    },
    username: {
        color: "white",
        fontSize: 30
    },
    topSection: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    sideMenuUserIcon: {
        resizeMode: 'contain',
        width: '35%',
        height: 40,
    },
    sideMenuProfileIcon: {
        resizeMode: 'contain',
        width: '55%',
        height: 40,
    }
});

export default CustomSidebarMenu;