import React, { useEffect, useState } from 'react'
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { Link } from 'react-router-dom';
import '../styles/brands.css'
import { AiOutlineShoppingCart, AiOutlineEye } from 'react-icons/ai'
import { BsSpeedometer } from 'react-icons/bs'
import { PiCurrencyInrFill } from 'react-icons/pi'
import { toast } from 'react-toastify';
import axios from 'axios'
import { saveCartToStorage } from '../utils/cartStorage'

// Skeleton card shown while bikes load
const SkeletonCard = () => (
    <div className="col-md-12 col-lg-3 mb-3 my-3">
        <div className="skeleton-card">
            <div className="d-flex justify-content-between p-3">
                <div className="skeleton-block skeleton-line" style={{ width: '45%', margin: 0 }} />
                <div className="skeleton-block" style={{ height: 20, width: 55, borderRadius: 12 }} />
            </div>
            <div className="skeleton-block skeleton-img" />
            <div className="p-3">
                <div className="skeleton-block skeleton-title" />
                <div className="skeleton-block skeleton-line" />
                <div className="d-flex justify-content-center gap-2 mt-2">
                    <div className="skeleton-block skeleton-btn" style={{ width: '40%' }} />
                    <div className="skeleton-block skeleton-btn" style={{ width: '40%' }} />
                </div>
            </div>
        </div>
    </div>
);

const CarsHome = () => {
    const [bikes, setBikes] = useState([]);
    const [cart, setcart] = useCart()
    const [auth] = useAuth();
    const [loading, setLoading] = useState(true);
    const isRegularUser = !auth?.user || auth?.user?.role === 'user';

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/bikes/approved?page=1&limit=8`);
                if (data?.success && Array.isArray(data.bikes)) {
                    setBikes(data.bikes);
                }
            } catch (error) {
                console.error('CarsHome fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBikes();
    }, []);

    const notify = () => toast.success('Added to Cart Successfully')

    return (
        <>
            <div className="brand_wrapper" id='bikes'>
                <div className="col-12 text-center">
                    <p className="brand_subtitle">Explore an array of exciting new Bikes !</p>
                    <h2 className="brand_title">Latest Bikes showcase</h2>
                </div>
            </div>
            <div className="container">
                <div className="row" style={{ marginTop: '-40px' }}>
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                        : bikes.map((bike) => (
                            <div key={bike._id} className="col-md-12 col-lg-3 mb-3 mb-lg-0 my-3">
                                <div className="card">
                                    <div className="d-flex justify-content-between p-3">
                                        <p className="lead mb-0 respBrand">{bike.brand}</p>
                                        <span className="badge bg-success">{bike.condition}</span>
                                    </div>
                                    {bike.images && bike.images[0] && (
                                        <Link to={`/bike/${bike._id}`} className='text-center'>
                                            <img
                                                src={bike.images[0]}
                                                alt={bike.model}
                                                style={{ maxWidth: '100%', maxHeight: '130px', objectFit: 'contain' }}
                                                className='border rounded'
                                                loading="lazy"
                                            />
                                        </Link>
                                    )}
                                    <div className="card-body">
                                        <h5 className="text-center mb-2 respName">{bike.brand} {bike.model} ({bike.year})</h5>
                                        <div className="d-flex justify-content-between">
                                            <h6 className='respBrand'><PiCurrencyInrFill /> {bike.price?.toLocaleString()}</h6>
                                            <h6 className='respBrand'><BsSpeedometer /> {bike.kmDriven?.toLocaleString()} km</h6>
                                        </div>
                                        <div className='text-center mt-2'>
                                            <Link className='btn my-2' style={{ backgroundColor: 'blueviolet', color: 'white' }} to={`/bike/${bike._id}`}>
                                                <AiOutlineEye size={20} className='pb-1' /> View
                                            </Link>
                                            {isRegularUser && (
                                                <button
                                                    className='btn btn-outline-primary my-2 mx-2'
                                                    onClick={() => {
                                                        const updated = [...cart, bike];
                                                        setcart(updated);
                                                        saveCartToStorage(updated);
                                                        notify();
                                                    }}
                                                >
                                                    <AiOutlineShoppingCart size={20} className='pb-1' /> Add To Cart
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                {!loading && bikes.length > 0 && (
                    <div className="col-12 text-center my-4">
                        <Link to='/bikes' className='btn btn-lg text-white' style={{ backgroundColor: 'blueviolet' }}>
                            View All Bikes 🏍️
                        </Link>
                    </div>
                )}
            </div>
        </>
    )
}

export default CarsHome