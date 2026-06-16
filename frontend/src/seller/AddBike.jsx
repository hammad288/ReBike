import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/auth';
import { sellerAPI } from '../services/apiService';
import '../styles/hero.css';
import compressImage from '../utils/compressImage';

// Validation Schema
const BikeSchema = Yup.object().shape({
    brand: Yup.string()
        .min(2, 'Brand must be at least 2 characters')
        .max(50, 'Brand must not exceed 50 characters')
        .required('Brand is required'),
    model: Yup.string()
        .min(2, 'Model must be at least 2 characters')
        .max(50, 'Model must not exceed 50 characters')
        .required('Model is required'),
    year: Yup.number()
        .min(1980, 'Year must be 1980 or later')
        .max(new Date().getFullYear() + 1, 'Invalid year')
        .required('Year is required'),
    price: Yup.number()
        .min(1000, 'Price must be at least 1000')
        .required('Price is required'),
    kmDriven: Yup.number()
        .min(0, 'KM driven cannot be negative')
        .required('KM driven is required'),
    location: Yup.string()
        .min(2, 'Location must be at least 2 characters')
        .required('Location is required'),
    condition: Yup.string()
        .required('Condition is required'),
    description: Yup.string()
        .max(500, 'Description must not exceed 500 characters'),
});

const MIN_IMAGES = 3;
const MAX_IMAGES = 5;

