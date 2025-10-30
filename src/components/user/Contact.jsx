// import React, { useState } from 'react';
// import api from '../../api/api';
// import '../styles/Contact.css';
// import {
//   FaLinkedin, FaTwitterSquare, FaFacebookSquare, FaInstagramSquare,
//   FaWhatsapp, FaTelegram, FaEnvelope, FaPhoneAlt
// } from 'react-icons/fa';

// const Contact = () => {
//   const [showPopup, setShowPopup] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setShowPopup(true); // Show popup
//     e.target.reset(); // Clear form
//   };

//   const closePopup = () => {
//     setShowPopup(false); // Close popup
//   };

//   const socialLinks = [
//     { icon: <FaLinkedin />, url: 'https://linkedin.com/yourcompany', label: 'LinkedIn' },
//     { icon: <FaTwitterSquare />, url: 'https://twitter.com/yourcompany', label: 'Twitter' },
//     { icon: <FaFacebookSquare />, url: 'https://facebook.com/yourcompany', label: 'Facebook' },
//     { icon: <FaInstagramSquare />, url: 'https://instagram.com/yourcompany', label: 'Instagram' },
//     { icon: <FaWhatsapp />, url: 'https://wa.me/15551234567', label: 'WhatsApp' },
//     { icon: <FaTelegram />, url: 'https://t.me/yourcompany', label: 'Telegram' },
//   ];

//   const contactInfo = [
//     { icon: <FaEnvelope />, detail: 'info@yourcompany.com', type: 'mailto' },
//     { icon: <FaPhoneAlt />, detail: '+1 (555) 123-4567', type: 'tel' },
//   ];

//   return (
//     <>
//       <div className={`contact-page-wrapper ${showPopup ? 'blurred' : ''}`}>
//         <div className="contact-container">

//           {/* Left Column: Contact Form */}
//           <div className="contact-form-side">
//             <h1>Get in Touch</h1>
//             <p>We're here to help and answer any question you might have. We look forward to hearing from you.</p>

//             <form className="contact-form-page" onSubmit={handleSubmit}>
//               <div className="contact-form-group">
//                 <input type="text" id="contact-name" name="name" placeholder=" " required />
//                 <label htmlFor="contact-name">Name</label>
//               </div>

//               <div className="contact-form-group">
//                 <input type="email" id="contact-email" name="email" placeholder=" " required />
//                 <label htmlFor="contact-email">Email</label>
//               </div>

//               <div className="contact-form-group">
//                 <textarea id="contact-message" name="message" rows="5" placeholder=" " required></textarea>
//                 <label htmlFor="contact-message">Message</label>
//               </div>

//               <button type="submit" className="contact-submit-button">Send Message</button>
//             </form>
//           </div>

//           {/* Right Column: Contact Info & Socials */}
//           <div className="contact-info-side">
//             <div className="contact-info-block">
//               <h2>Contact Information</h2>
//               {contactInfo.map((item, index) => (
//                 <div className="info-item" key={index}>
//                   <span className="icon">{item.icon}</span>
//                   <p>
//                     <a href={`${item.type}:${item.detail}`}>{item.detail}</a>
//                   </p>
//                 </div>
//               ))}
//             </div>

//             <div className="social-block">
//               <h2>Connect With Us</h2>
//               <div className="social-links">
//                 {socialLinks.map((link, index) => (
//                   <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
//                     {link.icon}
//                   </a>
//                 ))}
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* Popup */}
//       {showPopup && (
//         <div className="popup-overlay">
//           <div className="popup-message">
//             <div className="popup-tick">
//               <svg viewBox="0 0 60 60">
//                 <circle className="tick-circle" cx="30" cy="30" r="25" fill="none" />
//                 <path className="tick-mark" fill="none" d="M18 30 l10 10 l20 -20" />
//               </svg>
//             </div>

//             <p>Thank you for your message! We will be in touch shortly.</p>
//             <button onClick={closePopup}>Close</button>
//           </div>
//         </div>
//       )}

//     </>
//   );
// };

// export default Contact;


// src/components/Contact.jsx
import React, { useState } from 'react';
import api from '../../api/api';
import '../styles/Contact.css';
import {
  FaLinkedin, FaTwitterSquare, FaFacebookSquare, FaInstagramSquare,
  FaWhatsapp, FaTelegram, FaEnvelope, FaPhoneAlt
} from 'react-icons/fa';

const Contact = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      setLoading(true);
      const res = await api.post('/messages', data); // ✅ Send message to backend
      if (res.data.success) {
        setShowPopup(true);
        e.target.reset();
      }
    } catch (err) {
      alert("Failed to send message. Try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => setShowPopup(false);

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
    <>
      <div className={`contact-page-wrapper ${showPopup ? 'blurred' : ''}`}>
        <div className="contact-container">
          {/* Left Column: Contact Form */}
          <div className="contact-form-side">
            <h1>Get in Touch</h1>
            <p>We're here to help and answer any question you might have. We look forward to hearing from you.</p>

            <form className="contact-form-page" onSubmit={handleSubmit}>
              <div className="contact-form-group">
                <input type="text" id="contact-name" name="name" placeholder=" " required />
                <label htmlFor="contact-name">Name</label>
              </div>

              <div className="contact-form-group">
                <input type="email" id="contact-email" name="email" placeholder=" " required />
                <label htmlFor="contact-email">Email</label>
              </div>

              <div className="contact-form-group">
                <textarea id="contact-message" name="message" rows="5" placeholder=" " required></textarea>
                <label htmlFor="contact-message">Message</label>
              </div>

              <button type="submit" className="contact-submit-button" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Right Column: Contact Info & Socials */}
          <div className="contact-info-side">
            <div className="contact-info-block">
              <h2>Contact Information</h2>
              {contactInfo.map((item, index) => (
                <div className="info-item" key={index}>
                  <span className="icon">{item.icon}</span>
                  <p><a href={`${item.type}:${item.detail}`}>{item.detail}</a></p>
                </div>
              ))}
            </div>

            <div className="social-block">
              <h2>Connect With Us</h2>
              <div className="social-links">
                {socialLinks.map((link, index) => (
                  <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-message">
            <div className="popup-tick">
              <svg viewBox="0 0 60 60">
                <circle className="tick-circle" cx="30" cy="30" r="25" fill="none" />
                <path className="tick-mark" fill="none" d="M18 30 l10 10 l20 -20" />
              </svg>
            </div>

            <p>Thank you for your message! We will be in touch shortly.</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;
