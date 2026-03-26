import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/OrderConfirmation.css';

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderId = location.state?.orderId;

    // If someone navigates here directly without an order, redirect to home
    useEffect(() => {
        window.scrollTo(0, 0);
        if (!orderId) {
            navigate('/', { replace: true });
        }
    }, [orderId, navigate]);

    if (!orderId) return null;

    return (
        <div className="oc-wrapper">
            {/* Animated background blobs */}
            <div className="oc-blob oc-blob-1" />
            <div className="oc-blob oc-blob-2" />

            <div className="oc-card">
                {/* Success icon */}
                <div className="oc-icon-wrap">
                    <div className="oc-circle">
                        <svg className="oc-check" viewBox="0 0 52 52">
                            <circle className="oc-check-circle" cx="26" cy="26" r="25" fill="none" />
                            <path className="oc-check-mark" fill="none" d="M14 27l9 9 16-16" />
                        </svg>
                    </div>
                </div>

                {/* Heading */}
                <h1 className="oc-title">Order Placed!</h1>
                <p className="oc-subtitle">
                    Thank you for shopping with us. Your order is now being processed
                    and you will receive updates soon.
                </p>

                {/* Order ID box */}
                <div className="oc-id-box">
                    <span className="oc-id-label">Order ID</span>
                    <span className="oc-id-value">{orderId}</span>
                </div>

                <p className="oc-note">
                    If you have any questions, feel free to{' '}
                    <a href="mailto:support@rebike.com" className="oc-link">contact us</a>.
                </p>

                {/* Actions */}
                <div className="oc-actions">
                    <Link to="/dashboard/user/order" className="oc-btn oc-btn-primary">
                        📦 View My Orders
                    </Link>
                    <Link to="/bikes" className="oc-btn oc-btn-secondary">
                        🏍️ Browse More Bikes
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
