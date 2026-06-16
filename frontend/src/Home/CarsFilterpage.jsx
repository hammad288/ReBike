import React, { useEffect, useState, useRef } from 'react'
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { Link } from 'react-router-dom';
import '../styles/brands.css'
import { AiOutlineShoppingCart, AiOutlineEye } from 'react-icons/ai'
import { PiCurrencyInrFill } from 'react-icons/pi'
import { toast } from 'react-toastify';
import axios from 'axios';
import { Price } from '../pages/Price';
import { saveCartToStorage } from '../utils/cartStorage'

const PAGE_SIZE = 12;
const BASE = process.env.REACT_APP_API_URL;

const SkeletonCard = () => (
    <div className="col-md-12 col-lg-4 mb-3">
        <div className="skeleton-card">
            <div className="d-flex justify-content-between p-3">
                <div className="skeleton-block skeleton-line" style={{ width: '40%', margin: 0 }} />
                <div className="skeleton-block" style={{ height: 20, width: 60, borderRadius: 12 }} />
            </div>
            <div className="skeleton-block skeleton-img" />
            <div className="p-3">
                <div className="skeleton-block skeleton-title" />
                <div className="skeleton-block skeleton-line" />
                <div className="d-flex justify-content-center gap-2 mt-2">
                    <div className="skeleton-block skeleton-btn" />
                    <div className="skeleton-block skeleton-btn" />
                </div>
            </div>
        </div>
    </div>
);

