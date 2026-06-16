import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authAPI } from '../services/apiService';
import register from '../images/register.png';
import '../styles/hero.css';

const RegisterSchema = (role) => Yup.object().shape({
    name: Yup.string().min(2).max(50).required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6).max(50).required('Password is required'),
    role: Yup.string().oneOf(['user', 'seller']).required('Role is required'),
    phone: role === 'seller'
        ? Yup.string()
            .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit mobile number')
            .required('Phone number is required for sellers')
        : Yup.string()
            .matches(/^[0-9]{10}$|^$/, 'Enter a valid 10-digit mobile number'),
});

const Register = () => {
    const navigate = useNavigate();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const result = await authAPI.register(values);
            
            if (result.success) {
                toast.success(result.data.message || 'Registration successful');
                navigate('/login');
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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            <div className='marginStyle'>
                <div className="container d-flex justify-content-center align-items-center">
                    <div className="row border rounded-5 p-3 bg-white shadow box-area reverseCol">
                        <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box">
                            <div className="featured-image mb-3 animateImg">
                                <img src={register} className="img-fluid" width={500} alt="Register" />
                            </div>
                        </div>
                        <div className="col-md-6 right-box">
                            <Formik
                                initialValues={{ name: '', email: '', password: '', role: 'user', phone: '' }}
                                validate={(vals) => {
                                    let errors = {};
                                    try { RegisterSchema(vals.role).validateSync(vals, { abortEarly: false }); }
                                    catch (e) { e.inner?.forEach(err => { errors[err.path] = err.message; }); }
                                    return errors;
                                }}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting, values, setFieldValue }) => (
                                    <Form>
                                        <div className="row align-items-center">
                                            <div className="header-text mb-4">
                                                <h2>Welcome</h2>
                                                <p>Your Dream Bike is Waiting!</p>
                                            </div>
                                            
                                            <div className="input-group d-flex align-items-center mb-3">
                                                <div className="form-outline flex-fill mb-0">
                                                    <Field
                                                        name="name"
                                                        type="text"
                                                        placeholder="Your name"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage
                                                        name="name"
                                                        component="div"
                                                        className="text-danger small mt-1"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="input-group d-flex flex-row align-items-center mb-3">
                                                <div className="form-outline flex-fill mb-0">
                                                    <Field
                                                        name="email"
                                                        type="email"
                                                        placeholder="Your email ID"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage
                                                        name="email"
                                                        component="div"
                                                        className="text-danger small mt-1"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="input-group d-flex flex-row align-items-center mb-3">
                                                <div className="form-outline flex-fill mb-0">
                                                    <Field
                                                        name="password"
                                                        type="password"
                                                        placeholder="Your password"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage
                                                        name="password"
                                                        component="div"
                                                        className="text-danger small mt-1"
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* Phone — only for sellers */}
                                            {/* Phone — always visible, required for sellers */}
                                            <div className="input-group d-flex flex-row align-items-center mb-3">
                                                <div className="form-outline flex-fill mb-0">
                                                    <Field
                                                        name="phone"
                                                        type="tel"
                                                        placeholder="📱 Your 10-digit mobile number"
                                                        className="form-control"
                                                        maxLength={10}
                                                    />
                                                    <ErrorMessage name="phone" component="div" className="text-danger small mt-1" />
                                                    <small className="text-muted">
                                                        {values.role === 'seller'
                                                            ? '⚠️ Required — buyers will contact you on this number'
                                                            : 'Optional — needed to receive order confirmation SMS'}
                                                    </small>
                                                </div>
                                            </div>

                                            {/* Role selector */}
                                            <div className="input-group d-flex flex-row align-items-center mb-3">
                                                <div className="form-outline flex-fill mb-0">
                                                    <Field as="select" name="role" className="form-control"
                                                        onChange={(e) => {
                                                            setFieldValue('role', e.target.value);
                                                            setFieldValue('phone', ''); // reset phone on role change
                                                        }}
                                                    >
                                                        <option value="user">Register as User</option>
                                                        <option value="seller">Register as Seller</option>
                                                    </Field>
                                                    <ErrorMessage name="role" component="div" className="text-danger small mt-1" />
                                                </div>
                                            </div>
                                            
                                            <div className="d-flex flex-row align-items-center mt-4">
                                                <div className="form-outline flex-fill mb-0">
                                                    <button
                                                        className="btn btn-lg text-white"
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        style={{ backgroundColor: 'blueviolet', width: '100%' }}
                                                    >
                                                        {isSubmitting ? 'Registering...' : 'Register'}
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="d-flex flex-row align-items-center my-3">
                                                <div className="form-outline flex-fill mb-0">
                                                    <Link
                                                        to='/login'
                                                        className="btn btn-outline-dark btn-lg btn-block"
                                                        style={{ width: '100%' }}
                                                    >
                                                        Login
                                                    </Link>
                                                </div>
                                            </div>
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

export default Register;

