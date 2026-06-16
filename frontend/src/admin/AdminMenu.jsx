import React from 'react';
import { NavLink } from 'react-router-dom';

const menuItems = [
    { to: '/dashboard/admin', label: 'Dashboard', icon: '📊', end: true },
    { to: '/dashboard/admin/manage-bikes', label: 'Manage Bikes', icon: '🛵' },
    { to: '/dashboard/admin/verifications', label: 'Verifications', icon: '📋' },
    { to: '/dashboard/admin/bikes', label: 'Bikes List', icon: '🏍️' },
    { to: '/dashboard/admin/create-bike', label: 'Create Bike', icon: '➕' },
    { to: '/dashboard/admin/allbrands', label: 'Brands List', icon: '🏷️' },
    { to: '/dashboard/admin/create-brands', label: 'Create Brand', icon: '✨' },
    { to: '/dashboard/admin/users', label: 'Manage Users', icon: '👥' },
];

const AdminMenu = () => {
    return (
        <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: '16px', overflow: 'hidden', position: 'sticky', top: '90px' }}
        >
            {/* Sidebar Header */}
            <div
                className="p-3 text-white text-center"
                style={{ background: 'linear-gradient(135deg, blueviolet, #9c27b0)' }}
            >
                <div style={{ fontSize: '1.8rem' }}>🛡️</div>
                <div className="fw-bold mt-1" style={{ fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                    ADMIN PANEL
                </div>
            </div>

            {/* Nav Links */}
            <div className="list-group list-group-flush">
                {menuItems.map(({ to, label, icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `list-group-item list-group-item-action d-flex align-items-center gap-2 py-3 px-3 border-0 ${
                                isActive ? 'active' : ''
                            }`
                        }
                        style={({ isActive }) => ({
                            backgroundColor: isActive ? 'blueviolet' : 'transparent',
                            color: isActive ? 'white' : '#333',
                            fontWeight: isActive ? '600' : '400',
                            fontSize: '0.9rem',
                            transition: 'all 0.15s ease',
                            borderLeft: isActive ? '4px solid rgba(255,255,255,0.5)' : '4px solid transparent',
                        })}
                        onMouseEnter={e => {
                            if (!e.currentTarget.classList.contains('active')) {
                                e.currentTarget.style.backgroundColor = 'rgba(138, 43, 226, 0.08)';
                                e.currentTarget.style.color = 'blueviolet';
                            }
                        }}
                        onMouseLeave={e => {
                            if (!e.currentTarget.classList.contains('active')) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#333';
                            }
                        }}
                    >
                        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                        {label}
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default AdminMenu;
