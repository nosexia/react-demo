import React, { FC, useEffect } from 'react';

import { Outlet, useLocation, useNavigate } from "react-router-dom";

const DataPage: FC = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (location.pathname === "/data") {
            navigate("/data/list", {replace:true});
        }
    }, [navigate, location]);

    return <Outlet/>
}

export default DataPage;