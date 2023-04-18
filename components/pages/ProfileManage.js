import React, { useState } from 'react';
import Profile from './Profile';
import Upload from './Upload';
import Watch from './Watch';
import Explore from './Explore';

const ProfileManage = (props) => {
    const [routeName, setRouteName] = useState("explore");

    const setName = (name) => {
        setRouteName(name);
    }

    return (
        <>
            {routeName === "explore" && <Explore setName={setName} setvideoflag={props.setvideoflag} />}
            {routeName === "home" && <Watch setName={setName} />}
            {routeName === "profile" && <Profile setName={setName} />}
            {routeName === "upload" && <Upload setName={setName} />}
        </>
    );
};

export default ProfileManage;