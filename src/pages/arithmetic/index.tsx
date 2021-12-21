import React, { FC, useEffect } from 'react';

import { Outlet, useLocation, useNavigate } from "react-router-dom";

const DataPage: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (location.pathname === "/arithmetic") {
            navigate("/arithmetic/list", {replace:true});
        }
    }, [navigate, location]);

    return <Outlet />
}

export default DataPage;