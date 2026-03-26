import React, { useEffect, useState } from 'react'
import { BiMenuAltRight } from 'react-icons/bi'
import '../styles/navbar.css'
import { Link } from "react-router-dom"
import { useAuth } from '../context/auth'
import { useCart } from '../context/cart'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { toast } from 'react-toastify';

const Navbar = () => {

    const [auth, setAuth] = useAuth();
    const [cart] = useCart()
    const [click, setClick] = useState(false)
    const handleClick = () => setClick(!click)

    const [color, setcolor] = useState(false)

    const changeColor = () => {
        if (window.scrollY >= 90) {
            setcolor(true)
        } else {
            setcolor(false)
        }
    }

    window.addEventListener('scroll', changeColor)

    const handleSubmit = () => {
        setAuth({
            ...auth,
            user: null,
            token: ''
        })
        localStorage.removeItem('auth')
        toast.success('Logged Out Successfully')
    }

    useEffect(() => {
        const navBar = document.querySelectorAll(".nav-link");
        const navCollapse = document.querySelector(".navbar-collapse.collapse");

        const handleNavClick = () => {
            navCollapse.classList.remove("show");
        };

        navBar.forEach((a) => {
            a.addEventListener("click", handleNavClick);
        });

        return () => {
            navBar.forEach((a) => {
                a.removeEventListener("click", handleNavClick);
            });
        };
    }, []);
    return (
        <header className={color ? 'header_wrapper header-scrolled' : 'header_wrapper'}>
            <nav className="navbar navbar-expand-lg fixed-top">
                <div className="container-fluid mx-3">
                    <Link to='/' style={{ textDecoration: 'none' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'linear-gradient(135deg, blueviolet, #9c27b0)',
                            padding: '6px 14px',
                            borderRadius: '30px',
                            boxShadow: '0 2px 10px rgba(138,43,226,0.4)',
                        }}>
                            <span style={{ fontSize: '1.3rem' }}>🏍️</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1 }}>
                                <span style={{ color: 'white' }}>Re</span>
                                <span style={{ color: '#ffd700' }}>Bike</span>
                            </span>
                        </div>
                    </Link>
                    <button className="navbar-toggler pe-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <BiMenuAltRight size={35} />
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav menu-navbar-nav">
                            <Link to='/' className="nav-item nav-link" style={{ textDecoration: 'none' }} aria-current="page">Home</Link>
                            <Link to='/about' className="nav-item nav-link" style={{ textDecoration: 'none' }} aria-current="page">About</Link>
                            <Link to='/brands' className="nav-item nav-link" style={{ textDecoration: 'none' }} aria-current="page">Brands</Link>
                            <Link to='/bikes' className="nav-item nav-link" style={{ textDecoration: 'none' }} aria-current="page">Bikes</Link>
                            <Link to='/cart' style={{ textDecoration: 'none' }} className="nav-item nav-link">
                                <span className="fa"><AiOutlineShoppingCart size={25} color='blueviolet' /></span>
                                <span className='badge' style={{ marginLeft: '3px', paddingBottom: '2px', paddingTop: '1px' }} id='lblCartCount'>{cart?.length}</span>
                            </Link>
                        </ul>

                        {!auth.user ? (<ul className='mt-2 text-center'>
                            <Link to='/login' style={{ textDecoration: 'none' }} className="nav-item nav-link learn-more-btn btn-extra-header">
                                Login
                            </Link>
                            <Link to='/register' style={{ textDecoration: 'none' }} className="nav-item nav-link learn-more-btn">
                                Register
                            </Link>
                        </ul>) : (<ul className='mt-2 text-center'>
                            <Link to={
                                auth?.user?.role === 'admin' 
                                    ? '/dashboard/admin' 
                                    : auth?.user?.role === 'seller' 
                                    ? '/dashboard/seller' 
                                    : '/dashboard/user'
                            } style={{ textDecoration: 'none' }} className="nav-item nav-link learn-more-btn">
                                Dashboard
                            </Link>
                            <Link onClick={handleSubmit} to='/login' style={{ textDecoration: 'none' }} className="nav-item nav-link learn-more-btn-logout">
                                Logout
                            </Link>
                        </ul>)
                        }
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar
