import { Dimensions } from "react-native";
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
                tabBarActiveTintColor: '#000',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: { fontSize: 12, color: "#fff", paddingHorizontal: 20, width: 100, paddingVertical: 10, borderRadius: 100, backgroundColor: '#5E1AD5' },
                tabBarStyle: { backgroundColor: "#C2C2C2", alignItems: "left", width: Dimensions.get("window").width },
                tabBarScrollEnabled: true,
            })}
        >
            <Tab.Screen name="Browse" options={{ tabBarItemStyle: { width: 100 } }} children={() => <Browse setName={setName} setvideoflag={props.setvideoflag} />} />
            <Tab.Screen name="Watch" options={{ tabBarItemStyle: { width: 100 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="News" options={{ tabBarItemStyle: { width: 100 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Music" options={{ tabBarItemStyle: { width: 100 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Sports" options={{ tabBarItemStyle: { width: 100 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Concert" options={{ tabBarItemStyle: { width: 100 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Blog" options={{ tabBarItemStyle: { width: 100 } }} children={() => <Watch setName={setName} />} />
        </Tab.Navigator>
    );
};

export default Explore;