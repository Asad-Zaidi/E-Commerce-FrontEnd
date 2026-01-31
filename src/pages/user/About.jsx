import React from "react";
import { Helmet } from "react-helmet-async";
import aboutImg from "../../assets/logo.png";
import {
  FaGem,
  FaLock,
  FaBolt,
  FaHeadset,
  FaBullseye,
  FaEye,
} from "react-icons/fa";

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

      <main className="bg-gray-950 text-gray-100">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900">
          <div className="max-w-7xl mx-auto px-6 py-24 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              About ServiceHub
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-indigo-200">
              Your trusted platform for managing and saving on premium digital subscriptions.
            </p>
          </div>
        </section>

        {/* Who We Are */}
        <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-white">
              Who We Are
            </h2>

            <p className="text-gray-400 leading-relaxed mb-5">
              <span className="font-semibold text-white">ServiceHub</span> simplifies access
              to premium digital services like Netflix, Prime Video, Adobe Creative Cloud,
              and Microsoft 365 — all from one secure and reliable platform.
            </p>

            <p className="text-gray-400 leading-relaxed">
              We collaborate with verified vendors to provide 100% genuine services at
              competitive prices. Whether you’re an individual or a business, ServiceHub
              ensures convenience, affordability, and trust.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <img
              src={aboutImg}
              alt="About ServiceHub"
              loading="lazy"
              className="w-72 md:w-80 rounded-3xl bg-gray-900 p-6 shadow-2xl border border-gray-800"
            />
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-gray-900 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-14 text-white">
              Our Mission & Vision
            </h2>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="rounded-3xl bg-gray-950 border border-gray-800 p-10 hover:shadow-xl transition">
                <div className="flex items-center gap-4 mb-4">
                  <FaBullseye className="text-indigo-400 text-2xl" />
                  <h3 className="text-xl font-semibold">Our Mission</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  To make premium digital services affordable and easily accessible
                  through a transparent, secure, and user-friendly platform.
                </p>
              </div>

              <div className="rounded-3xl bg-gray-950 border border-gray-800 p-10 hover:shadow-xl transition">
                <div className="flex items-center gap-4 mb-4">
                  <FaEye className="text-purple-400 text-2xl" />
                  <h3 className="text-xl font-semibold">Our Vision</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  To become South Asia’s most trusted digital service hub, empowering
                  users with seamless access to entertainment, productivity, and cloud tools.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-gray-950">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-14 text-white">
              Why Choose ServiceHub?
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Affordable Plans",
                  desc: "Premium subscriptions at prices that fit your budget.",
                  icon: <FaGem />,
                },
                {
                  title: "Secure Transactions",
                  desc: "Industry-grade security for every payment and account.",
                  icon: <FaLock />,
                },
                {
                  title: "Instant Access",
                  desc: "Get started within minutes of your purchase.",
                  icon: <FaBolt />,
                },
                {
                  title: "Dedicated Support",
                  desc: "Fast and reliable assistance whenever you need it.",
                  icon: <FaHeadset />,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-3xl bg-gray-900 border border-gray-800 p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="flex justify-center mb-5 text-indigo-400 text-3xl">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default About;
