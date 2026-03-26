import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/brands.css';
import { useCart } from '../context/cart';
import { AiOutlineShoppingCart, AiOutlineEye } from 'react-icons/ai';
import { BsSpeedometer } from 'react-icons/bs';
import { PiCurrencyInrFill } from 'react-icons/pi';
import { toast } from 'react-toastify';
import { ColorRing } from 'react-loader-spinner';

const CarInBrand = () => {
    const params = useParams();
    const [brandInfo, setBrandInfo] = useState(null);
    const [bikes, setBikes] = useState([]);
    const [cart, setcart] = useCart();
    const [loading, setLoading] = useState(true);

    const getBrandAndBikes = async () => {
        try {
            // Fetch brand info
            const brandRes = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/brand/getBrandBtId-brand/${params.slug}`
            );
            if (brandRes.data.success) {
                setBrandInfo(brandRes.data.brand);
            }

            // Fetch approved bikes and filter by brand name
            const bikesRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/bikes/approved`);
            if (bikesRes.data.success) {
                const brandName = brandRes.data.brand?.name || '';
                const filtered = bikesRes.data.bikes.filter(
                    b => b.brand?.toLowerCase() === brandName.toLowerCase()
                );
                setBikes(filtered);
            }

            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    const notify = () => toast.success('Added to Cart Successfully 🛒');

    useEffect(() => {
        getBrandAndBikes();
        window.scrollTo(0, 0);
    }, [params.slug]);

    return (
        <div>
            {/* Brand Header */}
            <section id="brands" className="brand_wrapper">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 text-center mb-3">
                            <p className="brand_subtitle">Brand Collection !</p>
                            <h2 className="brand_title">
                                {brandInfo?.name ? `${brandInfo.name} Bikes` : 'Brand Bikes'}
                            </h2>
                        </div>
                        {!loading && brandInfo?.brandPictures && (
                            <div className="col-auto text-center mb-2">
                                <img
                                    src={brandInfo.brandPictures}
                                    alt={brandInfo.name}
                                    className="img-fluid"
                                    style={{ maxHeight: '160px', objectFit: 'contain' }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Bikes in this Brand */}
            <div className="container">
                <div className="row" style={{ marginBottom: '100px', marginTop: '-20px' }}>
                    <div className="col-12 text-center mb-4">
                        <h2 className="brand_title">
                            Available <span style={{ color: 'blueviolet' }}>{brandInfo?.name}</span> Bikes in Stock
                        </h2>
                    </div>

                    {loading ? (
                        <div className="h-100 d-flex align-items-center justify-content-center py-5">
                            <ColorRing visible={true} colors={['#000435', 'rgb(14 165 233)', 'rgb(243 244 246)', '#000435', 'rgb(14 165 233)']} />
                        </div>
                    ) : bikes.length === 0 ? (
                        <div className="col-12 text-center py-5">
                            <span style={{ fontSize: '3rem' }}>🏍️</span>
                            <h4 className="mt-3 text-muted">
                                No {brandInfo?.name || 'brand'} bikes currently available.
                            </h4>
                            <Link to="/bikes" className="btn mt-3" style={{ backgroundColor: 'blueviolet', color: 'white' }}>
                                Browse All Bikes
                            </Link>
                        </div>
                    ) : (
                        bikes.map((bike) => (
                            <div key={bike._id} className="col-md-12 col-lg-3 mb-3 mb-lg-0 my-3">
                                <div className="card h-100">
                                    <div className="d-flex justify-content-between align-items-center p-3">
                                        <p className="lead mb-0">{bike.brand}</p>
                                        <span className="badge bg-success">{bike.condition}</span>
                                    </div>
                                    {bike.images && bike.images[0] && (
                                        <Link to={`/bike/${bike._id}`} className="text-center">
                                            <img
                                                src={bike.images[0]}
                                                alt={bike.model}
                                                style={{ maxWidth: '100%', maxHeight: '120px', objectFit: 'contain' }}
                                                className="border rounded"
                                            />
                                        </Link>
                                    )}
                                    <div className="card-body">
                                        <h5 className="text-center mb-2">{bike.brand} {bike.model} ({bike.year})</h5>
                                        <div className="d-flex justify-content-between">
                                            <h6><PiCurrencyInrFill /> {bike.price?.toLocaleString()}</h6>
                                            <h6><BsSpeedometer /> {bike.kmDriven?.toLocaleString()} km</h6>
                                        </div>
                                        <div className="text-center mt-2">
                                            <Link
                                                className="btn my-2"
                                                style={{ backgroundColor: 'blueviolet', color: 'white' }}
                                                to={`/bike/${bike._id}`}
                                            >
                                                <AiOutlineEye size={18} className="pb-1" /> View
                                            </Link>
                                            <button
                                                className="btn btn-outline-primary my-2 mx-2"
                                                onClick={() => {
                                                    setcart([...cart, bike]);
                                                    localStorage.setItem('cart', JSON.stringify([...cart, bike]));
                                                    notify();
                                                }}
                                            >
                                                <AiOutlineShoppingCart size={18} className="pb-1" /> Add To Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CarInBrand;
