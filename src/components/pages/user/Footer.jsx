import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import "../../../styles/Footer.css";
import logo from "../../../assets/logo.png";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Left Section: Logo and About */}
                <div className="footer-logo">
                    <img src={logo} alt="Service Hub Logo" className="footer-logo-img" />
                    <p className="footer-description">
                        Service Hub provides reliable access to your favorite digital
                        subscriptions — affordable, secure, and hassle-free.
                    </p>
                </div>

                {/* Center Section: Quick Links */}
                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">Products</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>

                {/* Right Section: Contact Info */}
                <div className="footer-contact">
                    <h3>Contact Us</h3>
                    <p>
                        Email:{" "}
                        <a href="mailto:support@servicehub.com">
                            support@servicehub.com
                        </a>
                    </p>
                    <p>Phone: +92 308 4401410</p>

                    {/* Social Icons */}
                    <div className="social-icons">
                        <a
                        href="https://wa.me/+923084401410"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Whatsapp"
                        >
                            <FaWhatsapp />
                        </a>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                        >
                            <FaFacebookF />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                        >
                            <FaTwitter />
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <FaInstagram />
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                        >
                            <FaLinkedinIn />
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Service Hub. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
