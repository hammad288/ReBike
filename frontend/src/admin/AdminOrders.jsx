import React, { useEffect, useState } from 'react';
import AdminMenu from './AdminMenu';
import { useAuth } from '../context/auth';
import axios from 'axios';
import { toast } from 'react-toastify';

const STATUS_OPTIONS = ["Not Processed", "Processing", "Shipped", "Delivered", "Cancelled"];

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [auth] = useAuth();

    const getOrders = async () => {
        if (!auth?.token) return;
        try {
            setLoading(true);
            const res = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/orders/all`,
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            if (res.data?.success) {
                setOrders(res.data.orders || []);
            } else {
                toast.error('Failed to load orders');
            }
        } catch (err) {
            console.error('Get orders error:', err);
            toast.error('Server Error loading orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth?.token) getOrders();
        window.scrollTo(0, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth?.token]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/orders/${orderId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            toast.success(`Status updated to "${newStatus}"`);
            // Update locally to avoid full refetch
            setOrders(prev =>
                prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o)
            );
        } catch (error) {
            console.error('Status update error:', error);
            toast.error('Failed to update order status');
        }
    };

    const getPaymentBadge = (payment) => {
        if (payment?.success) return <span className="badge text-bg-success">Paid</span>;
        return <span className="badge text-bg-warning text-dark">COD / Pending</span>;
    };

    const getStatusBadge = (status) => {
        const map = {
            'Not Processed': 'bg-secondary',
            'Processing':    'bg-primary',
            'Shipped':       'bg-info text-dark',
            'Delivered':     'bg-success',
            'Cancelled':     'bg-danger',
        };
        return <span className={`badge ${map[status] || 'bg-secondary'}`}>{status}</span>;
    };

    return (
        <div className="container my-5" style={{ paddingTop: '80px' }}>
            <div className="row">
                <div className="col-md-3">
                    <AdminMenu />
                </div>
                <div className="col-md-9">
                    <div className="card shadow-sm border-0">
                        <div className="card-header d-flex justify-content-between align-items-center"
                            style={{ backgroundColor: 'blueviolet', color: 'white' }}>
                            <h4 className="mb-0">📦 Manage Orders</h4>
                            <span className="badge bg-white text-dark">{orders.length} total</span>
                        </div>
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border" style={{ color: 'blueviolet' }} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="alert alert-info m-3">No orders found.</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-3">#</th>
                                                <th>Buyer</th>
                                                <th>Bikes</th>
                                                <th>Amount</th>
                                                <th>Payment</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                                <th>Update Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((o, i) => (
                                                <tr key={o._id}>
                                                    <td className="ps-3 text-muted">{i + 1}</td>
                                                    <td>
                                                        <div className="fw-semibold">{o.buyer?.name || 'N/A'}</div>
                                                        <div className="text-muted small">{o.buyer?.email}</div>
                                                    </td>
                                                     <td>
                                                        {o.bikes?.map(bike => (
                                                            <div key={bike._id} className="small mb-1">
                                                                🏍️ {bike.brand} {bike.model} ({bike.year})
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td>
                                                        {o.totalAmount
                                                            ? `₹${Number(o.totalAmount).toLocaleString('en-IN')}`
                                                            : '—'}
                                                    </td>
                                                    <td>{getPaymentBadge(o.payment)}</td>
                                                    <td>{getStatusBadge(o.status)}</td>
                                                    <td className="text-muted small">
                                                        {new Date(o.createdAt).toLocaleDateString('en-IN', {
                                                            day: '2-digit', month: 'short', year: 'numeric'
                                                        })}
                                                    </td>
                                                    <td>
                                                        <select
                                                            className="form-select form-select-sm"
                                                            style={{ minWidth: 130 }}
                                                            value={o.status}
                                                            onChange={(e) => handleStatusChange(o._id, e.target.value)}
                                                        >
                                                            {STATUS_OPTIONS.map(s => (
                                                                <option key={s} value={s}>{s}</option>
                                                            ))}
                                                        </select>
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

export default AdminOrders;
