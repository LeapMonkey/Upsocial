import React, { useState } from 'react';
import { View } from 'react-native';
import Onboarding from './Onboarding';
import SignUp from '../Auth/SignUp';

const Dashboard = () => {
    const [routeflag, setRouteflag] = useState("onboarding");

    const setflag = (flag) => {
        setRouteflag(flag);
    }

    return (
        <>
            {routeflag === "onboarding" && <Onboarding setflag={setflag} />}
            {routeflag === "SignUp" && <SignUp setflag={setflag} />}
        </>
    );
};

export default Dashboard;