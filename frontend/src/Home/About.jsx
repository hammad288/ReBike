import React from 'react'
import '../styles/about.css'
import about from '../images/aboutUs.png'
import about2 from '../images/aboutUs2.png'

const About = () => {
    return (
        <div>
            <section id="about" className="about_wrapper">
                <div className="container">
                    <div className="row align-items-center" >
                        <div className="col-sm-12 col-lg-5 text-center text-lg-start">
                            <p className="about_number">1</p>
                            <h2 className="about_title">ReBike, where your bike buying journey begins</h2>
                            <p className="about_text " style={{ textAlign: 'justify' }}>At ReBike, we're dedicated to making your bike buying experience as smooth as the road ahead. With a wide range of brands, expert guidance, secure transactions, and innovative features, we're your trusted partner on your journey to finding the perfect ride. Ride your dreams with ReBike, where your satisfaction is our ultimate destination.</p>
                            <div className="my-5">
                                <a className="learn-more-btn" href="#cars">Explore Now</a>
                            </div>
                        </div>
                        <div className="col-sm-12 col-lg-7 text-center text-md-start">
                            <img decoding="async" src={about} className="img-fluid" alt="About ReBike" />
                        </div>
                    </div>
                </div>
                <div className="innovate mt-5">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-sm-12 col-lg-6 px-5 text-center text-md-start">
                                <img decoding="async" src={about2} className="img-fluid" alt="ReBike marketplace" />
                            </div>
                            <div className="col-sm-12 col-lg-6 text-center text-lg-start">
                                <p className="about_number">2</p>
                                <h2 className="about_title">The smartest way to buy or sell a used bike — we understand riders</h2>
                                <p className="about_text" style={{ textAlign: 'justify' }}>We're more than just a marketplace; we're your trusted riding companion. With a deep love for two-wheelers and a dedication to your satisfaction, we've curated a vast selection of verified used bikes to suit every rider and budget. Our mission is to make the bike-buying and selling process transparent and stress-free, giving sellers the tools to list their bikes quickly and giving buyers the confidence to buy securely. Our team is here every step of the way — from your first browse to your final handshake.</p>
                                <div className="mt-5">
                                    <a className="learn-more-btn btn-header" href="#brands">Shop Now</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About
