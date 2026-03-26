import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/auth';
import { sellerAPI } from '../services/apiService';
import '../styles/hero.css';

const BikeSchema = Yup.object().shape({
    brand: Yup.string().min(2).max(50).required('Brand is required'),
    model: Yup.string().min(2).max(50).required('Model is required'),
    year: Yup.number().min(1980).max(new Date().getFullYear() + 1).required('Year is required'),
    price: Yup.number().min(1000).required('Price is required'),
    kmDriven: Yup.number().min(0).required('KM driven is required'),
    location: Yup.string().min(2).required('Location is required'),
    condition: Yup.string().required('Condition is required'),
    description: Yup.string().max(500),
});

const EditBike = () => {
    const [auth] = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [bike, setBike] = useState(null);
    const [loading, setLoading] = useState(true);

    // Image state — split into existing (URLs/base64) and new files
    const [existingImages, setExistingImages] = useState([]); // already saved in DB
    const [newImages, setNewImages] = useState([]);           // File objects
    const [newPreviews, setNewPreviews] = useState([]);       // blob preview URLs

    useEffect(() => {
        fetchBike();
        window.scrollTo(0, 0);
    }, []);

    const fetchBike = async () => {
        const result = await sellerAPI.getBike(id, auth.token);
        if (result.success) {
            setBike(result.data.bike);
            setExistingImages(result.data.bike.images || []);
        } else {
            toast.error(result.message);
            navigate('/dashboard/seller/my-bikes');
        }
        setLoading(false);
    };

    // Remove an already-saved image
    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    // Add new image files
    const handleNewImageChange = (e) => {
        const files = Array.from(e.target.files);
        const totalAfter = existingImages.length + newImages.length + files.length;
        if (totalAfter > 5) {
            toast.error('Maximum 5 images allowed in total');
            return;
        }
        setNewImages(prev => [...prev, ...files]);
        setNewPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    // Remove a newly added (not yet saved) image
    const removeNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setNewPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // Convert new files to base64
            const newBase64s = await Promise.all(
                newImages.map(file => new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                }))
            );

            // Final images = kept existing + new uploads
            const finalImages = [...existingImages, ...newBase64s];

            const result = await sellerAPI.updateBike(id, { ...values, images: finalImages }, auth.token);

            if (result.success) {
                toast.success('Bike updated successfully! 🏍️');
                navigate('/dashboard/seller/my-bikes');
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            console.error(err);
            toast.error('An unexpected error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container my-5 text-center" style={{ paddingTop: '80px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!bike) {
        return (
            <div className="container my-5">
                <div className="alert alert-danger">Bike not found</div>
            </div>
        );
    }

    return (
        <div className="container my-5" style={{ paddingTop: '80px' }}>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <h2 className="mb-1">Edit Bike</h2>
                            <p className="text-muted mb-4">Update your bike details and images</p>

                            <Formik
                                initialValues={{
                                    brand: bike.brand || '',
                                    model: bike.model || '',
                                    year: bike.year || '',
                                    price: bike.price || '',
                                    kmDriven: bike.kmDriven || '',
                                    location: bike.location || '',
                                    condition: bike.condition || 'excellent',
                                    description: bike.description || '',
                                }}
                                validationSchema={BikeSchema}
                                onSubmit={handleSubmit}
                                enableReinitialize
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

                                            {/* ── Image Management ── */}
                                            <div className="col-12 mb-4">
                                                <label className="form-label fw-semibold">
                                                    Bike Images <span className="text-muted small">(max 5 total)</span>
                                                </label>

                                                {/* Existing images */}
                                                {existingImages.length > 0 && (
                                                    <div className="mb-3">
                                                        <p className="text-muted small mb-2">Current images (click ✕ to remove):</p>
                                                        <div className="d-flex flex-wrap gap-2">
                                                            {existingImages.map((src, i) => (
                                                                <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
                                                                    <img
                                                                        src={src}
                                                                        alt={`existing_${i}`}
                                                                        style={{ width: '90px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #aaa' }}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeExistingImage(i)}
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
                                                    </div>
                                                )}

                                                {/* Upload new images */}
                                                {(existingImages.length + newImages.length) < 5 && (
                                                    <label
                                                        className="btn btn-outline-secondary w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                                                        style={{ border: '2px dashed #aaa', borderRadius: '10px', cursor: 'pointer' }}
                                                    >
                                                        📷 Upload More Images ({5 - existingImages.length - newImages.length} remaining)
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={handleNewImageChange}
                                                            hidden
                                                        />
                                                    </label>
                                                )}

                                                {/* New image previews */}
                                                {newPreviews.length > 0 && (
                                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                                        {newPreviews.map((src, i) => (
                                                            <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
                                                                <img
                                                                    src={src}
                                                                    alt={`new_${i}`}
                                                                    style={{ width: '90px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '2px solid blueviolet' }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeNewImage(i)}
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

                                                <p className="text-muted small mt-2">
                                                    Total: {existingImages.length + newImages.length} / 5 images
                                                </p>
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2 mt-2">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="btn btn-lg text-white"
                                                style={{ backgroundColor: 'blueviolet' }}
                                            >
                                                {isSubmitting ? 'Saving...' : 'Save Changes 🏍️'}
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

export default EditBike;
