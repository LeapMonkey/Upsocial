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
                tabBarLabelStyle: { fontSize: 12, color: "#fff", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: 'gray' },
                tabBarStyle: { backgroundColor: "#fff", overflow: 'auto', width: Dimensions.get("window").width }
            })}
        >
            <Tab.Screen name="Browse" options={{ tabBarItemStyle: { width: 100 } }} children={() => <Browse setName={setName} setvideoflag={props.setvideoflag} />} />
            <Tab.Screen name="Watch" options={{ tabBarItemStyle: { width: 100 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="News" options={{ tabBarItemStyle: { width: 100 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Music" options={{ tabBarItemStyle: { width: 100 } }} children={() => <Watch setName={setName} />} />
        </Tab.Navigator>
    );
};

export default Explore;