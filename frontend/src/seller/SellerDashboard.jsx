import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { sellerAPI } from '../services/apiService';
import '../styles/hero.css';

const SellerDashboard = () => {
    const [auth] = useAuth();
    const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });

    useEffect(() => {
        fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchStats = async () => {
        const result = await sellerAPI.getMyBikes(auth?.token);
        if (result.success) {
            const bikes = result.data.bikes || [];
            setStats({
                total: bikes.length,
                approved: bikes.filter(b => b.status === 'approved').length,
                pending:  bikes.filter(b => b.status === 'pending').length,
                rejected: bikes.filter(b => b.status === 'rejected').length,
            });
        }
    };

    const phoneIsMissing = !auth?.user?.phone;

    return (
        <div className="container my-5" style={{ paddingTop: '80px' }}>

            {/* ── Phone warning banner ── */}
            {phoneIsMissing && (
                <div className="alert alert-warning d-flex align-items-center gap-3 mb-4" role="alert">
                    <span style={{ fontSize: '1.5rem' }}>📱</span>
                    <div>
                        <strong>Your phone number is missing!</strong> Add it so you receive SMS when your bike is sold.{' '}
                        <Link to="/dashboard/seller/profile" className="alert-link">Update Profile →</Link>
                    </div>
                </div>
            )}

            <div className="row">
                <div className="col-12">
                    <h2 className="mb-1">Seller Dashboard</h2>
                    <p className="text-muted">
                        Welcome, {auth?.user?.name}!
                        {auth?.user?.phone && (
                            <span className="ms-2 badge bg-success">📱 {auth.user.phone}</span>
                        )}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row mt-4">
                {[
                    { label: 'Total Bikes',  value: stats.total,    color: 'primary' },
                    { label: 'Approved',     value: stats.approved, color: 'success' },
                    { label: 'Pending',      value: stats.pending,  color: 'warning' },
                    { label: 'Rejected',     value: stats.rejected, color: 'danger'  },
                ].map(({ label, value, color }) => (
                    <div key={label} className="col-md-3 mb-3">
                        <div className="card shadow-sm border-0">
                            <div className="card-body text-center">
                                <h5 className="text-muted">{label}</h5>
                                <h2 className={`text-${color}`}>{value}</h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="row mt-5">
                <div className="col-12">
                    <h4 className="mb-3">Quick Actions</h4>
                </div>

                {[
                    { to: '/dashboard/seller/add-bike', icon: 'bi-plus-circle', color: 'primary',  title: 'Add New Bike',     desc: 'List a new bike for sale' },
                    { to: '/dashboard/seller/my-bikes', icon: 'bi-bicycle',     color: 'success',  title: 'My Bikes',         desc: 'View and manage your listings' },
                    { to: '/bikes',                     icon: 'bi-shop',        color: 'warning',  title: 'Browse All Bikes', desc: 'View the public bike catalogue' },
                    { to: '/dashboard/seller/profile',  icon: 'bi-person-gear', color: phoneIsMissing ? 'danger' : 'secondary',
                        title: 'Update Profile', desc: phoneIsMissing ? '⚠️ Add phone number!' : 'Update your info & phone' },
                ].map(({ to, icon, color, title, desc }) => (
                    <div key={to} className="col-md-3 mb-3">
                        <Link to={to} className="text-decoration-none">
                            <div className={`card shadow-sm border-0 h-100${phoneIsMissing && title === 'Update Profile' ? ' border border-danger' : ''}`}>
                                <div className="card-body d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <h5 className="card-title">{title}</h5>
                                        <p className="card-text text-muted">{desc}</p>
                                    </div>
                                    <i className={`bi ${icon} fs-1 text-${color}`}></i>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SellerDashboard;

