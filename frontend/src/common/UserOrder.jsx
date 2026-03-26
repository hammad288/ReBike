import React, { useEffect, useState } from 'react';
import UserMenu from './UserMenu';
import axios from 'axios';
import { useAuth } from '../context/auth';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const statusColors = {
    'Not Processed': '#6c757d',
    Processing:      '#0d6efd',
    Shipped:         '#0dcaf0',
    Delivered:       '#198754',
    Cancelled:       '#dc3545',
};

const UserOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [auth] = useAuth();

    const getOrders = async () => {
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/user/orders`,
                { headers: { Authorization: `Bearer ${auth?.token}` } }
            );
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (err) {
            toast.error('Could not load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth?.token) getOrders();
        window.scrollTo(0, 0);
    }, [auth?.token]);

    return (
        <div className="container my-5" style={{ paddingTop: '80px' }}>
            <div className="row">
                {/* Sidebar */}
                <div className="col-md-3 mb-4">
                    <UserMenu />
                </div>

                {/* Main Content */}
                <div className="col-md-9">
                    {/* Header */}
                    <div
                        className="d-flex align-items-center gap-3 mb-4 p-4 rounded-4 shadow-sm"
                        style={{
                            background: 'linear-gradient(135deg, blueviolet 0%, #9c27b0 100%)',
                            color: 'white',
                        }}
                    >
                        <div style={{ fontSize: '2rem' }}>📦</div>
                        <div>
                            <h4 className="mb-1 fw-bold">My Orders</h4>
                            <p className="mb-0" style={{ opacity: 0.85, fontSize: '0.88rem' }}>
                                {orders.length} order{orders.length !== 1 ? 's' : ''} placed
                            </p>
                        </div>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="text-center py-5">
                            <div className="spinner-border" style={{ color: 'blueviolet' }} role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && orders.length === 0 && (
                        <div
                            className="card border-0 shadow-sm text-center py-5"
                            style={{ borderRadius: '16px' }}
                        >
                            <div style={{ fontSize: '3rem' }}>🏍️</div>
                            <h5 className="mt-3 text-muted">No orders yet</h5>
                            <p className="text-muted small">Browse bikes and place your first order!</p>
                            <div>
                                <Link
                                    to="/bikes"
                                    className="btn mt-2"
                                    style={{ background: 'blueviolet', color: 'white', borderRadius: '8px' }}
                                >
                                    Browse Bikes
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Orders List */}
                    {!loading && orders.map((order, i) => (
                        <div
                            key={order._id}
                            className="card border-0 shadow-sm mb-4"
                            style={{ borderRadius: '16px', overflow: 'hidden' }}
                        >
                            {/* Order Header */}
                            <div
                                style={{
                                    background: '#f8f5ff',
                                    padding: '14px 20px',
                                    borderBottom: '1px solid #eee',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '8px',
                                }}
                            >
                                <div>
                                    <span style={{ fontWeight: 700, color: '#333', fontSize: '0.9rem' }}>
                                        Order #{i + 1}
                                    </span>
                                    <span className="ms-3 text-muted" style={{ fontSize: '0.8rem' }}>
                                        {moment(order.createdAt).format('DD MMM YYYY, hh:mm A')}
                                    </span>
                                </div>
                                <div className="d-flex gap-2 align-items-center">
                                    <span
                                        className="badge"
                                        style={{
                                            background: statusColors[order.status] || '#6c757d',
                                            color: 'white',
                                            padding: '5px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.78rem',
                                        }}
                                    >
                                        {order.status}
                                    </span>
                                    <span
                                        className="badge"
                                        style={{
                                            background: order.payment?.success ? '#198754' : '#dc3545',
                                            color: 'white',
                                            padding: '5px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.78rem',
                                        }}
                                    >
                                        {order.payment?.success ? '✅ Paid' : '❌ Unpaid'}
                                    </span>
                                </div>
                            </div>

                            {/* Bikes in Order */}
                            <div className="card-body p-3">
                                {order.bikes?.length === 0 && (
                                    <p className="text-muted text-center py-3">No bike details available.</p>
                                )}
                                {order.bikes?.map((bike) => (
                                    <div
                                        key={bike._id}
                                        className="d-flex align-items-center gap-3 p-3 mb-2 rounded-3"
                                        style={{ background: '#fafafa', border: '1px solid #f0ebff' }}
                                    >
                                        {/* Bike Image */}
                                        <Link to={`/bike/${bike._id}`} style={{ flexShrink: 0 }}>
                                            {bike.images && bike.images[0] ? (
                                                <img
                                                    src={bike.images[0]}
                                                    alt={bike.model}
                                                    style={{
                                                        width: '90px',
                                                        height: '65px',
                                                        objectFit: 'cover',
                                                        borderRadius: '10px',
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: '90px',
                                                        height: '65px',
                                                        background: '#ede7ff',
                                                        borderRadius: '10px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1.8rem',
                                                    }}
                                                >
                                                    🏍️
                                                </div>
                                            )}
                                        </Link>

                                        {/* Bike Info */}
                                        <div className="flex-grow-1">
                                            <div style={{ fontWeight: 700, color: '#222', fontSize: '0.95rem' }}>
                                                {bike.brand} {bike.model} ({bike.year})
                                            </div>
                                            <div className="text-muted small">{bike.location} · {bike.condition}</div>
                                        </div>

                                        {/* Price */}
                                        <div style={{ fontWeight: 700, color: 'blueviolet', fontSize: '1rem', flexShrink: 0 }}>
                                            ₹ {Number(bike.price)?.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserOrder;
