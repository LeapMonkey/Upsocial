import React, { useState, useEffect } from 'react';
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import SelectDropdown from "react-native-select-dropdown";
import { MultiSelect } from 'react-native-element-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from "react-native-vector-icons/AntDesign";
import { Country, State, City } from 'country-state-city';

const channels = [
    {
        _id: 1,
        name: "Personal Profile"
    },
    {
        _id: 2,
        name: "Building Web3"
    },
    {
        _id: 3,
        name: "My Gaming"
    },
    {
        _id: 4,
        name: "Kids Love To Run"
    },
    {
        _id: 5,
        name: "Kids1"
    },
];

const DATA = [
    { label: 'React Naive', value: '1' },
    { label: 'Javascript', value: '2' },
    { label: 'Laravel', value: '3' },
    { label: 'PHP', value: '4' },
    { label: 'jQuery', value: '5' },
    { label: 'Bootstrap', value: '6' },
    { label: 'HTML', value: '7' },
    { label: 'CSS', value: '8' },
];

const UploadingVideo = () => {
    // Keys
    const [keyword, setKeyword] = useState("");
    const [keywords, setKeywords] = useState([]);

    const [selected, setSelected] = React.useState([]);

    const [countries, setCountries] = useState([]);

    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    const renderDataItem = (item) => {
        return (
            <View style={styles.item}>
                <Text style={styles.selectedTextStyle}>{item.label}</Text>
                <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
            </View>
        );
    };

    const addKeyword = (e) => {
        if (e.nativeEvent.key == "Enter") {
            if (keywords.length == 10) {
                alert("Max keywords number is 10 !");
                setKeyword("");
                return;
            } else {
                var tempkeys = keyword.split(/\s*,\s*/);
                if (tempkeys.length + keywords.length > 10) {
                    alert("Max keywords number is 10 !");
                } else {
                    setKeywords(keywords => [...keywords, ...tempkeys]);
                    setKeyword("");
                }
            }
        }
    };

    return (
        <LinearGradient
            colors={['#2ab4fad9', '#1D2145']}
            style={styles.container}
        >
            <View style={styles.headersection}>
                <View style={styles.subheadersection}>
                    <View style={styles.headerimage}>
                        <Image
                            source={require("../../../assets/logos/logo_wh.png")}
                            style={{ height: 30, width: 158 }}
                        />
                    </View>
                    <View style={styles.iconsection}>
                        <TouchableOpacity style={styles.iconbtn}>
                            <MaterialCommunityIcons name="cast" color="#fff" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconbtn}>
                            <MaterialCommunityIcons name="bell" color="#fff" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconbtn}>
                            <MaterialIcons name="search" color="#fff" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconbtn}>
                            <Feather name="user" color="#fff" size={35} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.contentsection}>
                <ScrollView style={styles.scrollcontentsection}>
                    <View style={styles.scrollviewcontent}>
                        <View style={styles.mainview}>
                            <View style={styles.uploadimageview}>
                                <Text style={styles.uploadimagetext}>Add Or Upload A Video</Text>
                                <FontAwesome name='camera' color="#fff" size={140} />
                                <TouchableOpacity style={styles.uploadbtnicon}>
                                    <FontAwesome name='plus-circle' color="#000" size={34} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.TextView}>
                                <TextInput placeholder="Title" placeholderTextColor="#adb2b6"
                                    style={styles.TextInput} onChangeText={(e) => console.log(e)} />
                            </View>
                            <View style={styles.TextView}>
                                <TextInput placeholder="Description" placeholderTextColor="#adb2b6"
                                    style={styles.TextArea} onChangeText={(e) => console.log(e)} multiline={true} />
                            </View>
                            <View style={styles.TextView}>
                                <TextInput placeholder="Tags" placeholderTextColor="#adb2b6"
                                    style={styles.TextInput} onKeyPress={(e) => addKeyword(e)} onChangeText={(e) => setKeyword(e)} />
                                <View style={{ flexDirection: "row", gap: 10, width: "100%", flexWrap: "wrap", marginTop: 5 }}>
                                    {keywords.map((index, key) => {
                                        return (
                                            <Text style={{ color: "#fff" }} key={key}>{index}</Text>
                                        );
                                    })}
                                </View>
                            </View>
                            <View style={styles.DropView}>
                                <SelectDropdown
                                    data={channels}
                                    onSelect={(selectedItem, index) => {
                                        console.log(selectedItem.name);
                                    }}
                                    defaultButtonText={"Choose Channel"}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return selectedItem.name;
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return item.name;
                                    }}
                                    buttonStyle={styles.dropdown4BtnStyle}
                                    buttonTextStyle={styles.dropdown4BtnTxtStyle}
                                    renderDropdownIcon={(isOpened) => {
                                        return <View>
                                            <Feather name={!isOpened ? 'chevron-down' : 'chevron-up'} color="#fff" size={20} />
                                        </View>
                                    }}
                                    dropdownIconPosition={"right"}
                                    dropdownStyle={styles.dropdown4DropdownStyle}
                                    rowStyle={styles.dropdown4RowStyle}
                                    rowTextStyle={styles.dropdown4RowTxtStyle}
                                />
                                <TouchableOpacity style={styles.DropBtnIcon}>
                                    <MaterialCommunityIcons name='plus-circle-outline' color="#fff" size={30} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.Multiview}>
                                <Text style={{ color: "#adb2b6", fontSize: 16, paddingHorizontal: 10 }}>Categories</Text>
                                <MultiSelect
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={DATA}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select"
                                    value={selected}
                                    search
                                    searchPlaceholder="Search..."
                                    onChange={item => {
                                        setSelected(item);
                                    }}
                                    renderItem={renderDataItem}
                                    renderSelectedItem={(item, unSelect) => (
                                        <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                                            <View style={styles.selectedStyle}>
                                                <Text style={styles.textSelectedStyle}>{item.label}</Text>
                                                <AntDesign color="black" name="delete" size={17} />
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                            <View style={styles.DropView}>
                                <SelectDropdown
                                    data={countries}
                                    onSelect={(selectedItem, index) => {
                                        console.log(selectedItem.name);
                                    }}
                                    defaultButtonText={"Location"}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return selectedItem.name;
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return item.name;
                                    }}
                                    buttonStyle={styles.dropdown4BtnStyle}
                                    buttonTextStyle={styles.dropdown4BtnTxtStyle}
                                    renderDropdownIcon={(isOpened) => {
                                        return <View>
                                            <Feather name={!isOpened ? 'chevron-down' : 'chevron-up'} color="#fff" size={20} />
                                        </View>
                                    }}
                                    dropdownIconPosition={"right"}
                                    dropdownStyle={styles.dropdown4DropdownStyle}
                                    rowStyle={styles.dropdown4RowStyle}
                                    rowTextStyle={styles.dropdown4RowTxtStyle}
                                />
                                <TouchableOpacity style={styles.locationbtnicon}>
                                    <Entypo name='location' color="#fff" size={26} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.uploadview}>
                                <TouchableOpacity style={styles.uploadviewbtn}>
                                    <Text style={{ fontSize: 20, color: "#fff" }}>Upload</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ marginTop: 10 }}>
                                    <Text style={{ fontSize: 14, color: "#fff" }}>Clear</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        position: "relative"
    },
    headersection: {
        height: 60,
        width: "100%",
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        left: 0,
    },
    subheadersection: {
        width: "calc(100% - 30px)",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    headerimage: {
        flex: 1
    },
    iconsection: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    iconbtn: {
        marginLeft: 10,
    },
    contentsection: {
        marginTop: 60,
        flex: 1,
        width: "100%",
    },
    scrollcontentsection: {
        width: "100%",
        height: "100%"
    },
    scrollviewcontent: {
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    mainview: {
        width: "65%",
    },
    uploadimageview: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    uploadimagetext: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 10
    },
    uploadbtnicon: {
        bottom: 20,
        right: "calc(50% - 55px)",
        position: "absolute"
    },
    TextView: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        width: "100%",
        position: "relative"
    },
    TextInput: {
        width: "100%",
        fontSize: 20,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomColor: "#fff",
        borderBottomWidth: 1,
        color: "#fff"
    },
    TextArea: {
        width: "100%",
        fontSize: 20,
        height: 100,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomColor: "#fff",
        borderBottomWidth: 1,
        color: "#fff"
    },
    dropdown4BtnStyle: {
        width: "calc(100% - 40px)",
        backgroundColor: "transparent",
        borderColor: "transparent", borderBottomColor: "#fff",
        borderBottomWidth: 1,
    },
    dropdown4BtnTxtStyle: {
        color: "#fff",
        textAlign: "left"
    },
    dropdown4DropdownStyle: {
        backgroundColor: "transparent",
        width: "60%"
    },
    dropdown4RowStyle: {
        backgroundColor: "#EFEFEF",
        borderBottomColor: "#C5C5C5",
    },
    dropdown4RowTxtStyle: {
        color: "#444",
        textAlign: "left"
    },
    DropView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        width: "100%",
    },
    DropBtnIcon: {
        width: 40,
        justifyContent: "flex-end",
        alignItems: "flex-end"
    },
    locationbtnicon: {
        position: "absolute",
        right: 0,
        bottom: 10
    },
    uploadview: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
        marginBottom: 20,
        width: "100%",
        position: "relative"
    },
    uploadviewbtn: {
        backgroundColor: "#c081ff",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 30
    },

    // multi element select
    Multiview: {
        flexDirection: "column",
        marginTop: 20,
        width: "100%",
        position: "relative"
    },
    dropdown: {
        width: "100%",
        backgroundColor: 'transparent',
        paddingBottom: 10,
        paddingHorizontal: 10,
        borderBottomColor: "#fff",
        borderBottomWidth: 1
    },
    placeholderStyle: {
        fontSize: 20,
        color: "#adb2b6"
    },
    selectedTextStyle: {
        fontSize: 20,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: 'white',
        shadowColor: '#000',
        marginTop: 8,
        marginRight: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    textSelectedStyle: {
        marginRight: 5,
        fontSize: 16,
    },
});

export default UploadingVideo;