const AddBike = () => {
    const [auth] = useAuth();
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [imageError, setImageError] = useState('');

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const total = images.length + files.length;
        if (total > MAX_IMAGES) {
            setImageError(`Maximum ${MAX_IMAGES} images allowed.`);
            return;
        }
        setImages(prev => [...prev, ...files]);
        setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
        // Clear error once minimum is met
        if (images.length + files.length >= MIN_IMAGES) setImageError('');
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        if (newImages.length < MIN_IMAGES) {
            setImageError(`Please upload at least ${MIN_IMAGES} images of the product.`);
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        // Block submit if fewer than minimum images
        if (images.length < MIN_IMAGES) {
            setImageError(`Please upload at least ${MIN_IMAGES} images of the product.`);
            setSubmitting(false);
            return;
        }
        try {
            // Always read token fresh from localStorage to avoid auth context race condition
            let token = auth?.token;
            if (!token) {
                const stored = localStorage.getItem('auth');
                if (stored) {
                    token = JSON.parse(stored).token;
                }
            }

            if (!token) {
                toast.error('You are not logged in. Please login again.');
                setSubmitting(false);
                return;
            }

            // Compress each image to ≤1024px JPEG @ 75% quality before base64
            // This keeps the MongoDB document well under the 16MB limit
            const imageBase64s = await Promise.all(
                images.map(file => compressImage(file, 1024, 0.75))
            );

            const totalKB = Math.round(imageBase64s.reduce((sum, b64) => sum + b64.length, 0) / 1024);
            console.log(`Submitting ${imageBase64s.length} images, total ~${totalKB} KB`);

            const bikePayload = { ...values, images: imageBase64s };
            const result = await sellerAPI.addBike(bikePayload, token);

            console.log('API result:', result);

            if (result.success) {
                const newBikeId = result.data?.bike?._id;
                toast.success(result.data.message || 'Bike added! Please complete vehicle verification.');
                if (newBikeId) {
                    navigate(`/dashboard/seller/verify-bike/${newBikeId}`);
                } else {
                    navigate('/dashboard/seller/my-bikes');
                }
            } else {
                // Show exact error from backend
                toast.error(result.message || 'Failed to add bike.');
                console.error('Backend error:', result.message);
            }
        } catch (err) {
            console.error('Submit error:', err);
            toast.error('An unexpected error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="container my-5" style={{ paddingTop: '80px' }}>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <h2 className="mb-1">Add New Bike</h2>
                            <p className="text-muted mb-4">Fill in the details to list your bike for sale</p>

                            <Formik
                                initialValues={{
                                    brand: '',
                                    model: '',
                                    year: '',
                                    price: '',
                                    kmDriven: '',
                                    location: '',
                                    condition: 'excellent',
                                    description: '',
                                }}
                                validationSchema={BikeSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting }) => (
                                    <Form>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Brand *</label>
                                                <Field name="brand" type="text" placeholder="e.g., Honda, Yamaha" className="form-control" />
                                                <ErrorMessage name="brand" component="div" className="text-danger small mt-1" />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Model *</label>
                                                <Field name="model" type="text" placeholder="e.g., CB Shine, FZ" className="form-control" />
                                                <ErrorMessage name="model" component="div" className="text-danger small mt-1" />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Year *</label>
                                                <Field name="year" type="number" placeholder="e.g., 2020" className="form-control" />
                                                <ErrorMessage name="year" component="div" className="text-danger small mt-1" />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Price (₹) *</label>
                                                <Field name="price" type="number" placeholder="e.g., 45000" className="form-control" />
                                                <ErrorMessage name="price" component="div" className="text-danger small mt-1" />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">KM Driven *</label>
                                                <Field name="kmDriven" type="number" placeholder="e.g., 15000" className="form-control" />
                                                <ErrorMessage name="kmDriven" component="div" className="text-danger small mt-1" />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Location *</label>
                                                <Field name="location" type="text" placeholder="e.g., Mumbai, Delhi" className="form-control" />
                                                <ErrorMessage name="location" component="div" className="text-danger small mt-1" />
                                            </div>

                                            <div className="col-12 mb-3">
                                                <label className="form-label">Condition *</label>
                                                <Field as="select" name="condition" className="form-control">
                                                    <option value="excellent">Excellent</option>
                                                    <option value="good">Good</option>
                                                    <option value="fair">Fair</option>
                                                </Field>
                                                <ErrorMessage name="condition" component="div" className="text-danger small mt-1" />
                                            </div>

                                            <div className="col-12 mb-3">
                                                <label className="form-label">Description</label>
                                                <Field as="textarea" name="description" rows="4" placeholder="Additional details about the bike..." className="form-control" />
                                                <ErrorMessage name="description" component="div" className="text-danger small mt-1" />
                                            </div>

                                            {/* ── Image Upload ── */}
                                            <div className="col-12 mb-4">
                                                <label className="form-label fw-semibold">
                                                    📸 Bike Images{' '}
                                                    <span className="text-danger">*</span>
                                                    <span className="text-muted small ms-1">(min 3, up to {MAX_IMAGES})</span>
                                                </label>

                                                {/* Progress indicator */}
                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                    {[...Array(MAX_IMAGES)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            style={{
                                                                width: '36px', height: '8px', borderRadius: '4px',
                                                                background: i < images.length
                                                                    ? (i < MIN_IMAGES ? 'blueviolet' : '#4ade80')
                                                                    : (i < MIN_IMAGES ? '#fca5a5' : '#ddd'),
                                                                transition: 'background 0.3s'
                                                            }}
                                                        />
                                                    ))}
                                                    <span className="text-muted small">{images.length} / {MAX_IMAGES} &nbsp;
                                                        {images.length >= MIN_IMAGES
                                                            ? <span style={{ color: 'green' }}>✓ minimum met</span>
                                                            : <span style={{ color: '#dc3545' }}>{MIN_IMAGES - images.length} more required</span>
                                                        }
                                                    </span>
                                                </div>

                                                {/* Upload button — hidden once max reached */}
                                                {images.length < MAX_IMAGES && (
                                                    <label
                                                        className="btn btn-outline-secondary w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                                                        style={{
                                                            border: `2px dashed ${imageError ? '#dc3545' : '#aaa'}`,
                                                            borderRadius: '10px', cursor: 'pointer'
                                                        }}
                                                    >
                                                        📷 Click to Upload Images
                                                        {images.length < MIN_IMAGES
                                                            ? ` (${MIN_IMAGES - images.length} more required)`
                                                            : ` (${images.length}/${MAX_IMAGES} — optional)`
                                                        }
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={handleImageChange}
                                                            hidden
                                                        />
                                                    </label>
                                                )}

                                                {/* Validation error */}
                                                {imageError && (
                                                    <div className="text-danger small mt-1">
                                                        ⚠️ {imageError}
                                                    </div>
                                                )}

                                                {/* Previews */}
                                                {imagePreviews.length > 0 && (
                                                    <div className="d-flex flex-wrap gap-2 mt-3">
                                                        {imagePreviews.map((src, i) => (
                                                            <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
                                                                <img
                                                                    src={src}
                                                                    alt={`preview_${i}`}
                                                                    style={{
                                                                        width: '90px', height: '80px', objectFit: 'cover',
                                                                        borderRadius: '8px',
                                                                        border: `2px solid ${i < images.length ? 'blueviolet' : '#ddd'}`
                                                                    }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeImage(i)}
                                                                    style={{
                                                                        position: 'absolute', top: '-8px', right: '-8px',
                                                                        background: 'red', color: 'white', border: 'none',
                                                                        borderRadius: '50%', width: '22px', height: '22px',
                                                                        fontSize: '12px', cursor: 'pointer', lineHeight: 1
                                                                    }}
                                                                >✕</button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Minimum met confirmation */}
                                                {images.length >= MIN_IMAGES && (
                                                    <div className="text-success small mt-2 fw-semibold">
                                                        ✅ {images.length} image{images.length > 1 ? 's' : ''} uploaded
                                                        {images.length < MAX_IMAGES ? ` — you can add ${MAX_IMAGES - images.length} more (optional)` : ' — maximum reached!'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2 mt-2">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting || images.length < MIN_IMAGES}
                                                className="btn btn-lg text-white"
                                                style={{
                                                    backgroundColor: images.length >= MIN_IMAGES ? 'blueviolet' : '#b0a0d8',
                                                    cursor: images.length < MIN_IMAGES ? 'not-allowed' : 'pointer'
                                                }}
                                                onClick={() => {
                                                    if (images.length < MIN_IMAGES)
                                                        setImageError(`Please upload at least ${MIN_IMAGES} images of the product.`);
                                                }}
                                            >
                                                {isSubmitting ? 'Adding Bike...' : `Add Bike 🏍️${images.length < MIN_IMAGES ? ` (${images.length}/${MIN_IMAGES} required)` : ''}`}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => navigate('/dashboard/seller/my-bikes')}
                                                className="btn btn-lg btn-outline-secondary"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBike;
