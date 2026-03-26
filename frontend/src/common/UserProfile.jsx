import React, { useEffect, useState } from 'react'
import UserMenu from './UserMenu'
import { useAuth } from '../context/auth'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserProfile = () => {
    const [auth, setAuth] = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const { email, name, phone, address } = auth?.user || {};
        setName(name || "");
        setPhone(phone || "");
        setEmail(email || "");
        setAddress(address || "");
        window.scrollTo(0, 0);
    }, [auth?.user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/user/profileUpdate`,
                { name, email, password, phone, address },
                { headers: { Authorization: `Bearer ${auth?.token}` } }
            );
            if (data?.error) {
                toast.error(data.error);
            } else {
                setAuth({ ...auth, user: data?.updatedUser });
                let ls = localStorage.getItem("auth");
                ls = JSON.parse(ls);
                ls.user = data.updatedUser;
                localStorage.setItem("auth", JSON.stringify(ls));
                toast.success("Profile Updated Successfully ✅");
                setPassword("");
                navigate('/dashboard/user');
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.error || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container marginStyle'>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-md-3'>
                        <UserMenu />
                    </div>
                    <div className='col-md-9 my-3'>
                        <h3 className='text-center'>Update Profile</h3>
                        <div className="card text-black mb-5">
                            <div className="card-body p-md-5">
                                <div className="row justify-content-center">
                                    <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <div className="form-outline flex-fill mb-0">
                                                <label className="form-label" htmlFor="profileName">Name</label>
                                                <input
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    type="text"
                                                    id="profileName"
                                                    className="form-control"
                                                    placeholder="Enter your name"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <div className="form-outline flex-fill mb-0">
                                                <label className="form-label" htmlFor="profileEmail">Email</label>
                                                <input
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    type="email"
                                                    id="profileEmail"
                                                    className="form-control"
                                                    placeholder="Enter your email"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <div className="form-outline flex-fill mb-0">
                                                <label className="form-label" htmlFor="profilePassword">
                                                    Password <small className="text-muted">(leave blank to keep current)</small>
                                                </label>
                                                <input
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    type="password"
                                                    id="profilePassword"
                                                    className="form-control"
                                                    placeholder="New password (optional)"
                                                />
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <div className="form-outline flex-fill mb-0">
                                                <label className="form-label" htmlFor="profilePhone">Phone</label>
                                                <input
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    type="tel"
                                                    id="profilePhone"
                                                    className="form-control"
                                                    placeholder="Enter your phone number"
                                                />
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <div className="form-outline flex-fill mb-0">
                                                <label className="form-label" htmlFor="profileAddress">Address</label>
                                                <textarea
                                                    rows={4}
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    id="profileAddress"
                                                    className="form-control"
                                                    placeholder="Enter your address"
                                                />
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-center mx-4">
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-lg"
                                                disabled={loading}
                                            >
                                                {loading ? "Updating..." : "Update"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
