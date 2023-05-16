import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
// Icon
import { FontAwesome5, FontAwesome, Ionicons, Entypo } from '@expo/vector-icons';
// Home main page
import Explore from './Screens/Explore'; // Old one
import Home from './Home/Index'; // New One
import MyVideos from './MyVideos';

import HomeScreen from './Screens/HomeScreen';

import Subscription from './Screens/Subscription';
import Personalize from './Screens/Personalize';
import MainProfile from './Profiles';
import EditChannel from './Screens/EditChannel';
import ChannelLists from './Screens/ChannelLists';
import Upload from './Screens/Upload';
import My_Videos from './myvideo';
import CustomSidebarMenu from './Screens/CustomSidebarMenu';
import CategoryScreen from './Category/CategoryScreen';
// Upload Video
import uploadingViddeo from './upload/uploadingViddeo';

// all users
import Users from './others/users';
// My channel
import MainChannel from './channels';

const Drawer = createDrawerNavigator();

const ProfileManage = (props) => {
    const [userName, setUserName] = useState("");
    // useEffect(() => {
    //     setUserName(props.auth.user.Data.username);
    // }, []);

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
                        }
                    },
                })
                }
            >
                <Drawer.Screen name='Home' component={Home} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='My Videos' component={MyVideos} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Profile' component={MainProfile} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Add a Video' component={Upload} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='All Users' component={Users} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                {/* <Drawer.Screen name='Your Videos' component={MyVideos} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} /> */}
                {/* <Drawer.Screen name='Upload Contents' component={uploadingViddeo} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} /> */}
                {/* <Drawer.Screen name='Your Channel' component={MainChannel} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} /> */}
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