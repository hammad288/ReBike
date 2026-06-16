import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/auth';
import { verificationAPI } from '../services/apiService';
import AdminMenu from './AdminMenu';

/* ─── Status badge helper ─────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
    const map = {
        pending:  { label: 'Pending',  bg: '#f59e0b', color: '#fff' },
        verified: { label: 'Verified', bg: '#10b981', color: '#fff' },
        rejected: { label: 'Rejected', bg: '#ef4444', color: '#fff' },
    };
    const s = map[status] || { label: status, bg: '#6b7280', color: '#fff' };
    return (
        <span style={{
            background: s.bg, color: s.color,
            borderRadius: '20px', padding: '3px 12px',
            fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em',
        }}>
            {s.label}
        </span>
    );
};

/* ─── Detail Modal ────────────────────────────────────────────────────── */
const DetailModal = ({ verification: v, onClose, onVerify, onReject }) => {
    const [rejectMode, setRejectMode] = useState(false);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    if (!v) return null;

    const handleVerify = async () => {
        setLoading(true);
        await onVerify(v._id);
        setLoading(false);
    };

    const handleReject = async () => {
        if (!reason.trim()) { toast.error('Please provide a rejection reason.'); return; }
        setLoading(true);
        await onReject(v._id, reason);
        setLoading(false);
    };

    const DocImg = ({ src, label }) => src ? (
        <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
            </div>
            <img
                src={src}
                alt={label}
                style={{ width: '100%', borderRadius: '10px', border: '1px solid #e5e7eb', objectFit: 'cover', maxHeight: '200px' }}
            />
        </div>
    ) : (
        <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            <div style={{ background: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: '10px', padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '0.82rem' }}>Not uploaded</div>
        </div>
    );

    const InfoRow = ({ label, value }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.88rem' }}>
            <span style={{ color: '#6b7280', fontWeight: 500 }}>{label}</span>
            <span style={{ color: '#111827', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{value || '—'}</span>
        </div>
    );

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1050,
            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: '20px', overflowY: 'auto',
        }}>
            <div style={{
                background: '#fff', borderRadius: '20px',
                width: '100%', maxWidth: '780px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                overflow: 'hidden', marginTop: '20px', marginBottom: '20px',
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                    padding: '20px 28px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    <div>
                        <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.15rem' }}>
                            📋 Verification Detail
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', marginTop: '2px' }}>
                            {v.bike?.brand} {v.bike?.model} ({v.bike?.year}) — {v.seller?.name}
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'rgba(255,255,255,0.2)', border: 'none',
                        borderRadius: '50%', width: '36px', height: '36px',
                        color: '#fff', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 700,
                    }}>✕</button>
                </div>

                <div style={{ padding: '28px' }}>
                    <div className="row g-4">
                        {/* Left: Info */}
                        <div className="col-md-5">
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                                Owner & Vehicle Info
                            </div>
                            <InfoRow label="Owner Name" value={v.ownerName} />
                            <InfoRow label="RC Number" value={v.rcNumber} />
                            <InfoRow label="Reg. Number" value={v.vehicleRegNumber} />
                            <InfoRow label="Chassis No." value={v.chassisNumber} />
                            <InfoRow label="Engine No." value={v.engineNumber} />
                            <InfoRow label="Brand / Model" value={`${v.vehicleBrand} ${v.vehicleModel}`} />
                            <InfoRow label="Year of Reg." value={v.yearOfRegistration} />
                            <InfoRow label="Govt. ID Type" value={v.govtIdType} />
                            <InfoRow label="Govt. ID No." value={v.govtIdNumber} />

                            <div style={{ marginTop: '20px', fontSize: '0.75rem', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                                Submission Info
                            </div>
                            <InfoRow label="Seller" value={v.seller?.name} />
                            <InfoRow label="Seller Email" value={v.seller?.email} />
                            <InfoRow label="Seller Phone" value={v.seller?.phone || '—'} />
                            <InfoRow label="Status" value={<StatusBadge status={v.status} />} />
                            <InfoRow label="Submitted On" value={new Date(v.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} />
                            {v.rejectionReason && (
                                <div style={{ marginTop: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 12px', fontSize: '0.83rem', color: '#b91c1c' }}>
                                    <strong>Rejection Reason:</strong> {v.rejectionReason}
                                </div>
                            )}

                            {/* Action Buttons */}
                            {v.status === 'pending' && !rejectMode && (
                                <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                    <button
                                        onClick={handleVerify}
                                        disabled={loading}
                                        style={{
                                            background: '#10b981', border: 'none', borderRadius: '10px',
                                            padding: '11px', color: '#fff', fontWeight: 700,
                                            cursor: 'pointer', fontSize: '0.9rem',
                                        }}
                                    >
                                        {loading ? '...' : '✅ Approve Verification'}
                                    </button>
                                    <button
                                        onClick={() => setRejectMode(true)}
                                        style={{
                                            background: '#ef4444', border: 'none', borderRadius: '10px',
                                            padding: '11px', color: '#fff', fontWeight: 700,
                                            cursor: 'pointer', fontSize: '0.9rem',
                                        }}
                                    >
                                        ✕ Reject
                                    </button>
                                </div>
                            )}

                            {v.status === 'rejected' && !rejectMode && (
                                <div style={{ marginTop: '20px' }}>
                                    <button
                                        onClick={handleVerify}
                                        disabled={loading}
                                        style={{
                                            background: '#10b981', border: 'none', borderRadius: '10px',
                                            padding: '11px', color: '#fff', fontWeight: 700,
                                            cursor: 'pointer', width: '100%', fontSize: '0.9rem',
                                        }}
                                    >
                                        ✅ Approve Now
                                    </button>
                                </div>
                            )}

                            {/* Reject form */}
                            {rejectMode && (
                                <div style={{ marginTop: '20px' }}>
                                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '6px', display: 'block' }}>
                                        Rejection Reason *
                                    </label>
                                    <textarea
                                        value={reason}
                                        onChange={e => setReason(e.target.value)}
                                        rows={3}
                                        placeholder="State clearly why the documents are rejected..."
                                        style={{
                                            width: '100%', borderRadius: '10px', border: '1px solid #d1d5db',
                                            padding: '10px 12px', fontSize: '0.86rem', resize: 'vertical',
                                            outline: 'none',
                                        }}
                                    />
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                        <button onClick={() => setRejectMode(false)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontSize: '0.86rem' }}>
                                            Cancel
                                        </button>
                                        <button onClick={handleReject} disabled={loading} style={{ flex: 2, padding: '10px', borderRadius: '10px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.86rem' }}>
                                            {loading ? '...' : 'Confirm Reject'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Document images */}
                        <div className="col-md-7">
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                                Uploaded Documents
                            </div>
                            <div className="row g-3">
                                <div className="col-6"><DocImg src={v.rcFront} label="RC Front" /></div>
                                <div className="col-6"><DocImg src={v.rcBack} label="RC Back" /></div>
                                <div className="col-6"><DocImg src={v.insuranceCert} label="Insurance" /></div>
                                <div className="col-6"><DocImg src={v.pucCert} label="PUC (Optional)" /></div>
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '16px 0 12px' }}>
                                Bike Photos
                            </div>
                            <div className="row g-3">
                                <div className="col-6"><DocImg src={v.bikeFront} label="Front" /></div>
                                <div className="col-6"><DocImg src={v.bikeBack} label="Back" /></div>
                                <div className="col-6"><DocImg src={v.bikeLeft} label="Left" /></div>
                                <div className="col-6"><DocImg src={v.bikeRight} label="Right" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Main Component ──────────────────────────────────────────────────── */
const ManageVerifications = () => {
    const [auth] = useAuth();
    const [verifications, setVerifications] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        const result = await verificationAPI.adminGetAll(auth?.token);
        if (result.success) {
            setVerifications(result.data.verifications || []);
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    }, [auth?.token]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    useEffect(() => {
        let list = verifications;
        if (activeTab !== 'all') list = list.filter(v => v.status === activeTab);
        if (search) {
            const q = search.toLowerCase();
            list = list.filter(v =>
                v.ownerName?.toLowerCase().includes(q) ||
                v.seller?.name?.toLowerCase().includes(q) ||
                v.bike?.brand?.toLowerCase().includes(q) ||
                v.bike?.model?.toLowerCase().includes(q) ||
                v.rcNumber?.toLowerCase().includes(q) ||
                v.vehicleRegNumber?.toLowerCase().includes(q)
            );
        }
        setFiltered(list);
    }, [verifications, activeTab, search]);

    const openDetail = async (v) => {
        setDetailLoading(true);
        setSelected(null);
        const result = await verificationAPI.adminGetOne(v._id, auth?.token);
        if (result.success) {
            setSelected(result.data.verification);
        } else {
            toast.error(result.message);
        }
        setDetailLoading(false);
    };

    const handleVerify = async (id) => {
        const result = await verificationAPI.adminVerify(id, auth?.token);
        if (result.success) {
            toast.success('✅ Verification approved!');
            setSelected(null);
            fetchAll();
        } else {
            toast.error(result.message);
        }
    };

    const handleReject = async (id, reason) => {
        const result = await verificationAPI.adminReject(id, reason, auth?.token);
        if (result.success) {
            toast.success('Verification rejected.');
            setSelected(null);
            fetchAll();
        } else {
            toast.error(result.message);
        }
    };

    const counts = {
        all: verifications.length,
        pending: verifications.filter(v => v.status === 'pending').length,
        verified: verifications.filter(v => v.status === 'verified').length,
        rejected: verifications.filter(v => v.status === 'rejected').length,
    };

    const TABS = [
        { key: 'all',      label: `All (${counts.all})` },
        { key: 'pending',  label: `Pending (${counts.pending})` },
        { key: 'verified', label: `Verified (${counts.verified})` },
        { key: 'rejected', label: `Rejected (${counts.rejected})` },
    ];

    return (
        <div className="container my-5" style={{ paddingTop: '80px' }}>
            <div className="row">
                {/* Sidebar */}
                <div className="col-md-3">
                    <AdminMenu />
                </div>

                {/* Main */}
                <div className="col-md-9">
                    <div className="card shadow-sm border-0">
                        {/* Card header */}
                        <div className="card-header d-flex align-items-center justify-content-between" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', borderRadius: '8px 8px 0 0' }}>
                            <h4 className="mb-0">📋 Vehicle Verifications</h4>
                            {counts.pending > 0 && (
                                <span style={{ background: '#fbbf24', color: '#000', borderRadius: '20px', padding: '4px 14px', fontWeight: 700, fontSize: '0.82rem' }}>
                                    {counts.pending} Pending Review
                                </span>
                            )}
                        </div>

                        <div className="card-body">
                            {/* Search */}
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by owner name, seller, bike brand/model, RC number..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>

                            {/* Tabs */}
                            <ul className="nav nav-tabs mb-4">
                                {TABS.map(t => (
                                    <li key={t.key} className="nav-item">
                                        <button
                                            className={`nav-link ${activeTab === t.key ? 'active' : ''}`}
                                            onClick={() => setActiveTab(t.key)}
                                            style={activeTab === t.key ? { borderBottomColor: '#7c3aed', color: '#7c3aed', fontWeight: 700 } : {}}
                                        >
                                            {t.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {/* Loading */}
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border" style={{ color: '#7c3aed' }} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="alert alert-info">
                                    No verifications found{search && ' matching your search'}.
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead style={{ background: '#f9fafb' }}>
                                            <tr>
                                                <th style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bike</th>
                                                <th style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Owner / Seller</th>
                                                <th style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>RC Number</th>
                                                <th style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Submitted</th>
                                                <th style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                                <th style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filtered.map(v => (
                                                <tr key={v._id} style={{ cursor: 'pointer' }}>
                                                    <td>
                                                        <strong>{v.bike?.brand} {v.bike?.model}</strong>
                                                        <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{v.bike?.year}</div>
                                                    </td>
                                                    <td>
                                                        <div style={{ fontWeight: 600 }}>{v.ownerName}</div>
                                                        <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                                                            Seller: {v.seller?.name}
                                                        </div>
                                                    </td>
                                                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{v.rcNumber}</td>
                                                    <td style={{ fontSize: '0.82rem', color: '#6b7280', whiteSpace: 'nowrap' }}>
                                                        {new Date(v.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </td>
                                                    <td><StatusBadge status={v.status} /></td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm"
                                                            onClick={() => openDetail(v)}
                                                            disabled={detailLoading}
                                                            style={{
                                                                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                                                                color: '#fff', border: 'none', borderRadius: '8px',
                                                                fontWeight: 600, fontSize: '0.8rem',
                                                            }}
                                                        >
                                                            {detailLoading ? '...' : '🔍 Review'}
                                                        </button>
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

            {/* Detail Modal */}
            {selected && (
                <DetailModal
                    verification={selected}
                    onClose={() => setSelected(null)}
                    onVerify={handleVerify}
                    onReject={handleReject}
                />
            )}
        </div>
    );
};

export default ManageVerifications;
