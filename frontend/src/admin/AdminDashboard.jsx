import React, { useEffect, useState } from 'react';
import AdminMenu from './AdminMenu';
import { useAuth } from '../context/auth';
import { adminAPI } from '../services/apiService';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, bg, link }) => (
    <div className="col-md-4 col-sm-6 mb-4">
        <Link to={link || '#'} style={{ textDecoration: 'none' }}>
            <div
                className="card border-0 shadow-sm h-100"
                style={{
                    borderRadius: '16px',
                    background: bg,
                    color: 'white',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                }}
            >
                <div className="card-body d-flex align-items-center gap-3 p-4">
                    <div
                        style={{
                            fontSize: '2.2rem',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            width: '60px',
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        {icon}
                    </div>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>
                            {value ?? <span style={{ opacity: 0.5 }}>—</span>}
                        </div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '4px' }}>
                            {title}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    </div>
);

const AdminDashboard = () => {
    const [auth] = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        const result = await adminAPI.getStats(auth?.token);
        if (result.success) {
            setStats(result.data.stats);
        }
        setLoading(false);
    };

    return (
        <div className="container my-5" style={{ paddingTop: '80px' }}>
            <div className="row">
                <div className="col-md-3">
                    <AdminMenu />
                </div>
                <div className="col-md-9">
                    {/* Header */}
                    <div
                        className="d-flex align-items-center gap-3 mb-4 p-4 rounded-4 shadow-sm"
                        style={{
                            background: 'linear-gradient(135deg, blueviolet 0%, #9c27b0 100%)',
                            color: 'white',
                        }}
                    >
                        <div style={{ fontSize: '2.5rem' }}>👋</div>
                        <div>
                            <h4 className="mb-1 fw-bold">Welcome back, {auth?.user?.name}!</h4>
                            <p className="mb-0" style={{ opacity: 0.85 }}>
                                Here's an overview of your platform activity.
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" style={{ color: 'blueviolet' }} role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h6 className="text-muted fw-semibold mb-3 text-uppercase" style={{ letterSpacing: '0.08em' }}>
                                🛵 Bike Statistics
                            </h6>
                            <div className="row mb-2">
                                <StatCard
                                    title="Total Bikes"
                                    value={stats?.totalBikes}
                                    icon="🛵"
                                    bg="linear-gradient(135deg, #6610f2, blueviolet)"
                                    link="/dashboard/admin/manage-bikes"
                                />
                                <StatCard
                                    title="Pending Review"
                                    value={stats?.pendingBikes}
                                    icon="⏳"
                                    bg="linear-gradient(135deg, #f59e0b, #ef8c00)"
                                    link="/dashboard/admin/manage-bikes"
                                />
                                <StatCard
                                    title="Approved"
                                    value={stats?.approvedBikes}
                                    icon="✅"
                                    bg="linear-gradient(135deg, #10b981, #059669)"
                                    link="/dashboard/admin/manage-bikes"
                                />
                                <StatCard
                                    title="Rejected"
                                    value={stats?.rejectedBikes}
                                    icon="❌"
                                    bg="linear-gradient(135deg, #ef4444, #dc2626)"
                                    link="/dashboard/admin/manage-bikes"
                                />
                            </div>

                            <h6 className="text-muted fw-semibold mb-3 mt-2 text-uppercase" style={{ letterSpacing: '0.08em' }}>
                                👥 User Statistics
                            </h6>
                            <div className="row">
                                <StatCard
                                    title="Total Users"
                                    value={stats?.totalUsers}
                                    icon="👤"
                                    bg="linear-gradient(135deg, #3b82f6, #1d4ed8)"
                                    link="/dashboard/admin/users"
                                />
                                <StatCard
                                    title="Sellers"
                                    value={stats?.totalSellers}
                                    icon="🏍️"
                                    bg="linear-gradient(135deg, #8b5cf6, #6d28d9)"
                                    link="/dashboard/admin/users"
                                />
                                <StatCard
                                    title="Admins"
                                    value={stats?.totalAdmins}
                                    icon="🛡️"
                                    bg="linear-gradient(135deg, #64748b, #475569)"
                                    link="/dashboard/admin/users"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
