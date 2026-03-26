import React from 'react'
import '../styles/footer.css'
import { BsInstagram, BsWhatsapp } from 'react-icons/bs'

const Footer = () => {
    return (
        <div>
            <section id="contact" className="footer_wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5 footer_logo mb-4 mb-lg-0">
                            <h3 style={{ color: 'blueviolet' }}>ReBike</h3>
                            <p className="footer_text" style={{ textAlign: 'justify' }}>At ReBike, we're dedicated to making your bike buying experience as smooth as the road ahead. With a wide range of brands, expert guidance, secure transactions, and innovative features, we're your trusted partner on your journey to finding the perfect ride. Ride your dreams with ReBike, where your satisfaction is our ultimate destination.</p>
                        </div>
                        <div className="col-lg-4 px-lg-5 mb-4 mb-lg-0">
                            <h3 className="footer_title" style={{ color: 'blueviolet' }}>Contact</h3>
                            <p className="footer_text">
                                <a href="mailto:shahauto2177office@gmail.com" style={{ color: 'white', textDecoration: 'none' }}>
                                    📧 shahauto2177office@gmail.com
                                </a>
                                <br /><br />
                                <span className="footer-address">
                                    📍 Shah Auto, Nr YMCA Club Cross Road,<br />
                                    Sarkhej - Gandhinagar Highway,<br />
                                    Makarba, Ahmedabad,<br />
                                    Gujarat
                                </span>
                            </p>
                        </div>
                        <div className="col-lg-3 mb-4 mb-lg-0">
                            <h3 className="footer_title" style={{ color: 'blueviolet' }}>Social Media</h3>
                            <p className="d-flex gap-3 align-items-center mt-2">
                                <a
                                    href="https://www.instagram.com/shahautohubofficial?igsh=bXh1ZnV6NWMyaDFw"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer_social_media_icon"
                                    style={{ color: '#E1306C' }}
                                    title="Instagram"
                                >
                                    <BsInstagram size={28} />
                                </a>
                                <a
                                    href="https://wa.me/919924442175"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer_social_media_icon"
                                    style={{ color: '#25D366' }}
                                    title="WhatsApp"
                                >
                                    <BsWhatsapp size={28} />
                                </a>
                            </p>
                        </div>
                        <div className="col-12 footer_credits text-center">
                            <span>© {new Date().getFullYear()} <strong>ReBike™</strong> — All Rights Reserved &nbsp;·&nbsp; Designed with ❤️ for Riders</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Footer
