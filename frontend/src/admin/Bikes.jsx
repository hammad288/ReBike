import React, { useEffect, useState, useCallback } from 'react'
import AdminMenu from './AdminMenu'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'
import { PiCurrencyInrFill } from 'react-icons/pi'
import { BsSpeedometer } from 'react-icons/bs'
import { useAuth } from '../context/auth';
import api from '../services/apiService';

const PAGE_SIZE = 12;

const SkeletonCard = () => (
    <div className="col-md-12 col-lg-4 mb-3 my-3">
        <div className="skeleton-card p-0">
            <div className="d-flex justify-content-between p-3">
                <div className="skeleton-block skeleton-line" style={{ width: '40%', margin: 0 }} />
                <div className="skeleton-block" style={{ height: 20, width: 60, borderRadius: 12 }} />
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

const Bikes = () => {
    const [auth] = useAuth();
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPage = useCallback(async (pageNum, append = false) => {
        if (append) setLoadingMore(true); else setLoading(true);
        try {
            const res = await api.get(
                `/api/bikes/admin/all?withImages=true&page=${pageNum}&limit=${PAGE_SIZE}`
            );
            if (res.data?.success) {
                const fetched = res.data.bikes || [];
                setBikes(prev => append ? [...prev, ...fetched] : fetched);
                setHasMore(res.data.currentPage < res.data.totalPages);
            }
        } catch (err) {
            toast.error('Error loading bikes');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        if (auth?.token) fetchPage(1);
        window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth?.token]);

    const handleLoadMore = () => {
        const next = page + 1;
        setPage(next);
        fetchPage(next, true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this bike?')) return;
        try {
            await api.delete(`/api/bikes/admin/${id}`);
            toast.success('Bike Deleted Successfully');
            setBikes(prev => prev.filter(b => b._id !== id));
        } catch (err) {
            toast.error('Error deleting bike');
        }
    };

    const getStatusBadge = (status) => {
        const colors = { approved: 'success', pending: 'warning', rejected: 'danger' };
        return <span className={`badge bg-${colors[status] || 'secondary'}`}>{status}</span>;
    };

    return (
        <div className='container marginStyle'>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1 className="text-center my-3">
                            All Bikes List {!loading && `(${bikes.length}${hasMore ? '+' : ''})`}
                        </h1>

                        {loading ? (
                            <div className="row">
                                {Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        ) : bikes.length === 0 ? (
                            <p className="text-center text-muted mt-5">No bikes found.</p>
                        ) : (
                            <>
                                <div className="row">
                                    {bikes.map((bike) => (
                                        <div key={bike._id} className="col-md-12 col-lg-4 mb-lg-0 my-3">
                                            <div className="card h-100">
                                                <div className="d-flex justify-content-between align-items-center p-3">
                                                    <p className="lead mb-0 fw-bold">{bike.brand}</p>
                                                    {getStatusBadge(bike.status)}
                                                </div>
                                                {bike.images && bike.images[0] && (
                                                    <div className="text-center px-3">
                                                        <img
                                                            src={bike.images[0]}
                                                            alt={bike.model}
                                                            className='border rounded img-fluid'
                                                            style={{ maxHeight: '120px', objectFit: 'contain' }}
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                )}
                                                <div className="card-body">
                                                    <h5 className="text-center mb-2">{bike.brand} {bike.model} ({bike.year})</h5>
                                                    <div className="d-flex justify-content-between">
                                                        <h6><PiCurrencyInrFill /> {bike.price?.toLocaleString()}</h6>
                                                        <h6><BsSpeedometer /> {bike.kmDriven?.toLocaleString()} km</h6>
                                                    </div>
                                                    <p className="text-muted small mb-2">📍 {bike.location} &nbsp;|&nbsp; 🏷️ {bike.condition}</p>
                                                    <div className='text-center my-2'>
                                                        <Link
                                                            to={`/dashboard/admin/update-bike/${bike._id}`}
                                                            className='btn btn-primary mt-2 mx-2'
                                                        >
                                                            Update
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(bike._id)}
                                                            className='btn btn-danger mt-2'
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {loadingMore && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`more-${i}`} />)}
                                </div>

                                {hasMore && !loadingMore && (
                                    <div className="text-center my-4">
                                        <button className="load-more-btn" onClick={handleLoadMore}>
                                            Load More Bikes
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bikes;
