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
            {/* <Tab.Screen name="Animation" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Autos & Vehicles" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Beauty & Fashion" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Comedy" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Cooking & Food" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="DIY & Crafts" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Documentary" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Education" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Entertainment" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Film & Animation" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Gaming" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Health & Fitness" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="How-to & Style" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Kids & Family" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Music" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="News & Politics" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Nonprofits & Activism" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="People & Blogs" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Pets & Animals" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Science & Technology" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Sports" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Travel & Events" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Unboxing & Reviews" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} />
            <Tab.Screen name="Blogs" options={{ tabBarItemStyle: { width: 150 } }} children={() => <Watch setName={setName} />} /> */}
        </Tab.Navigator>
    );
};

export default Explore;