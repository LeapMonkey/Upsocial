import { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Watch from "../Watch";
import Browse from "../Browse";

const Tab = createMaterialTopTabNavigator();
const Explore = (props) => {
    const setName = (name) => {
        props.setName(name);
    };

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Browse') {
                        iconName = focused
                            ? 'ios-browsers'
                            : 'ios-browsers-outline';
                    } else if (route.name === 'Watch') {
                        iconName = focused ? 'watch' : 'watch-outline';
                    }

                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: { fontSize: 15 },
                tabBarStyle: { backgroundColor: "#000" }
            })}
        >
            <Tab.Screen name="Browse" children={() => <Browse setName={setName} setvideoflag={props.setvideoflag} />} />
            <Tab.Screen name="Watch" children={() => <Watch setName={setName} />} />
        </Tab.Navigator>
    );
};

export default Explore;