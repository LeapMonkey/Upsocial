import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { apiURL } from "../../config/config";


const Users = (props) => {

    const [users, setUsers] = useState([]);
    const [followingFlag, setFollowingFlag] = useState(false);

    useEffect(() => {
        axios.get(apiURL + "/api/Upsocial/admin/getAllUsers", {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            setUsers(res.data.userData);
            setFollowingFlag(false);
        }).catch((err) => {
            console.warn(err);
        });
    }, [followingFlag]);

    const unfollow = (tarUser) => {
        console.log(tarUser, props.auth.user.curUser);
        axios.post(apiURL + "/api/Upsocial/users/unfollow", {
            curUser: props.auth.user.curUser,
            tarUser: tarUser
        }, {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            console.log(res.data);
            if (res.data.status) {
                alert(res.data.msg);
                setFollowingFlag(true);
            } else {
                alert(res.data.msg);
                setFollowingFlag(true);
            }
        }).catch((err) => {
            console.warn(err);
        });
    };

    const follow = (tarUser) => {
        console.log(tarUser, props.auth.user.curUser);
        axios.post(apiURL + "/api/Upsocial/users/follow", {
            curUser: props.auth.user.curUser,
            tarUser: tarUser
        }, {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            console.log(res.data);
            if (res.data.status) {
                alert(res.data.msg);
                setFollowingFlag(true);
            } else {
                alert(res.data.msg);
                setFollowingFlag(true);
            }
        }).catch((err) => {
            console.warn(err);
        });
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.header}>Current Users</Text>
            </View>
            {users && users.map((index, key) => {
                return (
                    <View style={styles.userGroup} key={key}>
                        <View style={styles.active_categoryitem}>
                            <Image source={require("../../../assets/default.png")} style={{ width: 40, height: 40, borderRadius: 12 }} />
                            <Text style={styles.active_categorytext}>{index.username}</Text>
                        </View>
                        <View style={styles.actionBtn}>
                            {index.followers.includes(props.auth.user.curUser) ? (
                                <TouchableOpacity style={styles.section} onPress={() => unfollow(index.email)}>
                                    <Text style={styles.paragraph}>UnFollow</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.section} onPress={() => follow(index.email)}>
                                    <Text style={styles.paragraph}>Follow</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        color: "#3f29b2",
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 2
    },
    userGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    actionBtn: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "30%"
    },
    active_categoryitem: {
        paddingVertical: 20,
        marginHorizontal: 10,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        width: "30%"
    },
    active_categorytext: {
        color: "rgb(156, 38, 176)",
        fontSize: 14
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        backgroundColor: "#5E1DA6",
        color: "#fff",
        borderRadius: 2,
        borderRadius: 5,
    },
    paragraph: {
        color: "#fff",
    },
});

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(Users);