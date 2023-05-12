import React from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

const CustomSidebarMenu = (props) => {
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