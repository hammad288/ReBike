import React, { useEffect, useState } from 'react';
import AdminMenu from './AdminMenu';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdateBike = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [price, setPrice] = useState('');
    const [kmDriven, setKmDriven] = useState('');
    const [location, setLocation] = useState('');
    const [condition, setCondition] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');

    const getSingleBike = async () => {
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/bikes/${params.id}`
            );
            if (data.success) {
                const b = data.bike;
                setBrand(b.brand || '');
                setModel(b.model || '');
                setYear(b.year || '');
                setPrice(b.price || '');
                setKmDriven(b.kmDriven || '');
                setLocation(b.location || '');
                setCondition(b.condition || '');
                setDescription(b.description || '');
                setStatus(b.status || 'pending');
            }
        } catch (err) {
            console.log(err);
            toast.error('Error loading bike details');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/bikes/admin/update/${params.id}`,
                { brand, model, year, price, kmDriven, location, condition, description, status }
            );
            if (data.success) {
                toast.success('Bike Updated Successfully');
                navigate('/dashboard/admin/bikes');
            } else {
                toast.error(data.message || 'Error updating bike');
            }
        } catch (err) {
            console.log(err);
            toast.error('Error updating bike');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this bike?')) return;
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/bikes/admin/${params.id}`);
            toast.success('Bike Deleted Successfully');
            navigate('/dashboard/admin/bikes');
        } catch (err) {
            console.log(err);
            toast.error('Error deleting bike');
        }
    };

    useEffect(() => {
        getSingleBike();
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='container marginStyle'>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9 my-3'>
                        <h1 className='text-center'>Update Bike</h1>
                        <div className='m-1'>
                            <div className='mb-3'>
                                <input type='text' value={brand} placeholder='Bike Brand' className='form-control' onChange={(e) => setBrand(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <input type='text' value={model} placeholder='Bike Model' className='form-control' onChange={(e) => setModel(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <input type='number' value={year} placeholder='Manufacturing Year' className='form-control' onChange={(e) => setYear(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <input type='number' value={price} placeholder='Price in ₹' className='form-control' onChange={(e) => setPrice(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <input type='number' value={kmDriven} placeholder='KM Driven' className='form-control' onChange={(e) => setKmDriven(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <input type='text' value={location} placeholder='Location' className='form-control' onChange={(e) => setLocation(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <select className='form-select' value={condition} onChange={(e) => setCondition(e.target.value)}>
                                    <option value=''>Select Condition</option>
                                    <option value='Excellent'>Excellent</option>
                                    <option value='Good'>Good</option>
                                    <option value='Fair'>Fair</option>
                                    <option value='Poor'>Poor</option>
                                </select>
                            </div>
                            <div className='mb-3'>
                                <select className='form-select' value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value='pending'>Pending</option>
                                    <option value='approved'>Approved</option>
                                    <option value='rejected'>Rejected</option>
                                </select>
                            </div>
                            <div className='mb-3'>
                                <textarea rows={3} value={description} placeholder='Bike Description' className='form-control' onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <button className='btn btn-success mx-2' onClick={handleSubmit}>Update Bike</button>
                                <button className='btn btn-danger' onClick={handleDelete}>Delete Bike</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateBike;
