import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { sellerAPI } from '../services/apiService';
import '../styles/hero.css';

const SellerDashboard = () => {
    const [auth] = useAuth();
    const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        const result = await sellerAPI.getMyBikes(auth?.token);
        if (result.success) {
            const bikes = result.data.bikes || [];
            setStats({
                total: bikes.length,
                approved: bikes.filter(b => b.status === 'approved').length,
                pending: bikes.filter(b => b.status === 'pending').length,
                rejected: bikes.filter(b => b.status === 'rejected').length,
            });
        }
        setLoading(false);
    };

    return (
        <div className="container my-5" style={{ paddingTop: '80px' }}>
            <div className="row">
                <div className="col-12">
                    <h2 className="mb-4">Seller Dashboard</h2>
                    <p className="text-muted">Welcome, {auth?.user?.name}!</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row mt-4">
                <div className="col-md-3 mb-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center">
                            <h5 className="text-muted">Total Bikes</h5>
                            <h2 className="text-primary">{stats.total}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center">
                            <h5 className="text-muted">Approved</h5>
                            <h2 className="text-success">{stats.approved}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center">
                            <h5 className="text-muted">Pending</h5>
                            <h2 className="text-warning">{stats.pending}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center">
                            <h5 className="text-muted">Rejected</h5>
                            <h2 className="text-danger">{stats.rejected}</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="row mt-5">
                <div className="col-12">
                    <h4 className="mb-3">Quick Actions</h4>
                </div>
                <div className="col-md-6 mb-3">
                    <Link to="/dashboard/seller/add-bike" className="text-decoration-none">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-body d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <h5 className="card-title">Add New Bike</h5>
                                    <p className="card-text text-muted">List a new bike for sale</p>
                                </div>
                                <i className="bi bi-plus-circle fs-1 text-primary"></i>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col-md-6 mb-3">
                    <Link to="/dashboard/seller/my-bikes" className="text-decoration-none">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-body d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <h5 className="card-title">My Bikes</h5>
                                    <p className="card-text text-muted">View and manage your listings</p>
                                </div>
                                <i className="bi bi-bicycle fs-1 text-success"></i>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;
