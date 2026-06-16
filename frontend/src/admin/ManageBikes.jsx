import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/auth';
import { adminAPI } from '../services/apiService';
import RejectModal from './RejectModal';
import AdminMenu from './AdminMenu';

const ManageBikes = () => {
    const [auth] = useAuth();
    const [bikes, setBikes] = useState([]);
    const [filteredBikes, setFilteredBikes] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedBike, setSelectedBike] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmModal, setConfirmModal] = useState({ show: false, type: '', bike: null });

    useEffect(() => {
        fetchBikes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        filterBikes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, bikes, searchTerm]);

    const fetchBikes = async () => {
        setLoading(true);
        const result = await adminAPI.getAllBikes(auth?.token);
        
        if (result.success) {
            setBikes(result.data.bikes || []);
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    const filterBikes = () => {
        let filtered = bikes;

        // Filter by status tab
        if (activeTab !== 'all') {
            filtered = filtered.filter(bike => bike.status === activeTab);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(bike => 
                bike.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bike.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bike.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredBikes(filtered);
    };

    const handleApprove = async (bikeId) => {
        const result = await adminAPI.approveBike(bikeId, auth?.token);
        if (result.success) {
            toast.success('Bike approved successfully');
            fetchBikes();
        } else {
            toast.error(result.message);
        }
        setConfirmModal({ show: false, type: '', bike: null });
    };

    const handleReject = async (bikeId, reason) => {
        const result = await adminAPI.rejectBike(bikeId, reason, auth?.token);
        
        if (result.success) {
            toast.success('Bike rejected');
            setShowRejectModal(false);
            setSelectedBike(null);
            fetchBikes();
        } else {
            toast.error(result.message);
        }
    };

    const handleDelete = async (bikeId) => {
        const result = await adminAPI.deleteBike(bikeId, auth?.token);
        if (result.success) {
            toast.success('Bike deleted successfully');
            fetchBikes();
        } else {
            toast.error(result.message);
        }
        setConfirmModal({ show: false, type: '', bike: null });
    };

    const openRejectModal = (bike) => {
        setSelectedBike(bike);
        setShowRejectModal(true);
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: <span className="badge bg-warning text-dark">Pending</span>,
            approved: <span className="badge bg-success">Approved</span>,
            rejected: <span className="badge bg-danger">Rejected</span>,
        };
        return badges[status] || <span className="badge bg-secondary">Unknown</span>;
    };

    const getTabCounts = () => {
        return {
            all: bikes.length,
            pending: bikes.filter(b => b.status === 'pending').length,
            approved: bikes.filter(b => b.status === 'approved').length,
            rejected: bikes.filter(b => b.status === 'rejected').length,
        };
    };

    const counts = getTabCounts();

    return (
        <div className="container my-5" style={{ paddingTop: '80px' }}>
            <div className="row">
                <div className="col-md-3">
                    <AdminMenu />
                </div>
                <div className="col-md-9">
                    <div className="card shadow-sm border-0">
                        <div className="card-header" style={{ backgroundColor: 'blueviolet', color: 'white' }}>
                            <h4 className="mb-0">Manage Bike Listings</h4>
                        </div>
                        <div className="card-body">
                            {/* Search Bar */}
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by brand, model, or seller name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Tabs */}
                            <ul className="nav nav-tabs mb-4">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('all')}
                                    >
                                        All ({counts.all})
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('pending')}
                                    >
                                        Pending ({counts.pending})
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'approved' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('approved')}
                                    >
                                        Approved ({counts.approved})
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'rejected' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('rejected')}
                                    >
                                        Rejected ({counts.rejected})
                                    </button>
                                </li>
                            </ul>

                            {/* Loading State */}
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* No Bikes Message */}
                                    {filteredBikes.length === 0 ? (
                                        <div className="alert alert-info">
                                            No bikes found{searchTerm && ' matching your search'}.
                                        </div>
                                    ) : (
                                        /* Bikes Table */
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Brand/Model</th>
                                                        <th>Year</th>
                                                        <th>Price</th>
                                                        <th>Seller</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredBikes.map((bike) => (
                                                        <tr key={bike._id}>
                                                            <td>
                                                                <strong>{bike.brand}</strong> {bike.model}
                                                                {bike.rejectionReason && (
                                                                    <div className="text-danger small">
                                                                        <em>Reason: {bike.rejectionReason}</em>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td>{bike.year}</td>
                                                            <td>₹{bike.price?.toLocaleString()}</td>
                                                            <td>
                                                                {bike.seller?.name || 'N/A'}
                                                                <div className="text-muted small">
                                                                    {bike.seller?.email}
                                                                </div>
                                                            </td>
                                                            <td>{getStatusBadge(bike.status)}</td>
                                                            <td>
                                                                <div className="btn-group btn-group-sm" role="group">
                                                                    {bike.status === 'pending' && (
                                                                        <>
                                                                            <button
                                                                                className="btn btn-success"
                                                                                onClick={() => setConfirmModal({ show: true, type: 'approve', bike })}
                                                                                title="Approve"
                                                                            >
                                                                                ✓
                                                                            </button>
                                                                            <button
                                                                                className="btn btn-warning"
                                                                                onClick={() => openRejectModal(bike)}
                                                                                title="Reject"
                                                                            >
                                                                                ✗
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                    {bike.status === 'rejected' && (
                                                                        <button
                                                                            className="btn btn-success"
                                                                            onClick={() => setConfirmModal({ show: true, type: 'approve', bike })}
                                                                            title="Approve"
                                                                        >
                                                                            ✓ Approve
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        className="btn btn-danger"
                                                                        onClick={() => setConfirmModal({ show: true, type: 'delete', bike })}
                                                                        title="Delete"
                                                                    >
                                                                        🗑
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && selectedBike && (
                <RejectModal
                    bike={selectedBike}
                    onReject={handleReject}
                    onClose={() => {
                        setShowRejectModal(false);
                        setSelectedBike(null);
                    }}
                />
            )}

            {/* Custom Confirm Modal */}
            {confirmModal.show && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', inset: 0, zIndex: 1050, display: 'flex !important', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ zIndex: 1051 }}>
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                            <div className="modal-header border-0 pb-0" style={{ background: confirmModal.type === 'delete' ? '#fff1f1' : '#f1fff4' }}>
                                <h5 className="modal-title fw-bold" style={{ color: confirmModal.type === 'delete' ? '#dc3545' : '#198754' }}>
                                    {confirmModal.type === 'delete' ? '🗑️ Confirm Delete' : '✅ Confirm Approve'}
                                </h5>
                            </div>
                            <div className="modal-body py-3">
                                <p className="mb-1">
                                    {confirmModal.type === 'delete'
                                        ? 'Are you sure you want to permanently delete'
                                        : 'Are you sure you want to approve'}
                                </p>
                                <p className="fw-bold mb-0">
                                    {confirmModal.bike?.brand} {confirmModal.bike?.model} ({confirmModal.bike?.year})?
                                </p>
                                {confirmModal.type === 'delete' && (
                                    <p className="text-danger small mt-2 mb-0">⚠️ This action cannot be undone.</p>
                                )}
                            </div>
                            <div className="modal-footer border-0 pt-0 gap-2">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => setConfirmModal({ show: false, type: '', bike: null })}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`btn text-white ${confirmModal.type === 'delete' ? 'btn-danger' : 'btn-success'}`}
                                    onClick={() => confirmModal.type === 'delete'
                                        ? handleDelete(confirmModal.bike._id)
                                        : handleApprove(confirmModal.bike._id)
                                    }
                                >
                                    {confirmModal.type === 'delete' ? '🗑️ Yes, Delete' : '✅ Yes, Approve'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBikes;
