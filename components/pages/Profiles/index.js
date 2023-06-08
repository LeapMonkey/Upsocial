import React, { useState } from "react";
import EditProfile from "./EditProfile";
import Profile from "./Profile";

const MainProfile = (props) => {

    const [routeflag, setRouteflag] = useState("Profile");

    const setflag = (flag) => {
        setRouteflag(flag);
    };

    const setToggle = () => {
        props.navigation.toggleDrawer();
    };

    const viewall = () => {
        props.navigation.navigate("RecentsUpload");
    };

    const goToHome = () => {
        props.navigation.navigate("Home");
    };

    return (
        <>
            {routeflag === "Profile" && <Profile goToHome={goToHome} setflag={setflag} setToggle={setToggle} viewall={viewall} />}
            {routeflag === "EditProfile" && <EditProfile goToHome={goToHome} setToggle={setToggle} setflag={setflag} />}
        </>
    );
};

export default MainProfile;