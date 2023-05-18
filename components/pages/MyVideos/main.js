import React, { useEffect, useState } from "react";
import MyVideos from "./index";
import Details from "./details";


const MainVideos = (props) => {

    const [routeflag, setRouteflag] = useState("main");
    const [data, setData] = useState(null);

    const setflag = (flag) => {
        setRouteflag(flag);
    };

    const setChannelData = (details) => {
        setData(details);
    };

    const toggle = () => {
        props.navigation.toggleDrawer()
    }

    return (
        <>
            {routeflag === "main" && <MyVideos setflag={setflag} setChannelData={setChannelData} toggle={toggle} />}
            {routeflag === "detail" && <Details setflag={setflag} data={data} />}
        </>
    );
};

export default MainVideos;