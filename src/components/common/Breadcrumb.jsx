import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Breadcrumb = ({ category, productName }) => {
    // Build breadcrumb items for schema
    const breadcrumbItems = [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `${window.location.origin}/`
        },
        {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": `${window.location.origin}/products`
        }
    ];

    if (category) {
        breadcrumbItems.push({
            "@type": "ListItem",
            "position": 3,
            "name": category,
            "item": `${window.location.origin}/products?category=${encodeURIComponent(category)}`
        });
    }

    if (productName) {
        breadcrumbItems.push({
            "@type": "ListItem",
            "position": breadcrumbItems.length + 1,
            "name": productName,
            "item": window.location.href
        });
    }

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems
    };

    return (
        <>
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            </Helmet>
            <nav
                className=" dark:border-gray-600 py-3 "
                aria-label="breadcrumb"
            >
                <ol className="flex flex-wrap items-center max-w-7xl mx-auto px-4 text-xs sm:text-sm">
                {/* Home */}
                <li className="flex items-center">
                    <Link
                        to="/"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        Home
                    </Link>
                    <span className="mx-1 text-gray-400 dark:text-gray-400">/</span>
                </li>

                {/* Products */}
                <li className="flex items-center">
                    <Link
                        to="/products"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        Products
                    </Link>
                    {category && <span className="mx-1 text-gray-400 dark:text-gray-400">/</span>}
                </li>

                {/* Category */}
                {category && (
                    <li className="flex items-center">
                        <Link
                            to={`/products?category=${encodeURIComponent(category)}`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                            {category}
                        </Link>
                        {productName && (
                            <span className="mx-1 text-gray-400 dark:text-gray-400">/</span>
                        )}
                    </li>
                )}

                {/* Product Name */}
                {productName && (
                    <li className="text-gray-500 dark:text-gray-300 font-medium truncate max-w-xs">
                        {productName}
                    </li>
                )}
            </ol>
        </nav>
        </>
    );
};

export default Breadcrumb;
