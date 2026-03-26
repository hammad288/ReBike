import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authAPI } from '../services/apiService';
import register from '../images/register.png';
import '../styles/hero.css';

// Validation Schema matching backend User model (name, email, password only)
const RegisterSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must not exceed 50 characters')
        .required('Name is required'),
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .max(50, 'Password must not exceed 50 characters')
        .required('Password is required'),
    role: Yup.string()
        .oneOf(['user', 'seller'], 'Invalid role')
        .required('Role is required'),
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
                                initialValues={{ name: '', email: '', password: '', role: 'user' }}
                                validationSchema={RegisterSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting }) => (
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
                                            
                                            <div className="input-group d-flex flex-row align-items-center mb-3">
                                                <div className="form-outline flex-fill mb-0">
                                                    <Field as="select" name="role" className="form-control">
                                                        <option value="user">Register as User</option>
                                                        <option value="seller">Register as Seller</option>
                                                    </Field>
                                                    <ErrorMessage
                                                        name="role"
                                                        component="div"
                                                        className="text-danger small mt-1"
                                                    />
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

