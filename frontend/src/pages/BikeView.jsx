import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AiOutlineShoppingCart, AiOutlineEye } from 'react-icons/ai';
import { BsSpeedometer } from 'react-icons/bs';
import { PiCurrencyInrFill } from 'react-icons/pi';
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { toast } from 'react-toastify';
import { ColorRing } from 'react-loader-spinner';
import '../styles/carview.css';
import { saveCartToStorage } from '../utils/cartStorage';

const BikeView = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [bike, setBike] = useState(null);
    const [relatedBikes, setRelatedBikes] = useState([]);
    const [cart, setcart] = useCart();
    const [auth] = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const isRegularUser = !auth?.user || auth?.user?.role === 'user';

    const getBike = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/bikes/${params.id}`);
            if (data.success) {
                setBike(data.bike);
                // Fetch related bikes (same brand)
                getRelatedBikes(data.bike.brand, data.bike._id);
            }
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    const getRelatedBikes = async (brand, currentId) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/bikes/approved`);
            if (data.success) {
                const related = data.bikes.filter(b => b.brand === brand && b._id !== currentId).slice(0, 4);
                setRelatedBikes(related);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (params?.id) {
            getBike();
        }
        window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params?.id]);

    const notify = () => toast.success('Added To Cart Successfully 🛒');

    if (loading) {
        return (
            <div className="h-100 d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                <ColorRing visible={true} colors={['#000435', 'rgb(14 165 233)', 'rgb(243 244 246)', '#000435', 'rgb(14 165 233)']} />
            </div>
        );
    }

    if (!bike) {
        return (
            <div className="container marginStyle text-center py-5">
                <h3 className="text-muted">Bike not found.</h3>
                <Link to="/bikes" className="btn mt-3" style={{ backgroundColor: 'blueviolet', color: 'white' }}>← Browse Bikes</Link>
            </div>
        );
    }

    return (
        <div className="container marginStyle">

            {/* ── Main Bike Detail ── */}
            <div className="row g-4">

                {/* Images */}
                <div className="col-md-6">
                    {bike.images && bike.images.length > 0 ? (
                        <>
                            <img
                                src={bike.images[activeImage]}
                                alt={`${bike.brand} ${bike.model}`}
                                className="img-fluid border rounded-3 shadow-sm w-100"
                                style={{ maxHeight: '360px', objectFit: 'contain', background: '#f9f9f9' }}
                            />
                            {bike.images.length > 1 && (
                                <div className="d-flex gap-2 mt-3 flex-wrap">
                                    {bike.images.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            alt={`thumb_${i}`}
                                            onClick={() => setActiveImage(i)}
                                            style={{
                                                width: '70px', height: '60px', objectFit: 'cover',
                                                borderRadius: '8px', cursor: 'pointer',
                                                border: activeImage === i ? '2px solid blueviolet' : '2px solid #ddd'
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="d-flex align-items-center justify-content-center border rounded-3"
                            style={{ height: '300px', background: '#f5f5f5' }}>
                            <span className="text-muted fs-1">🏍️</span>
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="badge" style={{ background: 'blueviolet', fontSize: '0.85rem' }}>{bike.brand}</span>
                        <span className={`badge bg-${bike.status === 'approved' ? 'success' : 'secondary'}`}>{bike.condition}</span>
                    </div>
                    <h2 className="fw-bold mb-1">{bike.brand} {bike.model}</h2>
                    <p className="text-muted mb-3">Year: <strong>{bike.year}</strong></p>

                    <h3 className="mb-3" style={{ color: 'blueviolet' }}><PiCurrencyInrFill /> {bike.price?.toLocaleString()}</h3>

                    <div className="row g-2 mb-3">
                        <div className="col-6">
                            <div className="p-3 rounded-3 text-center" style={{ background: '#f5f0ff' }}>
                                <BsSpeedometer size={20} color="blueviolet" />
                                <p className="mb-0 small text-muted mt-1">KM Driven</p>
                                <strong>{bike.kmDriven?.toLocaleString()} km</strong>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="p-3 rounded-3 text-center" style={{ background: '#f5f0ff' }}>
                                <span style={{ fontSize: '1.2rem' }}>📍</span>
                                <p className="mb-0 small text-muted mt-1">Location</p>
                                <strong>{bike.location}</strong>
                            </div>
                        </div>
                    </div>

                    {bike.description && (
                        <div className="mb-3">
                            <h6 className="fw-semibold">About this Bike</h6>
                            <p className="text-muted" style={{ textAlign: 'justify' }}>{bike.description}</p>
                        </div>
                    )}

                    <div className="d-flex gap-2 flex-wrap mt-4">
                        {isRegularUser && (
                            <>
                                <button
                                    className="btn btn-lg text-white"
                                    style={{ backgroundColor: 'blueviolet' }}
                                    onClick={() => {
                                        const updatedCart = [...cart, bike];
                                        setcart(updatedCart);
                                        saveCartToStorage(updatedCart);
                                        notify();
                                        navigate('/cart');
                                    }}
                                >
                                    <AiOutlineShoppingCart size={20} className="pb-1" /> Add To Cart
                                </button>
                                <Link to="/cart" className="btn btn-lg btn-outline-primary">
                                    <AiOutlineEye size={20} className="pb-1" /> View Cart
                                </Link>
                            </>
                        )}
                        {/* <Link to="/bikes" className="btn btn-lg btn-outline-secondary">
                            ← All Bikes
                        </Link> */}
                    </div>
                </div>
            </div>

            {/* ── Related Bikes ── */}
            {relatedBikes.length > 0 && (
                <div className="mt-5">
                    <h4 className="mb-4 text-center">
                        More <span style={{ color: 'blueviolet' }}>{bike.brand}</span> Bikes
                    </h4>
                    <div className="row g-3">
                        {relatedBikes.map((b) => (
                            <div key={b._id} className="col-md-6 col-lg-3">
                                <div className="card border-0 shadow-sm h-100">
                                    {b.images && b.images[0] && (
                                        <Link to={`/bike/${b._id}`}>
                                            <img
                                                src={b.images[0]} alt={b.model}
                                                className="card-img-top"
                                                style={{ height: '130px', objectFit: 'contain', background: '#f9f9f9' }}
                                            />
                                        </Link>
                                    )}
                                    <div className="card-body text-center p-2">
                                        <p className="fw-bold mb-1">{b.brand} {b.model} ({b.year})</p>
                                        <p className="text-muted small mb-2">
                                            <PiCurrencyInrFill /> {b.price?.toLocaleString()} &nbsp;|&nbsp; {b.kmDriven?.toLocaleString()} km
                                        </p>
                                        <Link to={`/bike/${b._id}`} className="btn btn-sm text-white w-100" style={{ backgroundColor: 'blueviolet' }}>
                                            <AiOutlineEye size={16} /> View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BikeView;
