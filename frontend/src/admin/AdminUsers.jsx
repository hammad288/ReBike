import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/auth';
import { adminAPI } from '../services/apiService';
import AdminMenu from './AdminMenu';

const roleBadge = (role) => {
    const styles = {
        admin: { bg: 'blueviolet', label: 'Admin' },
        seller: { bg: '#f59e0b', label: 'Seller' },
        user: { bg: '#3b82f6', label: 'User' },
    };
    const { bg, label } = styles[role] || { bg: '#64748b', label: role };
    return (
        <span
            className="badge"
            style={{ backgroundColor: bg, fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px' }}
        >
            {label}
        </span>
    );
};

const AdminUsers = () => {
    const [auth] = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const result = await adminAPI.getUsers(auth?.token);
        if (result.success) {
            setUsers(result.data.users || []);
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    const handleRoleChange = async (userId, newRole) => {
        setUpdatingId(userId);
        const result = await adminAPI.updateUserRole(userId, newRole, auth?.token);
        if (result.success) {
            toast.success(`Role updated to "${newRole}"`);
            setUsers(prev =>
                prev.map(u => (u._id === userId ? { ...u, role: newRole } : u))
            );
        } else {
            toast.error(result.message);
        }
        setUpdatingId(null);
    };

    const handleDelete = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete "${userName}"? This cannot be undone.`)) return;
        const result = await adminAPI.deleteUser(userId, auth?.token);
        if (result.success) {
            toast.success('User deleted successfully');
            setUsers(prev => prev.filter(u => u._id !== userId));
        } else {
            toast.error(result.message);
        }
    };

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const counts = {
        all: users.length,
        admin: users.filter(u => u.role === 'admin').length,
        seller: users.filter(u => u.role === 'seller').length,
        user: users.filter(u => u.role === 'user').length,
    };

    return (
        <div className="container my-5" style={{ paddingTop: '80px' }}>
            <div className="row">
                <div className="col-md-3">
                    <AdminMenu />
                </div>
                <div className="col-md-9">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                        {/* Header */}
                        <div
                            className="card-header d-flex align-items-center justify-content-between px-4 py-3"
                            style={{ background: 'linear-gradient(135deg, blueviolet, #9c27b0)', color: 'white' }}
                        >
                            <h5 className="mb-0 fw-bold">👥 Manage Users</h5>
                            <div className="d-flex gap-2">
                                <span className="badge bg-white text-dark">{counts.all} total</span>
                                <span className="badge" style={{ backgroundColor: '#f59e0b' }}>{counts.seller} sellers</span>
                                <span className="badge" style={{ backgroundColor: '#3b82f6' }}>{counts.user} users</span>
                            </div>
                        </div>

                        <div className="card-body p-4">
                            {/* Search */}
                            <div className="mb-4">
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">🔍</span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0 ps-0"
                                        placeholder="Search by name, email or role..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        style={{ outline: 'none', boxShadow: 'none' }}
                                    />
                                    {searchTerm && (
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => setSearchTerm('')}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Loading */}
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border" style={{ color: 'blueviolet' }} />
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="alert alert-info text-center">
                                    No users found{searchTerm && ' matching your search'}.
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead>
                                            <tr style={{ backgroundColor: '#f8f5ff' }}>
                                                <th className="border-0 py-3 ps-3">#</th>
                                                <th className="border-0 py-3">Name</th>
                                                <th className="border-0 py-3">Email</th>
                                                <th className="border-0 py-3">Role</th>
                                                <th className="border-0 py-3">Joined</th>
                                                <th className="border-0 py-3 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filtered.map((user, idx) => (
                                                <tr key={user._id} style={{ verticalAlign: 'middle' }}>
                                                    <td className="ps-3 text-muted">{idx + 1}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div
                                                                style={{
                                                                    width: 36,
                                                                    height: 36,
                                                                    borderRadius: '50%',
                                                                    background: 'linear-gradient(135deg, blueviolet, #9c27b0)',
                                                                    color: 'white',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    fontSize: '1rem',
                                                                    fontWeight: 700,
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="fw-semibold">{user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="text-muted small">{user.email}</td>
                                                    <td>{roleBadge(user.role)}</td>
                                                    <td className="text-muted small">
                                                        {new Date(user.createdAt).toLocaleDateString('en-IN', {
                                                            day: '2-digit', month: 'short', year: 'numeric',
                                                        })}
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="d-flex align-items-center justify-content-center gap-2">
                                                            {/* Role Selector */}
                                                            <select
                                                                className="form-select form-select-sm"
                                                                style={{ width: 'auto', fontSize: '0.75rem' }}
                                                                value={user.role}
                                                                disabled={updatingId === user._id || user._id === auth?.user?._id}
                                                                onChange={e => handleRoleChange(user._id, e.target.value)}
                                                            >
                                                                <option value="user">User</option>
                                                                <option value="seller">Seller</option>
                                                                <option value="admin">Admin</option>
                                                            </select>
                                                            {/* Delete */}
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                                                                disabled={updatingId === user._id || user._id === auth?.user?._id}
                                                                onClick={() => handleDelete(user._id, user.name)}
                                                                title={user._id === auth?.user?._id ? "Can't delete yourself" : "Delete user"}
                                                            >
                                                                🗑
                                                            </button>
                                                        </div>
                                                        {updatingId === user._id && (
                                                            <div className="mt-1">
                                                                <div className="spinner-border spinner-border-sm" style={{ color: 'blueviolet' }} />
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