const CarsHome = () => {
    const [cars, setcars] = useState([]);
    const [cart, setcart] = useCart();
    const [auth] = useAuth();
    const [brands, setBrands] = useState([]);

    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [search, setsearch] = useState('');

    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    // Skip first render for filter effects (initial load handled separately)
    const skipBrandPrice = useRef(true);
    const skipSearch    = useRef(true);
    const debounceRef   = useRef(null);
    const currentPage   = useRef(1);

    const isRegularUser = !auth?.user || auth?.user?.role === 'user';

    // ── Core fetch function ─────────────────────────────────────────────────
    const fetchBikes = async ({ brand, priceRange, searchVal, pageNum = 1, append = false }) => {
        if (append) setLoadingMore(true); else setLoading(true);

        const params = new URLSearchParams();
        params.set('page',  pageNum);
        params.set('limit', PAGE_SIZE);
        if (brand)      params.set('brand',    brand);
        if (searchVal)  params.set('search',   searchVal);
        if (priceRange) {
            params.set('minPrice', priceRange[0] * 100000);
            params.set('maxPrice', priceRange[1] * 100000);
        }

        try {
            const { data } = await axios.get(`${BASE}/api/bikes/approved?${params.toString()}`);
            if (data?.success) {
                setcars(prev => append ? [...prev, ...data.bikes] : (data.bikes || []));
                setTotalCount(data.totalCount || 0);
                setHasMore(data.currentPage < data.totalPages);
                currentPage.current = pageNum;
                setPage(pageNum);
            }
        } catch (err) {
            console.error('fetchBikes error:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // ── Initial load: brands + first page of bikes ─────────────────────────
    useEffect(() => {
        const init = async () => {
            try {
                const [bikesRes, brandsRes] = await Promise.all([
                    axios.get(`${BASE}/api/bikes/approved?page=1&limit=${PAGE_SIZE}`),
                    axios.get(`${BASE}/api/brand/getAll-brand`)
                ]);
                if (bikesRes.data?.success) {
                    setcars(bikesRes.data.bikes || []);
                    setTotalCount(bikesRes.data.totalCount || 0);
                    setHasMore(bikesRes.data.currentPage < bikesRes.data.totalPages);
                }
                if (brandsRes.data?.success) setBrands(brandsRes.data.brands);
            } catch (err) {
                console.error('Init error:', err);
            } finally {
                setLoading(false);
            }
        };
        init();
        window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Brand / Price filter changes ───────────────────────────────────────
    useEffect(() => {
        // Skip on initial mount — init() already loaded bikes
        if (skipBrandPrice.current) { skipBrandPrice.current = false; return; }
        fetchBikes({ brand: selectedBrand, priceRange: selectedPriceRange, searchVal: search, pageNum: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBrand, selectedPriceRange]);

    // ── Search (debounced 450ms) ────────────────────────────────────────────
    useEffect(() => {
        // Skip on initial mount
        if (skipSearch.current) { skipSearch.current = false; return; }
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchBikes({ brand: selectedBrand, priceRange: selectedPriceRange, searchVal: search, pageNum: 1 });
        }, 450);
        return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    // ── Load More ──────────────────────────────────────────────────────────
    const handleLoadMore = () => {
        fetchBikes({ brand: selectedBrand, priceRange: selectedPriceRange, searchVal: search, pageNum: page + 1, append: true });
    };

    // ── Filter handlers ────────────────────────────────────────────────────
    const handleBrandChange = (name) => {
        setSelectedBrand(prev => prev === name ? '' : name);
    };

    const handlePriceChange = (arr) => {
        setSelectedPriceRange(prev =>
            JSON.stringify(prev) === JSON.stringify(arr) ? null : arr
        );
    };

    const resetFilters = () => {
        // Reset state
        setSelectedBrand('');
        setSelectedPriceRange(null);
        setsearch('');
        // Manually fire fetch since all 3 state resets batch into one render
        // The effects would fire but might carry stale values — explicit call is safer
        if (debounceRef.current) clearTimeout(debounceRef.current);
        fetchBikes({ brand: '', priceRange: null, searchVal: '', pageNum: 1 });
    };

    const notify = () => toast.success('Added to Cart Successfully');
    const filtersActive = search !== '' || selectedBrand !== '' || selectedPriceRange !== null;

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

                    {/* ── SIDEBAR ── */}
                    <div className='col-md-12 col-lg-3'>
                        <h4>🔎 Search Your Bike</h4>
                        <div className="form-outline mb-3">
                            <input
                                type="search"
                                placeholder="🔎 Search brand or model..."
                                value={search}
                                onChange={(e) => setsearch(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <h4 className="mt-3">Filter By Brands</h4>
                        <div className="d-flex flex-column">
                            {brands?.map((c) => (
                                <div key={c._id} onClick={() => handleBrandChange(c.name)}
                                    style={{
                                        cursor: 'pointer', padding: '6px 10px', marginBottom: '4px',
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

                        <h4 className="mt-4" style={{ fontSize: '1rem', fontWeight: 700 }}>💰 Filter By Price</h4>
                        <div className="d-flex flex-column" style={{ gap: '6px' }}>
                            {Price.map((p) => {
                                const isSelected = JSON.stringify(selectedPriceRange) === JSON.stringify(p.array);
                                return (
                                    <div key={p._id} onClick={() => handlePriceChange(p.array)}
                                        style={{
                                            cursor: 'pointer', padding: '8px 12px', borderRadius: '10px',
                                            border: isSelected ? '1.5px solid blueviolet' : '1.5px solid #e5e7eb',
                                            background: isSelected ? '#ede7ff' : '#fff',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            transition: 'all 0.18s',
                                        }}
                                    >
                                        <span style={{ fontSize: '0.85rem', fontWeight: isSelected ? 700 : 400, color: isSelected ? 'blueviolet' : '#374151' }}>
                                            {isSelected ? '● ' : '○ '}{p.name}
                                        </span>
                                        <span style={{
                                            fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: '20px',
                                            background: isSelected ? 'blueviolet' : '#f3f4f6',
                                            color: isSelected ? '#fff' : '#6b7280',
                                        }}>
                                            {p.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4">
                            <button
                                style={{
                                    width: '100%', background: 'none', border: '1.5px solid #d1d5db',
                                    borderRadius: '10px', padding: '8px 0', fontSize: '0.85rem',
                                    fontWeight: 600, color: '#6b7280', cursor: 'pointer', transition: 'all 0.18s',
                                }}
                                onMouseEnter={e => { e.target.style.borderColor = 'blueviolet'; e.target.style.color = 'blueviolet'; }}
                                onMouseLeave={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.color = '#6b7280'; }}
                                onClick={resetFilters}
                            >
                                ✕ Reset All Filters
                            </button>
                        </div>

                        {filtersActive && !loading && (
                            <p className="text-muted small mt-2 text-center">
                                {totalCount} bike{totalCount !== 1 ? 's' : ''} found
                            </p>
                        )}
                    </div>

                    {/* ── BIKE GRID ── */}
                    <div className="col-md-12 col-lg-9">
                        <div className="row">
                            {loading
                                ? Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)
                                : cars.length === 0
                                    ? (
                                        <div className="col-12 text-center py-5">
                                            <span style={{ fontSize: '3rem' }}>🏍️</span>
                                            <h4 className="mt-3 text-muted">No bikes match your filters.</h4>
                                            <button className="load-more-btn mt-3" onClick={resetFilters}>Clear Filters</button>
                                        </div>
                                    )
                                    : cars.map((bike) => (
                                        <div key={bike._id} className="col-md-12 col-lg-4 mb-3">
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
                                                    <h5 className="text-center mb-2 respName">
                                                        {bike.brand} {bike.model} ({bike.year})
                                                    </h5>
                                                    <div className="d-flex justify-content-between">
                                                        <h6 className='respBrand'><PiCurrencyInrFill /> {bike.price?.toLocaleString()}</h6>
                                                        <h6 className='respBrand'>📍 {bike.location}</h6>
                                                    </div>
                                                    <div className='text-center'>
                                                        <Link className='btn my-2' style={{ backgroundColor: 'blueviolet', color: 'white' }} to={`/bike/${bike._id}`}>
                                                            <AiOutlineEye size={20} className='pb-1' /> View
                                                        </Link>
                                                        {isRegularUser && (
                                                            <button
                                                                className='btn btn-outline-primary my-2 mx-3'
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

                        {!loading && hasMore && (
                            <div className="text-center mt-3 mb-4">
                                <button className="load-more-btn" onClick={handleLoadMore} disabled={loadingMore}>
                                    {loadingMore ? 'Loading...' : 'Load More Bikes'}
                                </button>
                            </div>
                        )}

                        {loadingMore && (
                            <div className="row">
                                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`more-${i}`} />)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CarsHome;
