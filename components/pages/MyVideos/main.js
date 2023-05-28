import React, { useEffect, useState } from "react";
import MyVideos from "./index";
import Details from "./details";
import PlaylistView from "./playlistView";


const MainVideos = (props) => {

    const [routeflag, setRouteflag] = useState("main");
    const [data, setData] = useState(null);
    const [playlistData, setPlaylistData] = useState(null);

    const setflag = (flag) => {
        setRouteflag(flag);
    };

    const setChannelData = (details) => {
        setData(details);
    };

    const setPlaylistDetail = (playlistData) => {
        setPlaylistData(playlistData);
    };

    const toggle = () => {
        props.navigation.toggleDrawer()
    };

    return (
        <>
            {routeflag === "main" && <MyVideos setflag={setflag} setChannelData={setChannelData} setPlaylistDetail={setPlaylistDetail} toggle={toggle} />}
            {routeflag === "detail" && <Details setflag={setflag} data={data} />}
            {routeflag === "playlistView" && <PlaylistView setflag={setflag} playlistData={playlistData} />}
        </>
    );
};

export default MainVideos;