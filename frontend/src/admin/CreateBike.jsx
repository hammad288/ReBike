import React, { useState, useEffect } from 'react';
import AdminMenu from './AdminMenu';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from './Loading';

const CreateBike = () => {
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [price, setPrice] = useState('');
    const [kmDriven, setKmDriven] = useState('');
    const [location, setLocation] = useState('');
    const [condition, setCondition] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const validateForm = () => {
        if (!brand.trim()) { toast.error('Bike Brand is required'); return false; }
        if (!model.trim()) { toast.error('Bike Model is required'); return false; }
        if (!year.trim()) { toast.error('Year is required'); return false; }
        if (!price.trim()) { toast.error('Price is required'); return false; }
        if (!kmDriven.trim()) { toast.error('KM Driven is required'); return false; }
        if (!location.trim()) { toast.error('Location is required'); return false; }
        if (!condition.trim()) { toast.error('Condition is required'); return false; }
        if (!description.trim()) { toast.error('Description is required'); return false; }
        return true;
    };

    const handleImageChange = (e) => {
        setImages(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            setLoading(true);
            const bikeData = new FormData();
            bikeData.append('brand', brand);
            bikeData.append('model', model);
            bikeData.append('year', year);
            bikeData.append('price', price);
            bikeData.append('kmDriven', kmDriven);
            bikeData.append('location', location);
            bikeData.append('condition', condition);
            bikeData.append('description', description);
            images.forEach((img) => bikeData.append('images', img));

            const { data } = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/bikes/admin/create`,
                bikeData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (data.success) {
                toast.success('Bike Created Successfully');
                navigate('/dashboard/admin/bikes');
            } else {
                toast.error(data.message || 'Error creating bike');
            }
        } catch (err) {
            console.log(err);
            toast.error('Error creating bike');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container marginStyle'>
            {!loading ? (
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-md-3'>
                            <AdminMenu />
                        </div>
                        <div className='col-md-9 my-3'>
                            <h1 className='text-center'>Create Bike</h1>
                            <div className='m-1'>
                                {/* Image preview */}
                                {images.length > 0 && (
                                    <div className='mb-3 d-flex flex-wrap gap-2'>
                                        {images.map((img, i) => (
                                            <img
                                                key={i}
                                                src={URL.createObjectURL(img)}
                                                alt={`bike_image_${i}`}
                                                className='img-thumbnail'
                                                style={{ maxHeight: '100px', objectFit: 'contain' }}
                                            />
                                        ))}
                                    </div>
                                )}
                                <div className='mb-3'>
                                    <label className='btn btn-outline-primary col-md-12'>
                                        Upload Bike Images
                                        <input
                                            type='file'
                                            accept='image/*'
                                            multiple
                                            onChange={handleImageChange}
                                            hidden
                                        />
                                    </label>
                                </div>
                                <div className='mb-3'>
                                    <input type='text' value={brand} placeholder='Bike Brand (e.g. Honda, Yamaha)' className='form-control' onChange={(e) => setBrand(e.target.value)} required />
                                </div>
                                <div className='mb-3'>
                                    <input type='text' value={model} placeholder='Bike Model (e.g. CBR 150R)' className='form-control' onChange={(e) => setModel(e.target.value)} required />
                                </div>
                                <div className='mb-3'>
                                    <input type='number' value={year} placeholder='Manufacturing Year (e.g. 2021)' className='form-control' onChange={(e) => setYear(e.target.value)} required />
                                </div>
                                <div className='mb-3'>
                                    <input type='number' value={price} placeholder='Price in ₹ (numbers only)' className='form-control' onChange={(e) => setPrice(e.target.value)} required />
                                </div>
                                <div className='mb-3'>
                                    <input type='number' value={kmDriven} placeholder='KM Driven' className='form-control' onChange={(e) => setKmDriven(e.target.value)} required />
                                </div>
                                <div className='mb-3'>
                                    <input type='text' value={location} placeholder='Location (e.g. Mumbai, Maharashtra)' className='form-control' onChange={(e) => setLocation(e.target.value)} required />
                                </div>
                                <div className='mb-3'>
                                    <select className='form-select' value={condition} onChange={(e) => setCondition(e.target.value)} required>
                                        <option value=''>Select Bike Condition</option>
                                        <option value='Excellent'>Excellent</option>
                                        <option value='Good'>Good</option>
                                        <option value='Fair'>Fair</option>
                                        <option value='Poor'>Poor</option>
                                    </select>
                                </div>
                                <div className='mb-3'>
                                    <textarea rows={3} value={description} placeholder='Bike Description' className='form-control' onChange={(e) => setDescription(e.target.value)} required />
                                </div>
                                <div className='mb-3'>
                                    <button className='btn btn-success' onClick={handleSubmit}>
                                        Create Bike
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : <Loading />}
        </div>
    );
};

export default CreateBike;
