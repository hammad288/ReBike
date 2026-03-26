import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/auth";
import Spinner from '../admin/Spinner';

export default function SellerRoute() {
    const [ok, setOk] = useState(false);
    const [auth] = useAuth();

    useEffect(() => {
        const authCheck = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/auth/seller-auth`,
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
                console.log("Seller auth check failed:", error);
                setOk(false);
            }
        };
        if (auth?.token) authCheck();
    }, [auth?.token]);

    return ok ? <Outlet /> : <Spinner path="" />;
}

