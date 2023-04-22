import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './Screens/HomeScreen';
import Explore from './Screens/Explore';
import Profile from './Screens/Profile';
import Upload from './Screens/Upload';
import CustomSidebarMenu from './Screens/CustomSidebarMenu';

const Drawer = createDrawerNavigator();

const ProfileManage = () => {

    return (
        <NavigationContainer >
            <Drawer.Navigator
                drawerContent={(props) => <CustomSidebarMenu {...props} />}
            >
                <Drawer.Screen name='Home' component={Explore} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Your Channel' component={HomeScreen} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Profile' component={Profile} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Your Videos' component={HomeScreen} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Subscriptions' component={HomeScreen} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='History' component={HomeScreen} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
                <Drawer.Screen name='Add a Video' component={Upload} options={{ headerTintColor: "#fff", headerStyle: { backgroundColor: "#5E1DA6" }, headerTitleStyle: { color: "#fff", fontSize: 24 } }} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

export default ProfileManage;