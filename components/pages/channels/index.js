import React, { useEffect, useState } from "react";
import ViewChannel from "./ViewChannel";
import MyChannel from "./mychannel";

const MainChannel = (props) => {

    const [routeflag, setRouteflag] = useState("MyChannel");
    const [channelDetail, SetChannelDetail] = useState(null);

    const setflag = (flag) => {
        setRouteflag(flag);
    };
    const setChannelData = (data) => {
        SetChannelDetail(data)
    };

    return (
        <>
            {routeflag === "MyChannel" && <MyChannel setflag={setflag} setChannelData={setChannelData} />}
            {routeflag === "ViewChannel" && <ViewChannel setflag={setflag} channelDetail={channelDetail} />}
        </>
    );
};

export default MainChannel;