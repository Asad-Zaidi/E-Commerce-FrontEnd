import React, { useState, useEffect, useRef } from "react";
import SEO from "../../components/SEO.jsx";
import seoData from "../../seoData";
import { FaWhatsapp, FaEnvelope, FaPhoneAlt, FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaTelegram } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import api from "../../api/api";
import { useForm, ValidationError } from "@formspree/react";

const Contact = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [contactData, setContactData] = useState({
    title: 'Get in Touch',
    description: "We're here to help and answer any questions you might have. Reach out to us anytime.",
    email: 'info@yourcompany.com',
    phone: '+92 308 4401410',
    socials: {
      linkedin: 'https://linkedin.com/yourcompany',
      twitter: 'https://twitter.com/yourcompany',
      facebook: 'https://facebook.com/yourcompany',
      instagram: 'https://instagram.com/yourcompany',
      whatsapp: 'https://wa.me/15551234567',
      telegram: 'https://t.me/yourcompany',
    }
  });

  const formId = process.env.REACT_APP_FORMSPREE_FORM_ID || "YOUR_FORMSPREE_FORM_ID";
  const formRef = useRef(null);
  const [formState, formSubmit] = useForm(formId);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const res = await api.get("/contact");
        if (res.data) {
          setContactData(res.data);
        }
      } catch (err) {
        console.error("Error fetching contact data:", err);
        toast.error("Failed to load contact information");
      }
    };
    fetchContactData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formEl = formRef.current;
    if (!formEl) return;

    const formData = new FormData(formEl);
    if (formData.get("company")) return; // honeypot guard

    await formSubmit(e);
  };

  useEffect(() => {
    if (formState.succeeded) {
      toast.success("Message sent successfully! We'll get back to you soon.");
      formRef.current?.reset();
    }
    if (formState.errors?.length) {
      toast.error("Failed to send message. Please try again later.");
    }
  }, [formState.succeeded, formState.errors]);

  const closePopup = () => setShowPopup(false);

  const socialLinks = [
    { icon: <FaLinkedin />, url: contactData.socials.linkedin, label: "LinkedIn" },
    { icon: <FaTwitter />, url: contactData.socials.twitter, label: "Twitter" },
    { icon: <FaFacebook />, url: contactData.socials.facebook, label: "Facebook" },
    { icon: <FaInstagram />, url: contactData.socials.instagram, label: "Instagram" },
    { icon: <FaWhatsapp />, url: contactData.socials.whatsapp, label: "WhatsApp" },
    { icon: <FaTelegram />, url: contactData.socials.telegram, label: "Telegram" },
  ];

  const contactInfo = [
    { icon: <FaEnvelope />, detail: contactData.email, type: "mailto" },
    { icon: <FaPhoneAlt />, detail: contactData.phone, type: "tel" },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <SEO {...seoData.contact} />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center px-4 py-12 relative"
      >
        <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-4 text-center">
          {contactData.title}
        </motion.h1>
        <motion.p variants={fadeUp} className="text-center mb-10 max-w-2xl">
          {contactData.description}
        </motion.p>

        <div className="flex flex-col md:flex-row w-full max-w-6xl gap-8">
          {/* Form */}
          <motion.form
            ref={formRef}
            variants={fadeUp}
            onSubmit={handleSubmit}
            className="flex-1 bg-gray-800 p-8 rounded-xl shadow-lg space-y-6"
          >
            {/* Honeypot */}
            <input type="text" name="company" autoComplete="off" tabIndex="-1" className="hidden" />

            <motion.div variants={fadeUp} className="relative">
              <input
                type="text"
                name="name"
                required
                className="peer w-full p-3 rounded bg-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder=" "
              />
              <label className="absolute left-3 top-2 text-gray-400 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-green-400 text-sm transition-all">
                Name
              </label>
              <ValidationError prefix="Name" field="name" errors={formState.errors} />
            </motion.div>

            <motion.div variants={fadeUp} className="relative">
              <input
                type="email"
                name="email"
                required
                className="peer w-full p-3 rounded bg-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder=" "
              />
              <label className="absolute left-3 top-2 text-gray-400 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-green-400 text-sm transition-all">
                Email
              </label>
              <ValidationError prefix="Email" field="email" errors={formState.errors} />
            </motion.div>

            <motion.div variants={fadeUp} className="relative">
              <textarea
                name="message"
                rows={5}
                required
                className="peer w-full p-3 rounded bg-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder=" "
              />
              <label className="absolute left-3 top-2 text-gray-400 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-green-400 text-sm transition-all">
                Message
              </label>
              <ValidationError prefix="Message" field="message" errors={formState.errors} />
            </motion.div>

            <motion.button
              variants={fadeUp}
              type="submit"
              disabled={formState.submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold transition-all"
            >
              {formState.submitting ? "Sending..." : "Send Message"}
            </motion.button>
          </motion.form>

          {/* Info + Socials */}
          <motion.div variants={fadeUp} className="flex-1 flex flex-col gap-6">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              {contactInfo.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-green-500 text-xl">{item.icon}</span>
                  <a href={`${item.type}:${item.detail}`} className="hover:text-green-400 transition">
                    {item.detail}
                  </a>
                </div>
              ))}
            </div>

            <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Connect With Us</h2>
              <div className="flex gap-4 text-2xl">
                {socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="hover:text-green-400 transition"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* WhatsApp CTA */}
        <a
          href={`${contactData.socials.whatsapp}?text=Hello%20ServiceHub,%20I%20need%20assistance`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-full shadow-xl transition"
        >
          <FaWhatsapp className="text-xl" />
          <span className="hidden md:block font-medium">Chat on WhatsApp</span>
        </a>

        {/* Popup */}
        {showPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-xl text-center space-y-4">
              <svg viewBox="0 0 60 60" className="mx-auto w-16 h-16">
                <circle cx="30" cy="30" r="25" stroke="green" strokeWidth="3" fill="none" />
                <path d="M18 30 l10 10 l20 -20" stroke="green" strokeWidth="3" fill="none" />
              </svg>
              <p>Thank you for your message! We will be in touch shortly.</p>
              <button
                onClick={closePopup}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Contact;
