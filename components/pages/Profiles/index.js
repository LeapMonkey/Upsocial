import React, { useState } from "react";
import EditProfile from "./EditProfile";
import Profile from "./Profile";

const MainProfile = (props) => {

    const [routeflag, setRouteflag] = useState("Profile");

    const setflag = (flag) => {
        setRouteflag(flag);
    }

    const setToggle = () => {
        props.navigation.toggleDrawer();
    }

    const viewall = () => {
        props.navigation.navigate("RecentsUpload");
    }

    return (
        <>
            {routeflag === "Profile" && <Profile setflag={setflag} setToggle={setToggle} viewall={viewall} />}
            {routeflag === "EditProfile" && <EditProfile setToggle={setToggle} setflag={setflag} />}
        </>
    );
};

export default MainProfile;