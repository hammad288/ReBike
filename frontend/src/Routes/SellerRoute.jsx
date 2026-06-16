import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/auth";
import Spinner from '../admin/Spinner';

export default function SellerRoute() {
    const [ok, setOk] = useState(false);
    const [checking, setChecking] = useState(true);
    const [auth] = useAuth();

    useEffect(() => {
        const authCheck = async () => {
            setChecking(true);
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/auth/seller-auth`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth?.token}`,
                        },
                    }
                );
                setOk(res.data.ok === true);
            } catch (error) {
                console.log("Seller auth check failed:", error);
                setOk(false);
            } finally {
                setChecking(false);
            }
        };
        if (auth?.token) {
            authCheck();
        } else {
            setChecking(false);
        }
    }, [auth?.token]);

    // Still loading — show a plain spinner, NOT the redirect countdown
    if (checking) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Checking access...</span>
                </div>
            </div>
        );
    }

    return ok ? <Outlet /> : <Spinner path="login" />;
}
