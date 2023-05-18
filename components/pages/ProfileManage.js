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
import uploadingViddeo from './upload/uploadingViddeo';
import Details from './MyVideos/details';
import recentsUpload from './recentsUpload';
import Settings from './settings';

import Explore from './Screens/Explore'; // Old one
import ViewChannel from './channels/ViewChannel';
import HomeScreen from './Screens/HomeScreen';
import Subscription from './Screens/Subscription';
import Personalize from './Screens/Personalize';
import EditChannel from './Screens/EditChannel';
import ChannelLists from './Screens/ChannelLists';
import Upload from './Screens/Upload';
import CategoryScreen from './Category/CategoryScreen';
// Upload Video

// all users
import Users from './others/users';
// My channel
import MainChannel from './channels';

const Drawer = createDrawerNavigator();

const ProfileManage = (props) => {
    const [userName, setUserName] = useState("");
    useEffect(() => {
        setUserName(props.auth.user.Data.username);
    }, []);

    return (
        <NavigationContainer >
            <Drawer.Navigator
                drawerContent={(props) => <CustomSidebarMenu {...props} userName={userName} />}
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
                })
                }
            >
                <Drawer.Screen name='Home' component={Home} options={{ headerShown: false, headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='My Videos' component={MainVideos} options={{ headerShown: false, headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Profile' component={MainProfile} options={{ headerShown: false, headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Add a Video' component={uploadingViddeo} options={{ headerShown: false, headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Settings' component={Settings} options={{ headerShown: false, headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='RecentsUpload' component={recentsUpload} options={{ drawerItemStyle: { display: "none" }, headerShown: false, headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                {/* <Drawer.Screen name='Your Channel' component={MainChannel} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} /> */}
                {/* <Drawer.Screen name='All Users' component={Users} options={{ headerShown: false, headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} /> */}
                {/* <Drawer.Screen name='Upload Contents' component={uploadingViddeo} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} /> */}
                {/* <Drawer.Screen name='Subscriptions' component={Subscription} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} /> */}
                {/* <Drawer.Screen name='History' component={HomeScreen} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} /> */}
                {/* <Drawer.Screen name='Category' component={CategoryScreen} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} /> */}
                {/* <Drawer.Screen name='Create Channel' component={EditChannel} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} /> */}
                {/* <Drawer.Screen name='Personalize Feeds' component={Personalize} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} /> */}
                {/* <Drawer.Screen name='Channel Lists' component={ChannelLists} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} /> */}
            </Drawer.Navigator>
        </NavigationContainer >
    );
}

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(ProfileManage);