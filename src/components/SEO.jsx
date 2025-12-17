import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";

function SEO({ title, description, keywords, image, url }) {
    return (
        <Helmet>
            {/* Standard SEO */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            {url && <link rel="canonical" href={url} />}

            {/* Open Graph (Facebook, LinkedIn, WhatsApp) */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:site_name" content="ServiceHub" />

            {/* Twitter Card (X) */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
}

SEO.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    keywords: PropTypes.string,
    image: PropTypes.string,
    url: PropTypes.string,
};

SEO.defaultProps = {
    title: "",
    description: "",
    keywords: "",
    image: "",
    url: "",
};

export default SEO;
