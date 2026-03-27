import React, { useEffect, useState } from 'react'
import { useCart } from '../context/cart';
import { Link } from 'react-router-dom';
import '../styles/brands.css'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { AiOutlineEye } from 'react-icons/ai'
import { PiCurrencyInrFill } from 'react-icons/pi'
import { toast } from 'react-toastify';

import axios from 'axios';
import { Price } from '../pages/Price';
import { ColorRing } from 'react-loader-spinner'

const CarsHome = () => {
    const [cars, setcars] = useState([]);
    const [cart, setcart] = useCart()
    const [brand, setBrand] = useState([])
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [search, setsearch] = useState('');
    const [loading, setLoading] = useState(true);

    const getAllBrand = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/brand/getAll-brand`)
            if (data.success) {
                setBrand(data.brands)
            }
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(true);
        }
    }

    const getAllBikes = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/bikes/approved`)
            if (data.success) {
                setcars(data.bikes.reverse())
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const handleBrandChange = (brandName) => {
        // Clicking the same brand again deselects it (shows all bikes)
        setSelectedBrand((prev) => (prev === brandName ? '' : brandName));
    };

    const handlePriceChange = (priceArray) => {
        // Clicking the same range again deselects it
        setSelectedPriceRange((prev) =>
            JSON.stringify(prev) === JSON.stringify(priceArray) ? null : priceArray
        );
    };

    const resetFilters = () => {
        setSelectedBrand('');
        setSelectedPriceRange(null);
        setsearch('');
    };

    const notify = () => toast.success('Added to Cart Successfully')

    useEffect(() => {
        getAllBikes();
        getAllBrand();
        window.scrollTo(0, 0)
    }, []);

    return (
        <>
            <div className="brand_wrapper" id='bikes'>
                <div className="col-12 text-center">
                    <p className="brand_subtitle">A Wide Range of Bikes Awaits!</p>
                    <h2 className="brand_title">Bikes showcase</h2>
                </div>
            </div>
            <div className="container">
                <div className="row" style={{ marginBottom: '100px', marginTop: '-50px' }}>
                    <div className='col-md-12 col-lg-3'>
                        <h4 >🔎 Search Your Bike</h4>
                        <div className="input-group d-flex flex-column row">
                            <div className="form-outline">
                                <input type="search" placeholder="🔎 Search your bike..."
                                    onChange={(e) => setsearch(e.target.value)} className="form-control" />
                            </div>
                        </div>
                        <h4 className=" mt-4">Filter By Brands</h4>
                        <div className="d-flex flex-column">
                            {brand?.map((c) => (
                                <div
                                    key={c._id}
                                    onClick={() => handleBrandChange(c.name)}
                                    style={{
                                        cursor: 'pointer',
                                        padding: '6px 10px',
                                        marginBottom: '4px',
                                        borderRadius: '8px',
                                        fontWeight: selectedBrand === c.name ? '700' : '400',
                                        background: selectedBrand === c.name ? '#ede7ff' : 'transparent',
                                        color: selectedBrand === c.name ? 'blueviolet' : 'inherit',
                                        border: selectedBrand === c.name ? '1.5px solid blueviolet' : '1.5px solid transparent',
                                        transition: 'all 0.18s',
                                    }}
                                >
                                    {selectedBrand === c.name ? '● ' : '○ '}{c.name}
                                </div>
                            ))}
                        </div>
                        <h4 className="mt-4" style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e' }}>
                            💰 Filter By Price
                        </h4>
                        <div className="d-flex flex-column" style={{ gap: '6px' }}>
                            {Price.map((p) => {
                                const isSelected = JSON.stringify(selectedPriceRange) === JSON.stringify(p.array);
                                return (
                                    <div
                                        key={p._id}
                                        onClick={() => handlePriceChange(p.array)}
                                        style={{
                                            cursor: 'pointer',
                                            padding: '8px 12px',
                                            borderRadius: '10px',
                                            border: isSelected ? '1.5px solid blueviolet' : '1.5px solid #e5e7eb',
                                            background: isSelected ? '#ede7ff' : '#fff',
                                            transition: 'all 0.18s',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <span style={{
                                            fontSize: '0.85rem',
                                            fontWeight: isSelected ? 700 : 400,
                                            color: isSelected ? 'blueviolet' : '#374151',
                                        }}>
                                            {isSelected ? '● ' : '○ '}{p.name}
                                        </span>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                            padding: '2px 8px',
                                            borderRadius: '20px',
                                            background: isSelected ? 'blueviolet' : '#f3f4f6',
                                            color: isSelected ? '#fff' : '#6b7280',
                                        }}>
                                            {p.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="d-flex flex-column mt-4">
                            <button
                                style={{
                                    background: 'none',
                                    border: '1.5px solid #d1d5db',
                                    borderRadius: '10px',
                                    padding: '8px 0',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    color: '#6b7280',
                                    cursor: 'pointer',
                                    transition: 'all 0.18s',
                                }}
                                onMouseEnter={e => { e.target.style.borderColor = 'blueviolet'; e.target.style.color = 'blueviolet'; }}
                                onMouseLeave={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.color = '#6b7280'; }}
                                onClick={resetFilters}
                            >
                                ✕ Reset All Filters
                            </button>
                        </div>
                    </div>
                    <div className="col-md-12 col-lg-9">
                        {loading ?
                            <div className="h-100 d-flex align-items-center justify-content-center">
                                <ColorRing
                                    visible={true}
                                    colors={['#000435', 'rgb(14 165 233)', 'rgb(243 244 246)', '#000435', 'rgb(14 165 233)']}
                                />
                            </div>
                            :
                            <div className="row">
                                {cars.filter((bike) => {
                                    return search.toString().toLowerCase() === '' ? bike : bike.brand?.toLowerCase().includes(search.toLowerCase()) || bike.model?.toLowerCase().includes(search.toLowerCase())
                                }).filter((bike) => selectedBrand === '' || bike.brand?.toLowerCase() === selectedBrand.toLowerCase())
                                    .filter((bike) => {
                                        if (!selectedPriceRange) return true;
                                        const [minLakh, maxLakh] = selectedPriceRange;
                                        return bike.price >= minLakh * 100000 && bike.price <= maxLakh * 100000;
                                    }).map((bike) => (
                                        <div key={bike._id} className="col-md-12 col-lg-4 mb-3">
                                            <div className="card ">
                                                <div className="d-flex justify-content-between p-3">
                                                    <p className="lead mb-0 respBrand">{bike.brand}</p>
                                                    <span className="badge bg-success">{bike.condition}</span>
                                                </div>
                                                {bike.images && bike.images[0] && (
                                                    <Link to={`/bike/${bike._id}`} className='text-center'>
                                                        <img src={bike.images[0]} alt={bike.model} style={{ maxWidth: '100%', maxHeight: '130px', objectFit: 'contain' }} className='border rounded' />
                                                    </Link>
                                                )}
                                                <div className="card-body">
                                                    <h5 className="text-center mb-2 respName">{bike.brand} {bike.model} ({bike.year})</h5>
                                                    <div className="d-flex justify-content-between">
                                                        <h6 className='respBrand'><PiCurrencyInrFill /> {bike.price?.toLocaleString()}</h6>
                                                        <h6 className='respBrand'>📍 {bike.location}</h6>
                                                    </div>
                                                    <div className='text-center'>
                                                        <Link className='btn my-2' style={{ backgroundColor: 'blueviolet', color: 'white' }} to={`/bike/${bike._id}`}>
                                                            <AiOutlineEye size={20} className='pb-1' /> View
                                                        </Link>
                                                        <button className='btn btn-outline-primary my-2 mx-3' onClick={() => { setcart([...cart, bike]); localStorage.setItem('cart', JSON.stringify([...cart, bike])); notify() }}>
                                                            <AiOutlineShoppingCart size={20} className='pb-1' /> Add To Cart
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>

    )
}

export default CarsHome
