import React, { useState } from "react";
import EditProfile from "./EditProfile";
import Profile from "./Profile";

const MainProfile = (props) => {

    const [routeflag, setRouteflag] = useState("Profile");

    const setflag = (flag) => {
        setRouteflag(flag);
    }

    const viewall = () => {
        props.navigation.navigate("YourVideos");
    }

    return (
        <>
            {routeflag === "Profile" && <Profile setflag={setflag} viewall={viewall} />}
            {routeflag === "EditProfile" && <EditProfile setflag={setflag} />}
        </>
    );
};

export default MainProfile;