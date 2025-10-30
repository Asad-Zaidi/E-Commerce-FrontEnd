import React from "react";
import "../styles/About.css";
import aboutImg from "../../assets/logo.png";
import { Helmet } from "react-helmet-async";

function About() {
  return (
    <>
      <Helmet>
        <title>About | ServiceHub</title>
        <meta
          name="description"
          content="Learn more about ServiceHub — your trusted platform for digital tools and subscription-based services."
        />
      </Helmet>

      <div className="about-container">
        {/* Hero Section */}
        <section className="about-hero">
          <h1>About Service Hub</h1>
          <p>
            Your one-stop platform for managing, sharing, and saving on premium digital subscriptions.
          </p>
        </section>

        {/* About Content */}
        <section className="about-content">
          <div className="about-text">
            <h2>Who We Are</h2>
            <p>
              At <strong>Service Hub</strong>, we make it easier for users to access top digital
              services like Netflix, Prime Video, Adobe Creative Cloud, and Microsoft 365 — all
              from a single place.
              Our goal is to bring convenience, affordability, and trust to the digital
              subscription experience in Pakistan and beyond.
            </p>
            <p>
              We partner with verified vendors to ensure all services are 100% genuine and accessible
              at competitive prices. Whether you’re an individual, a freelancer, or a small business,
              Service Hub is designed to make managing your subscriptions simple and secure.
            </p>
          </div>

          <div className="about-image">
            <img src={aboutImg} alt="About Service Hub" />
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mission-section">
          <h2>Our Mission & Vision</h2>
          <div className="mission-cards">
            <div className="mission-card">
              <h3>Our Mission</h3>
              <p>
                To make premium digital services affordable and easily accessible for everyone through
                a transparent and user-friendly platform.
              </p>
            </div>
            <div className="mission-card">
              <h3>Our Vision</h3>
              <p>
                To become the most trusted digital service hub in South Asia, empowering people with
                seamless access to entertainment, productivity, and cloud tools.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="values-section">
          <h2>Why Choose Service Hub?</h2>
          <div className="values-grid">
            <div className="value-item">
              <h3>💎 Affordable Plans</h3>
              <p>We bring top-tier subscriptions to your budget without compromising on quality.</p>
            </div>
            <div className="value-item">
              <h3>🔐 Secure Transactions</h3>
              <p>Your privacy and security are our top priorities. Every payment is 100% safe.</p>
            </div>
            <div className="value-item">
              <h3>⚡ Instant Access</h3>
              <p>Start using your subscription services within minutes of your purchase.</p>
            </div>
            <div className="value-item">
              <h3>💬 Dedicated Support</h3>
              <p>Our support team is always here to help — quick responses and reliable guidance.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default About;
