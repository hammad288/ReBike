import React, { useEffect, useState } from 'react'
import AdminMenu from './AdminMenu'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ColorRing } from 'react-loader-spinner'
import { PiCurrencyInrFill } from 'react-icons/pi'
import { BsSpeedometer } from 'react-icons/bs'

const Bikes = () => {

    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAllBikes = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/bikes/admin/all`);
            if (data.success) {
                setBikes(data.bikes);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/api/bikes/admin/${id}`);
            if (data.message) {
                toast.success('Bike Deleted Successfully');
                getAllBikes();
            }
        } catch (err) {
            console.log(err);
            toast.error('Error in Deleting Bike');
        }
    };

    useEffect(() => {
        getAllBikes();
        window.scrollTo(0, 0);
    }, []);

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
                        <h1 className="text-center my-3">All Bikes List</h1>
                        {loading ?
                            <div className="h-100 d-flex align-items-center justify-content-center">
                                <ColorRing
                                    visible={true}
                                    colors={['#000435', 'rgb(14 165 233)', 'rgb(243 244 246)', '#000435', 'rgb(14 165 233)']}
                                />
                            </div>
                            :
                            bikes.length === 0 ? (
                                <p className="text-center text-muted mt-5">No bikes found.</p>
                            ) : (
                                <div className="row" style={{ marginTop: '0px' }}>
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
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bikes;
