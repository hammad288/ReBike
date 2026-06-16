import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import UserMenu from './UserMenu';

const QuickCard = ({ icon, title, description, link, bg }) => (
    <div className="col-md-6 mb-4">
        <Link to={link} style={{ textDecoration: 'none' }}>
            <div
                className="card border-0 shadow-sm h-100"
                style={{
                    borderRadius: '16px',
                    background: bg,
                    color: 'white',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                }}
            >
                <div className="card-body d-flex align-items-center gap-3 p-4">
                    <div
                        style={{
                            fontSize: '2rem',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            width: '58px',
                            height: '58px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        {icon}
                    </div>
                    <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{title}</div>
                        <div style={{ fontSize: '0.82rem', opacity: 0.85, marginTop: '3px' }}>{description}</div>
                    </div>
                </div>
            </div>
        </Link>
    </div>
);

const UserDashboard = () => {
    const [auth] = useAuth();

    return (
        <div className="container my-5" style={{ paddingTop: '80px' }}>
            <div className="row">
                {/* Sidebar */}
                <div className="col-md-3 mb-4">
                    <UserMenu />
                </div>

                {/* Main Content */}
                <div className="col-md-9">
                    {/* Welcome Header */}
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
                            <p className="mb-0" style={{ opacity: 0.85, fontSize: '0.9rem' }}>
                                Manage your orders and profile from your personal dashboard.
                            </p>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div
                        className="card border-0 shadow-sm mb-4"
                        style={{ borderRadius: '16px' }}
                    >
                        <div className="card-body p-4">
                            <h6
                                className="fw-semibold text-uppercase mb-3"
                                style={{ color: 'blueviolet', fontSize: '0.78rem', letterSpacing: '0.08em' }}
                            >
                                👤 Account Information
                            </h6>
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <div
                                        style={{
                                            background: '#f8f5ff',
                                            borderRadius: '10px',
                                            padding: '14px 16px',
                                        }}
                                    >
                                        <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '4px' }}>Name</div>
                                        <div style={{ fontWeight: 600, color: '#222' }}>{auth?.user?.name || '—'}</div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div
                                        style={{
                                            background: '#f8f5ff',
                                            borderRadius: '10px',
                                            padding: '14px 16px',
                                        }}
                                    >
                                        <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '4px' }}>Email</div>
                                        <div style={{ fontWeight: 600, color: '#222' }}>{auth?.user?.email || '—'}</div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div
                                        style={{
                                            background: '#f8f5ff',
                                            borderRadius: '10px',
                                            padding: '14px 16px',
                                        }}
                                    >
                                        <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '4px' }}>Phone</div>
                                        <div style={{ fontWeight: 600, color: '#222' }}>{auth?.user?.phone || '—'}</div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div
                                        style={{
                                            background: '#f8f5ff',
                                            borderRadius: '10px',
                                            padding: '14px 16px',
                                        }}
                                    >
                                        <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '4px' }}>Role</div>
                                        <div style={{ fontWeight: 600, color: '#222', textTransform: 'capitalize' }}>{auth?.user?.role === 'admin' ? 'Admin' : auth?.user?.role === 'seller' ? 'Seller' : 'Customer'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <h6
                        className="fw-semibold text-uppercase mb-3"
                        style={{ color: '#777', fontSize: '0.78rem', letterSpacing: '0.08em' }}
                    >
                        🚀 Quick Actions
                    </h6>
                    <div className="row">
                        <QuickCard
                            icon="📦"
                            title="My Orders"
                            description="Track and review your bike inquiries"
                            link="/dashboard/user/order"
                            bg="linear-gradient(135deg, #6610f2, blueviolet)"
                        />
                        <QuickCard
                            icon="✏️"
                            title="Edit Profile"
                            description="Update your personal information"
                            link="/dashboard/user/profile"
                            bg="linear-gradient(135deg, #10b981, #059669)"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
