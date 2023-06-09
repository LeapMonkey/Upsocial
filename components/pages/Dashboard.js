import React, { useState } from 'react';
import Onboarding from './Onboarding';
import SignUp from '../Auth/SignUp';
import Anonymous from '../Auth/Anonymous';

const Dashboard = () => {
    const [routeflag, setRouteflag] = useState("onboarding");

    const setflag = (flag) => {
        setRouteflag(flag);
    }

    return (
        <>
            {routeflag === "onboarding" && <Onboarding setflag={setflag} />}
            {routeflag === "SignUp" && <SignUp setflag={setflag} />}
            {routeflag === "Anonymous" && <Anonymous setflag={setflag} />}
        </>
    );
};

export default Dashboard;