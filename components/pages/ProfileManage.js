import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './Screens/HomeScreen';
import Subscription from './Screens/Subscription';
import Personalize from './Screens/Personalize';
import Explore from './Screens/Explore';
import MainProfile from './Profiles';
import EditChannel from './Screens/EditChannel';
import ChannelLists from './Screens/ChannelLists';
import Upload from './Screens/Upload';
import MyVideos from './myvideo';
import CustomSidebarMenu from './Screens/CustomSidebarMenu';
import CategoryScreen from './Category/CategoryScreen';
// Icon
import {
    FontAwesome5, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons
} from '@expo/vector-icons';
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
                        } else if (route.name === "Your Channel") {
                            return <FontAwesome name="user-circle-o" size={size} color={color} />;
                        } else if (route.name === "Profile") {
                            return <FontAwesome name="user-circle-o" size={size} color={color} />;
                        } else if (route.name === "Your Videos") {
                            return <FontAwesome name="user-circle-o" size={size} color={color} />;
                        } else if (route.name === "Your Videos") {
                            return <FontAwesome name="user-circle-o" size={size} color={color} />;
                        } else if (route.name === "Subscriptions") {
                            return <Ionicons name="list-circle-outline" size={size} color={color} />;
                        } else if (route.name === "History") {
                            return <MaterialCommunityIcons name="history" size={size} color={color} />;
                        } else if (route.name === "Add a Video") {
                            return <Ionicons name="add-circle-outline" size={size} color={color} />;
                        } else if (route.name === "Category") {
                            return <MaterialIcons name="category" size={size} color={color} />;
                        } else if (route.name === "Create Channel") {
                            return <MaterialIcons name="create-new-folder" size={size} color={color} />;
                        } else if (route.name === "Channel Lists") {
                            return <MaterialIcons name="featured-play-list" size={size} color={color} />;
                        } else if (route.name === "Personalize Feeds") {
                            return <MaterialIcons name="personal-video" size={size} color={color} />;
                        } else if (route.name === "All Users") {
                            return <FontAwesome name="users" size={size} color={color} />;
                        }
                    },
                })
                }
            >
                <Drawer.Screen name='Home' component={Explore} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Your Channel' component={MainChannel} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Profile' component={MainProfile} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Your Videos' component={MyVideos} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Subscriptions' component={Subscription} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='History' component={HomeScreen} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Add a Video' component={Upload} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Category' component={CategoryScreen} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Create Channel' component={EditChannel} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Channel Lists' component={ChannelLists} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Personalize Feeds' component={Personalize} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='All Users' component={Users} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
            </Drawer.Navigator>
        </NavigationContainer >
    );
}

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(ProfileManage);