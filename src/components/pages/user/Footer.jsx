import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaWhatsapp
} from "react-icons/fa";
import logo from "../../../assets/logo.png";
import api from "../../../api/api";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

function Footer() {
    const [contactData, setContactData] = useState({
        email: "",
        phone: "",
        socials: {}
    });

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const res = await api.get("/contact");
                if (res.data) setContactData(res.data);
            } catch (err) {
                console.error("Error fetching contact data for footer", err);
            }
        };
        fetchContact();
    }, []);
    return (
        <footer className="bg-gray-950 text-gray-300 border-t border-gray-800">
            <motion.div
                className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
            >
                {/* Logo & Description */}
                <div>
                    <img
                        src={logo}
                        alt="Service Hub Logo"
                        className="h-12 mb-4"
                    />
                    <p className="text-sm leading-relaxed text-gray-400">
                        Service Hub provides reliable access to your favorite digital
                        subscriptions — affordable, secure, and hassle-free.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-white">
                        Quick Links
                    </h3>
                    <ul className="space-y-2">
                        {[
                            { name: "Home", path: "/" },
                            { name: "Products", path: "/products" },
                            { name: "About", path: "/about" },
                            { name: "Contact", path: "/contact" }
                        ].map(link => (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    className="hover:text-purple-400 transition"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact & Social */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-white">
                        Contact Us
                    </h3>
                    <p className="text-sm text-gray-400">
                        Email:&nbsp;
                        <a
                            href={`mailto:${contactData.email}`}
                            className="hover:text-purple-400 transition"
                        >
                            {contactData.email}
                        </a>
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        Phone: {contactData.phone}
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-4 mt-5">
                        {[
                            { icon: <FaWhatsapp />, link: contactData?.socials?.whatsapp, label: "WhatsApp" },
                            { icon: <FaFacebookF />, link: contactData?.socials?.facebook, label: "Facebook" },
                            { icon: <FaTwitter />, link: contactData?.socials?.twitter, label: "Twitter" },
                            { icon: <FaInstagram />, link: contactData?.socials?.instagram, label: "Instagram" },
                            { icon: <FaLinkedinIn />, link: contactData?.socials?.linkedin, label: "LinkedIn" }
                        ]
                            .filter((s) => Boolean(s.link))
                            .map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    whileHover={{ scale: 1.15 }}
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-purple-600 transition"
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                    </div>
                </div>
            </motion.div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Service Hub. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;
