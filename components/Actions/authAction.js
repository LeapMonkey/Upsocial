import { CLEAR_ERRORS, GET_ERRORS, LOADING_DATA, SET_USERS } from "./constants";
import { apiURL } from "../config/config";
import axios from "axios";
import { ToastAndroid, Platform } from 'react-native';
import toast from 'react-hot-toast';

// Login user
export const loginUser = (userData) => (dispatch) => {
    dispatch(setLoadingdata(true));
    axios
        .post(apiURL + "/api/Upsocial/users/login", userData, {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        })
        .then((res) => {
            if (res.data.status) {

                if (Platform.OS === "android") {
                    ToastAndroid.show(res.data.msg, ToastAndroid.SHORT);
                }
                toast(res.data.msg);
                dispatch({
                    type: SET_USERS,
                    payload: res.data,
                });
                localStorage.setItem("isUser", res.data.curUser);
                localStorage.setItem("username", res.data.Data.username);
                dispatch(setLoadingdata(false));
            } else {
                if (Platform.OS === "android") {
                    ToastAndroid.show(res.data.msg, ToastAndroid.SHORT);
                }
                toast(res.data.msg);
                dispatch(setLoadingdata(false));
            }
        })
        .catch((err) => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data,
            });
            dispatch(setLoadingdata(false));
        });
};

// Register user
export const registerUser = (userData) => (dispatch) => {
    dispatch(setLoadingdata(true));
    axios
        .post(apiURL + "/api/Upsocial/users/register", userData, {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Headers': '*',
        })
        .then((res) => {
            dispatch({
                type: SET_USERS,
                payload: res.data,
            });
            dispatch(setLoadingdata(false));
        })
        .catch((err) => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data,
            });
            dispatch(setLoadingdata(false));
        });
};

// Logout user
export const logoutUser = () => (dispatch) => {
    dispatch({
        type: SET_USERS,
        payload: {},
    });
    dispatch({
        type: CLEAR_ERRORS,
        payload: {},
    });
};

export const setLoadingdata = (flag) => {
    return {
        type: LOADING_DATA,
        payload: flag,
    };
};
