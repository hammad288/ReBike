import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/auth";
import Sipnner from '../admin/Spinner'

export default function PrivateRoute() {
    const [ok, setOk] = useState(false);
    const [auth] = useAuth();

    useEffect(() => {
        const authCheck = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/auth/user-auth`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth?.token}`,
                        },
                    }
                );
                if (res.data.ok) {
                    setOk(true);
                } else {
                    setOk(false);
                }
            } catch (error) {
                console.log("User auth check failed:", error);
                setOk(false);
            }
        };
        if (auth?.token) authCheck();
    }, [auth?.token]);

    return ok ? <Outlet /> : <Sipnner />;
}