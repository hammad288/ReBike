import React, { useEffect, useState } from 'react'
import { useCart } from '../context/cart';
import { Link } from 'react-router-dom';
import '../styles/brands.css'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { AiOutlineEye } from 'react-icons/ai'
import { BsSpeedometer } from 'react-icons/bs'
import { PiCurrencyInrFill } from 'react-icons/pi'
import { toast } from 'react-toastify';
import { ColorRing } from 'react-loader-spinner'
import axios from 'axios'

const CarsHome = () => {
    const [bikes, setBikes] = useState([]);
    const [cart, setcart] = useCart()
    const [loading, setLoading] = useState(true);

    const getAllBikes = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/bikes/approved`);
            if (data.success) {
                setBikes(data.bikes);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const notify = () => toast.success('Added to Cart Successfully')

    useEffect(() => {
        getAllBikes();
    }, []);

    return (
        <>
            <div className="brand_wrapper" id='bikes'>
                <div className="col-12 text-center">
                    <p className="brand_subtitle">Explore an array of exciting new Bikes !</p>
                    <h2 className="brand_title">Latest Bikes showcase</h2>
                </div>
            </div>
            {loading ?
                <div className="h-100 d-flex align-items-center justify-content-center">
                    <ColorRing
                        visible={true}
                        colors={['#000435', 'rgb(14 165 233)', 'rgb(243 244 246)', '#000435', 'rgb(14 165 233)']}
                    />
                </div>
                :
                <div className="container">
                    <div className="row" style={{ marginTop: '-40px' }}>
                        {bikes.slice(0, 8).map((bike) => (
                            <div key={bike._id} className="col-md-12 col-lg-3 mb-3 mb-lg-0 my-3">
                                <div className="card">
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
                                            <h6 className='respBrand'><BsSpeedometer /> {bike.kmDriven?.toLocaleString()} km</h6>
                                        </div>
                                        <div className='text-center mt-2'>
                                            <Link className='btn my-2' style={{ backgroundColor: 'blueviolet', color: 'white' }} to={`/bike/${bike._id}`}><AiOutlineEye size={20} className='pb-1' /> View</Link>
                                            <button className='btn btn-outline-primary my-2 mx-2' onClick={() => { setcart([...cart, bike]); localStorage.setItem('cart', JSON.stringify([...cart, bike])); notify() }}><AiOutlineShoppingCart size={20} className='pb-1' /> Add To Cart</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* <div className="col-12 text-center my-5">
                        <Link to='/bikes' className='btn btn-lg text-white' style={{ backgroundColor: 'blueviolet' }}>
                            View More 🏍️
                        </Link>
                    </div> */}
                </div>
            }
        </>
    )
}

export default CarsHome