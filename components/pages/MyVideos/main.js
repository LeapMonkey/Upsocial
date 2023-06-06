import React, { useEffect, useState } from "react";
import MyVideos from "./index";
import Details from "./details";
import PlaylistView from "./playlistView";


const MainVideos = (props) => {

    const [routeflag, setRouteflag] = useState("main");
    const [data, setData] = useState(null);
    const [playlistData, setPlaylistData] = useState(null);
    const [lastDetailName, setLastDetailName] = useState("");

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

    return (
        <>
            {routeflag === "main" && <MyVideos setflag={setflag} setChannelData={setChannelData} setPlaylistDetail={setPlaylistDetail} toggle={toggle} lastDetailName={lastDetailName} />}
            {routeflag === "detail" && <Details setflag={setflag} data={data} setLastPageName={setLastPageName} />}
            {routeflag === "playlistView" && <PlaylistView setflag={setflag} playlistData={playlistData} setLastPageName={setLastPageName} />}
        </>
    );
};

export default MainVideos;