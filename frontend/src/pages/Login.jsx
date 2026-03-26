import React, { useEffect } from 'react';
import { useAuth } from '../context/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authAPI } from '../services/apiService';
import login from '../images/login.png';
import '../styles/hero.css';
import '../styles/auth.css';

// Validation Schema
const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

const Login = () => {
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const result = await authAPI.login(values);
            
            if (result.success) {
                toast.success(result.data.message || 'Login successful');
                setAuth({
                    ...auth,
                    user: result.data.user,
                    token: result.data.token,
                });
                localStorage.setItem('auth', JSON.stringify(result.data));
                
                // Redirect based on user role
                const userRole = result.data.user.role;
                if (userRole === 'seller') {
                    navigate('/dashboard/seller');
                } else if (userRole === 'admin') {
                    navigate('/dashboard/admin');
                } else {
                    navigate(location.state || '/dashboard/user');
                }
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
        <>
            <div className='marginStyle'>
                <div className="container d-flex justify-content-center align-items-center">
                    <div className="row border rounded-5 p-3 bg-white shadow box-area reverseCol">
                        <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box">
                            <div className="featured-image mb-3 animateImg">
                                <img src={login} className="img-fluid" width={500} alt="Login" />
                            </div>
                        </div>
                        <div className="col-md-6 right-box">
                            <Formik
                                initialValues={{ email: '', password: '' }}
                                validationSchema={LoginSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting }) => (
                                    <Form>
                                        <div className="row align-items-center">
                                            <div className="header-text mb-4">
                                                <h2>Welcome</h2>
                                                <p>We are happy to have you back!</p>
                                            </div>
                                            
                                            <div className="input-group d-flex align-items-center mb-3">
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
                                            
                                            <div className="d-flex flex-row align-items-center mt-4">
                                                <div className="form-outline flex-fill mb-0">
                                                    <button
                                                        className="btn btn-lg text-white"
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        style={{ backgroundColor: 'blueviolet', width: '100%' }}
                                                    >
                                                        {isSubmitting ? 'Logging in...' : 'Login'}
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="d-flex flex-row align-items-center my-3">
                                                <div className="form-outline flex-fill mb-0">
                                                    <Link
                                                        to='/register'
                                                        className="btn btn-outline-dark btn-lg btn-block"
                                                        style={{ width: '100%' }}
                                                    >
                                                        Register
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
        </>
    );
};

export default Login;

