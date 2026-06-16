import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/auth';
import { sellerAPI } from '../services/apiService';
import '../styles/hero.css';

const MyBikes = () => {
    const [auth] = useAuth();
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, approved, pending

    useEffect(() => {
        fetchBikes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchBikes = async () => {
        const result = await sellerAPI.getMyBikes(auth.token);
        if (result.success) {
            setBikes(result.data.bikes || []);
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this bike?')) {
            return;
        }

        const result = await sellerAPI.deleteBike(id, auth.token);
        if (result.success) {
            toast.success('Bike deleted successfully');
            fetchBikes(); // Refresh list
        } else {
            toast.error(result.message);
        }
    };

    const filteredBikes = bikes.filter(bike => {
        if (filter === 'approved') return bike.status === 'approved';
        if (filter === 'pending') return bike.status === 'pending';
        if (filter === 'rejected') return bike.status === 'rejected';
        return true;
    });

    if (loading) {
        return (
            <div className="container my-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const badges = {
            pending: <span className="badge bg-warning text-dark">Pending</span>,
            approved: <span className="badge bg-success">Approved</span>,
            rejected: <span className="badge bg-danger">Rejected</span>,
        };
        return badges[status] || <span className="badge bg-secondary">Unknown</span>;
    };

    return (
        <div className="container my-5" style={{ paddingTop: '80px' }}>
            <div className="row mb-4">
                <div className="col-md-6">
                    <h2>My Bikes</h2>
                    <p className="text-muted">Manage your bike listings</p>
                </div>
                <div className="col-md-6 text-end">
                    <Link to="/dashboard/seller/add-bike" className="btn btn-primary">
                        <i className="bi bi-plus-circle me-2"></i>Add New Bike
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="btn-group" role="group">
                        <button
                            type="button"
                            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setFilter('all')}
                        >
                            All ({bikes.length})
                        </button>
                        <button
                            type="button"
                            className={`btn ${filter === 'approved' ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => setFilter('approved')}
                        >
                            Approved ({bikes.filter(b => b.status === 'approved').length})
                        </button>
                        <button
                            type="button"
                            className={`btn ${filter === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
                            onClick={() => setFilter('pending')}
                        >
                            Pending ({bikes.filter(b => b.status === 'pending').length})
                        </button>
                        <button
                            type="button"
                            className={`btn ${filter === 'rejected' ? 'btn-danger' : 'btn-outline-danger'}`}
                            onClick={() => setFilter('rejected')}
                        >
                            Rejected ({bikes.filter(b => b.status === 'rejected').length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Bikes Table */}
            {filteredBikes.length === 0 ? (
                <div className="alert alert-info">
                    <h5>No bikes found</h5>
                    <p>Start by adding your first bike listing!</p>
                    <Link to="/dashboard/seller/add-bike" className="btn btn-primary mt-2">
                        Add New Bike
                    </Link>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Brand & Model</th>
                                <th>Year</th>
                                <th>Price</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBikes.map((bike) => (
                                <tr key={bike._id}>
                                    <td>
                                        <strong>{bike.brand} {bike.model}</strong>
                                        <br />
                                        <small className="text-muted">{bike.condition}</small>
                                        {bike.status === 'rejected' && bike.rejectionReason && (
                                            <>
                                                <br />
                                                <small className="text-danger">
                                                    <em>Rejection Reason: {bike.rejectionReason}</em>
                                                </small>
                                            </>
                                        )}
                                    </td>
                                    <td>{bike.year}</td>
                                    <td>₹{bike.price.toLocaleString()}</td>
                                    <td>{bike.location}</td>
                                    <td>{getStatusBadge(bike.status)}</td>
                                    <td>
                                        <div className="btn-group btn-group-sm">
                                            <Link
                                                to={`/dashboard/seller/edit-bike/${bike._id}`}
                                                className="btn btn-outline-primary"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(bike._id)}
                                                className="btn btn-outline-danger"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyBikes;
