import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import MyVideos from "./index";
import Details from "./details";
import PlaylistView from "./playlistView";
import axios from "axios";
import { apiURL } from "../../config/config";

const MainVideos = (props) => {

    const [routeflag, setRouteflag] = useState("main");
    const [data, setData] = useState(null);
    const [playlistData, setPlaylistData] = useState(null);
    const [lastDetailName, setLastDetailName] = useState("");

    const goToHome = () => {
        props.navigation.navigate("Home");
    };

    const setflag = (flag) => {
        setRouteflag(flag);
    };

    const setChannelData = (details) => {
        setData(details);
    };

    const setPlaylistDetail = (playlistData) => {
        setPlaylistData(playlistData);
    };

    const setLastPageName = (pageName) => {
        setLastDetailName(pageName);
    };

    const toggle = () => {
        props.navigation.toggleDrawer()
    };

    useEffect(() => {
        if (localStorage.getItem("channelName")) {
            setRouteflag("detail");
            axios.post(apiURL + "/api/Upsocial/getAll/channels", {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': '*',
            }).then((res) => {
                let result = res.data.channelData.filter((item) => item.email == props.auth.user.curUser ? props.auth.user.curUser : localStorage.isUser);
                let resultChannel = result.filter(obj => obj["channelName"] == localStorage.getItem("channelName"));
                setData(resultChannel[0]);
            }).catch((err) => console.warn(err));
        }
    }, [localStorage.getItem("channelName")])

    return (
        <>
            {routeflag === "main" && <MyVideos goToHome={goToHome} setflag={setflag} setChannelData={setChannelData} setPlaylistDetail={setPlaylistDetail} toggle={toggle} lastDetailName={lastDetailName} />}
            {routeflag === "detail" && <Details goToHome={goToHome} setflag={setflag} data={data} setLastPageName={setLastPageName} />}
            {routeflag === "playlistView" && <PlaylistView goToHome={goToHome} setflag={setflag} playlistData={playlistData} setLastPageName={setLastPageName} />}
        </>
    );
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(MainVideos);