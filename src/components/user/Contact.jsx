// src/components/ContactUs.jsx
import React from 'react';
import '../styles/Contact.css';
import {
  FaLinkedin,
  FaTwitterSquare,
  FaFacebookSquare,
  FaInstagramSquare,
  FaEnvelope,
  FaPhoneAlt,
  FaWhatsapp,
  FaTelegram,

} from 'react-icons/fa';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will be in touch shortly.');
    e.target.reset();
  };

  const socialLinks = [
    { icon: <FaLinkedin />, url: 'https://linkedin.com/yourcompany', label: 'LinkedIn' },
    { icon: <FaTwitterSquare />, url: 'https://twitter.com/yourcompany', label: 'Twitter' },
    { icon: <FaFacebookSquare />, url: 'https://facebook.com/yourcompany', label: 'Facebook' },
    { icon: <FaInstagramSquare />, url: 'https://instagram.com/yourcompany', label: 'Instagram' },
    { icon: <FaWhatsapp />, url: 'https://wa.me/15551234567', label: 'WhatsApp' },
    { icon: <FaTelegram />, url: 'https://t.me/yourcompany', label: 'Telegram' },
  ];

  const contactInfo = [
    { icon: <FaEnvelope />, detail: 'info@yourcompany.com', type: 'mailto' },
    { icon: <FaPhoneAlt />, detail: '+1 (555) 123-4567', type: 'tel' },
  ];

  return (
    <div className="contact-page-wrapper">
      <div className="contact-container">

        {/* Left Column: Contact Form */}
        <div className="contact-form-side">
          <h1>Get in Touch</h1>
          <p>We're here to help and answer any question you might have. We look forward to hearing from you.</p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <button type="submit" className="submit-button">Send Message</button>
          </form>
        </div>

        {/* Right Column: Info and Social Media */}
        <div className="contact-info-side">
          <div className="info-block">
            <h2>Contact Information</h2>
            {contactInfo.map((item, index) => (
              <div className="info-item" key={index}>
                <span className="icon">{item.icon}</span>
                {item.type === 'text' ? (
                  <p>{item.detail}</p>
                ) : (
                  <p><a href={`${item.type}:${item.detail}`}>{item.detail}</a></p>
                )}
              </div>
            ))}
          </div>

          <div className="social-block">
            <h2>Connect With Us</h2>
            <div className="social-links">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="social-icon"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
