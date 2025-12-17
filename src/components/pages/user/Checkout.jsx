import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../styles/Checkout.css";
import { Helmet } from "react-helmet-async";

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("credit-card");
    const [userDetails, setUserDetails] = useState({
        fullName: "",
        email: "",
        address: "",
    });

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setProductName(queryParams.get("product"));
        setPrice(queryParams.get("price"));
    }, [location.search]);

    const handleInputChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

    const handlePayment = (e) => {
        e.preventDefault();
        alert(`✅ Order placed successfully for ${productName} (Rs. ${price}) via ${paymentMethod}!`);
        navigate("/");
    };

    return (
        <>
            <Helmet>
                <title>Checkout | ServiceHub - Secure Payment</title>
                <meta name="description" content="Complete your purchase on ServiceHub. Secure checkout with multiple payment options." />
                <meta property="og:title" content="Checkout | ServiceHub" />
                <meta property="og:description" content="Complete your purchase securely on ServiceHub." />
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="en_US" />
                <meta name="robots" content="noindex" />
            </Helmet>
        <div className="checkout-page">
            <h1>Checkout</h1>
            <div className="checkout-container">
                <div className="order-summary">
                    <h2>Order Summary</h2>
                    <p><strong>Product:</strong> {productName}</p>
                    <p><strong>Price:</strong> Rs. {price}</p>
                </div>

                <form className="checkout-form" onSubmit={handlePayment}>
                    <h2>Billing Details</h2>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={userDetails.fullName}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={userDetails.email}
                        onChange={handleInputChange}
                        required
                    />
                    <textarea
                        name="address"
                        placeholder="Address"
                        rows="3"
                        value={userDetails.address}
                        onChange={handleInputChange}
                        required
                    />

                    <h3>Payment Method</h3>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="credit-card">Credit/Debit Card</option>
                        <option value="bank-transfer">Bank Transfer</option>
                        <option value="cash-on-delivery">Cash on Delivery</option>
                    </select>

                    <button type="submit" className="confirm-btn">
                        Confirm Order
                    </button>
                </form>
            </div>
        </div>
        </>
    );
};

export default Checkout;
