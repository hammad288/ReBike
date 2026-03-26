import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
    { label: 'Dashboard', path: '/dashboard/user', icon: '🏠' },
    { label: 'My Orders', path: '/dashboard/user/order', icon: '📦' },
    { label: 'Profile', path: '/dashboard/user/profile', icon: '👤' },
];

const UserMenu = () => {
    const location = useLocation();

    return (
        <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: '16px', overflow: 'hidden' }}
        >
            {/* Sidebar Header */}
            <div
                style={{
                    background: 'linear-gradient(135deg, blueviolet 0%, #9c27b0 100%)',
                    padding: '20px 16px',
                    color: 'white',
                    textAlign: 'center',
                }}
            >
                <div
                    style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        margin: '0 auto 10px',
                    }}
                >
                    👤
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>User Panel</div>
            </div>

            {/* Nav Links */}
            <div style={{ padding: '8px 0' }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '11px 18px',
                                textDecoration: 'none',
                                fontWeight: isActive ? 600 : 400,
                                fontSize: '0.92rem',
                                color: isActive ? 'blueviolet' : '#444',
                                background: isActive ? 'rgba(138,43,226,0.08)' : 'transparent',
                                borderLeft: isActive ? '3px solid blueviolet' : '3px solid transparent',
                                transition: 'all 0.18s',
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'rgba(138,43,226,0.05)';
                                    e.currentTarget.style.color = 'blueviolet';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#444';
                                }
                            }}
                        >
                            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default UserMenu;
