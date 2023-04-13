import React, { useState } from 'react';
import Profile from './Profile';
import Upload from './Upload';
import Home from './Home';

const ProfileManage = () => {
    const [routeName, setRouteName] = useState("home");

    const setName = (name) => {
        setRouteName(name);
    }

    return (
        <>
            {routeName === "home" && <Home setName={setName} />}
            {routeName === "profile" && <Profile setName={setName} />}
            {routeName === "upload" && <Upload setName={setName} />}
        </>
    );
};

export default ProfileManage;