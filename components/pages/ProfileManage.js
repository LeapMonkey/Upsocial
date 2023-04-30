import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './Screens/HomeScreen';
import Explore from './Screens/Explore';
import MainProfile from './Profiles';
import EditChannel from './Screens/EditChannel';
import ViewChannel from './Screens/ViewChannel';
import Upload from './Screens/Upload';
import MyVideos from './myvideo';
import CustomSidebarMenu from './Screens/CustomSidebarMenu';

const Drawer = createDrawerNavigator();

const ProfileManage = () => {

    return (
        <NavigationContainer >
            <Drawer.Navigator
                drawerContent={(props) => <CustomSidebarMenu {...props} />}
            >
                <Drawer.Screen name='Home' component={Explore} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Profile' component={MainProfile} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='YourVideos' component={MyVideos} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Your Channel' component={ViewChannel} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Subscriptions' component={HomeScreen} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Add a Video' component={Upload} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='History' component={HomeScreen} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

export default ProfileManage;