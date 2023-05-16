import { Dimensions } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Watch from "../Watch";
import Browse from "../Browse";

const Tab = createMaterialTopTabNavigator();
const Explore = (props) => {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: '#000',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: { fontSize: 12, color: "#fff", paddingHorizontal: 20, width: "100%", flexShrink: 1, whiteSpace: 'nowrap', paddingVertical: 10, borderRadius: 100, backgroundColor: '#5E1AD5' },
                tabBarStyle: { backgroundColor: "#f2f2F2", alignItems: "left" },
                tabBarScrollEnabled: true,
            })}
        >
            <Tab.Screen name="NEWEST" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Browse />} />
            <Tab.Screen name="FOR ME" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Browse />} />
            <Tab.Screen name="SUBSCRIBED" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Browse />} />
            <Tab.Screen name="ANIMATION" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Browse />} />
        </Tab.Navigator>
    );
};

export default Explore;