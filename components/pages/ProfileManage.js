import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
// Icon
import { FontAwesome5, FontAwesome, Ionicons, Entypo, Feather } from '@expo/vector-icons';
import CustomSidebarMenu from './Screens/CustomSidebarMenu';
// Home main page
import Home from './Home/Index'; // New One
import MainVideos from './MyVideos/main';
import MainProfile from './Profiles';
import UploadingVideo from './upload/uploadingVideo';
import recentsUpload from './recentsUpload';
import Settings from './settings';

import Test from './Test';

const Drawer = createDrawerNavigator();

const ProfileManage = (props) => {
    const [userName, setUserName] = useState("");
    const [lastRouteName, setLastRouteName] = useState("");

    useEffect(() => {
        if (localStorage.getItem("username")) {
            setUserName(localStorage.getItem("username"));
        } else {
            setUserName("User")
        }
    }, []);

    const setLastRouteNames = (name) => {
        setLastRouteName(name);
    }

    return (
        <NavigationContainer >
            <Drawer.Navigator
                useLegacyImplementation
                drawerContent={(props) => <CustomSidebarMenu {...props} userName={userName} routeName={setLastRouteNames} />}
                screenOptions={({ route }) => ({
                    drawerIcon: ({ focused, color, size }) => {
                        if (route.name === 'Home') {
                            return <FontAwesome5 name="home" size={size} color={color} />;
                        } else if (route.name === "My Videos") {
                            return <Entypo name="folder-video" size={size} color={color} />;
                        } else if (route.name === "Profile") {
                            return <FontAwesome name="user-circle-o" size={size} color={color} />;
                        } else if (route.name === "Add a Video") {
                            return <Ionicons name="add-circle-outline" size={size} color={color} />;
                        } else if (route.name === "All Users") {
                            return <FontAwesome name="users" size={size} color={color} />;
                        } else if (route.name === "Settings") {
                            return <Feather name="settings" size={size} color={color} />;
                        }
                    },
                })}
                firstRouteName={lastRouteName}
            >
                <Drawer.Screen name='Home' component={Home} options={{ headerShown: false, headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='My Videos' component={MainVideos} options={{ headerShown: false, headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Profile' component={MainProfile} options={{ headerShown: false, headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Add a Video' component={UploadingVideo} options={{ headerShown: false, headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Settings' component={Settings} options={{ headerShown: false, headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='RecentsUpload' component={recentsUpload} options={{ drawerItemStyle: { display: "none" }, headerShown: false, headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
            </Drawer.Navigator>
        </NavigationContainer >
    );
}

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(ProfileManage);