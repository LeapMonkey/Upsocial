import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Image, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useMediaQuery } from "react-responsive";
import { apiURL } from '../../config/config';
import axios from 'axios';

const CategoryScreen = () => {
    const [categoryName, setCategoryName] = useState("animation");
    const [result, setResult] = useState([]);
    const [limit, setLimit] = useState(10);

    // mobile and desktop variable for responsive
    const isMobile = useMediaQuery({
        query: "(max-device-width: 500px)"
    });

    const isTabletOrMobile = useMediaQuery({
        query: "(min-device-width: 500px)"
    });

    const isTablet = useMediaQuery({
        query: "(min-device-width: 768px)"
    });

    const isDesktop = useMediaQuery({
        query: "(min-device-width: 1024px)"
    });

    const isWide = useMediaQuery({
        query: "(min-device-width: 1441px)"
    });
    // end

    const changeCategoryItem = (itemname) => {
        setCategoryName(itemname);

        axios.post(apiURL + "/api/Upsocial/users/get/UploadedContent/Category", { categoryName: itemname }, {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            res.data.data.sort((a, b) => {
                return new Date(b.postDate) - new Date(a.postDate);
            });
            setResult(res.data.data);
        }).catch((err) => {
            console.warn(err);
        })

    }


    useEffect(() => {
        axios.post(apiURL + "/api/Upsocial/users/getAll/UploadedContent", { limit: limit }, {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            res.data.data.sort((a, b) => {
                return new Date(b.postDate) - new Date(a.postDate);
            });
            setResult(res.data.data);
        }).catch((err) => {
            console.warn(err);
        });
    }, [limit]);

    return (
        <View style={styles.main}>
            <View style={styles.categoryview}>
                <TouchableOpacity style={categoryName === "Animation" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("Animation")}>
                    <Text style={categoryName === "Animation" ? styles.active_categorytext : styles.categorytext}>Animation</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "Autos & Vehicles" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("Autos & Vehicles")}>
                    <Text style={categoryName === "Autos & Vehicles" ? styles.active_categorytext : styles.categorytext}>Autos & Vehicles</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "Beauty & Fashion" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("Beauty & Fashion")}>
                    <Text style={categoryName === "Beauty & Fashion" ? styles.active_categorytext : styles.categorytext}>Beauty & Fashion</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "Cooking & Food" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("Cooking & Food")}>
                    <Text style={categoryName === "Cooking & Food" ? styles.active_categorytext : styles.categorytext}>Cooking & Food</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "DIY & Crafts" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("DIY & Crafts")}>
                    <Text style={categoryName === "DIY & Crafts" ? styles.active_categorytext : styles.categorytext}>DIY & Crafts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "Documentary" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("Documentary")}>
                    <Text style={categoryName === "Documentary" ? styles.active_categorytext : styles.categorytext}>Documentary</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "Education" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("Education")}>
                    <Text style={categoryName === "Education" ? styles.active_categorytext : styles.categorytext}>Education</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "Entertainment" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("Entertainment")}>
                    <Text style={categoryName === "Entertainment" ? styles.active_categorytext : styles.categorytext}>Entertainment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "Film & Animation" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("Film & Animation")}>
                    <Text style={categoryName === "Film & Animation" ? styles.active_categorytext : styles.categorytext}>Film & Animation</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "Gaming" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("Gaming")}>
                    <Text style={categoryName === "Gaming" ? styles.active_categorytext : styles.categorytext}>Gaming</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "Health & Fitness" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("Health & Fitness")}>
                    <Text style={categoryName === "Health & Fitness" ? styles.active_categorytext : styles.categorytext}>Health & Fitness</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "How-to & Style" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("How-to & Style")}>
                    <Text style={categoryName === "How-to & Style" ? styles.active_categorytext : styles.categorytext}>How-to & Style</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "Kids & Family" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("Kids & Family")}>
                    <Text style={categoryName === "Kids & Family" ? styles.active_categorytext : styles.categorytext}>Kids & Family</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "Music" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("Music")}>
                    <Text style={categoryName === "Music" ? styles.active_categorytext : styles.categorytext}>Music</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "News & Politics" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("News & Politics")}>
                    <Text style={categoryName === "News & Politics" ? styles.active_categorytext : styles.categorytext}>News & Politics</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "Nonprofits & Activism" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("Nonprofits & Activism")}>
                    <Text style={categoryName === "Nonprofits & Activism" ? styles.active_categorytext : styles.categorytext}>Nonprofits & Activism</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "People & Blogs" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("People & Blogs")}>
                    <Text style={categoryName === "People & Blogs" ? styles.active_categorytext : styles.categorytext}>People & Blogs</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "Pets & Animals" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("Pets & Animals")}>
                    <Text style={categoryName === "Pets & Animals" ? styles.active_categorytext : styles.categorytext}>Pets & Animals</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "Science & Technology" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("Science & Technology")}>
                    <Text style={categoryName === "Science & Technology" ? styles.active_categorytext : styles.categorytext}>Science & Technology</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "Sports" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("Sports")}>
                    <Text style={categoryName === "Sports" ? styles.active_categorytext : styles.categorytext}>Sports</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "Travel & Events" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("Travel & Events")}>
                    <Text style={categoryName === "Travel & Events" ? styles.active_categorytext : styles.categorytext}>Travel & Events</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "Unboxing & Reviews" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("Unboxing & Reviews")}>
                    <Text style={categoryName === "Unboxing & Reviews" ? styles.active_categorytext : styles.categorytext}>Unboxing & Reviews</Text>
                </TouchableOpacity>
                <TouchableOpacity style={categoryName === "Blogs" ? styles.active_categoryitem : styles.categoryitem} onPress={() => changeCategoryItem("Blogs")}>
                    <Text style={categoryName === "Blogs" ? styles.active_categorytext : styles.categorytext}>Blogs</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollview}>
                <View style={styles.contentview}>
                    {result && result.map((index, key) => {
                        return (
                            <TouchableOpacity style={isWide ? styles.wideitemview : isDesktop ? styles.desktopitemview : isTablet ? styles.tabletitemview : isTabletOrMobile ? styles.tabletormobileitemview : styles.mobileitemview} key={key} onPress={() => watchVideo(index, key)}>
                                <View style={{ alignItems: 'center', width: "100%" }}>
                                    <Image source={{ uri: index.thumbnail }} style={{ width: "100%", height: Dimensions.get("window").height * 0.3, borderRadius: 12 }} />
                                    <Image source={require("../../../assets/logos/playvideo.png")} style={{ width: 50, height: 50, position: "absolute", top: "40%" }} />
                                </View>
                                <Text>{index.title}</Text>
                                <Text>{index.description}</Text>
                            </TouchableOpacity>
                        )
                    })}
                    {result.length == 0 && <Text style={{ justifyContent: "center", alignItems: "center", width: "100%" }}>Null</Text>}
                </View>
            </ScrollView >
        </View >
    );
};

const styles = StyleSheet.create({
    main: {
        width: "100%",
    },
    scrollview: {
        flex: 1,
        backgroundColor: "#fff"
    },
    categoryview: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        overflow: "auto",
    },
    categoryitem: {
        paddingVertical: 20,
        marginHorizontal: 10,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "transparent",
    },
    active_categoryitem: {
        paddingVertical: 20,
        marginHorizontal: 10,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "transparent",
        borderBottomColor: "rgb(156, 38, 176)",
    },
    categorytext: {
        fontSize: 14,
        color: "rgb(197, 197, 197)",
    },
    active_categorytext: {
        color: "rgb(156, 38, 176)",
        fontSize: 14
    },
    contentview: {
        marginHorizontal: 20,
        marginVertical: 30,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    wideitemview: {
        alignItems: "center",
        width: "20%",
        padding: 10
    },
    mobileitemview: {
        alignItems: "center",
        width: "50%",
        padding: 10,
    },
    tabletitemview: {
        alignItems: "center",
        width: "33%",
        padding: 10
    },
    desktopitemview: {
        alignItems: "center",
        width: "25%",
        padding: 10
    },
    tabletormobileitemview: {
        alignItems: 'center',
        width: "50%",
        padding: 10
    },
});

export default CategoryScreen;