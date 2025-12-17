// import React from "react";
// import { Link } from "react-router-dom";
// import "../../styles/Breadcrumb.css";

// const Breadcrumb = ({ category, productName, slug }) => {
//     return (
//         <nav className="breadcrumb-container" aria-label="breadcrumb">
//             <ol className="breadcrumb-list">
//                 <li className="breadcrumb-item">
//                     <Link to="/">Home</Link>
//                 </li>
//                 <li className="breadcrumb-item">
//                     <Link to="/products">Products</Link>
//                 </li>
//                 {category && (
//                     <li className="breadcrumb-item">
//                         <Link to={`/products?category=${encodeURIComponent(category)}`}>
//                             {category}
//                         </Link>
//                     </li>
//                 )}
//                 {productName && (
//                     <li className="breadcrumb-item active" aria-current="page">
//                         {productName}
//                     </li>
//                 )}
//             </ol>
//         </nav>
//     );
// };

// export default Breadcrumb;

import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ category, productName }) => {
    return (
        <nav
            className=" border-b border-gray-200 dark:border-gray-600 py-3 mb-6"
            aria-label="breadcrumb"
        >
            <ol className="flex flex-wrap items-center max-w-7xl mx-auto px-4 text-sm sm:text-base">
                {/* Home */}
                <li className="flex items-center">
                    <Link
                        to="/"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        Home
                    </Link>
                    <span className="mx-2 text-gray-400 dark:text-gray-400">/</span>
                </li>

                {/* Products */}
                <li className="flex items-center">
                    <Link
                        to="/products"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        Products
                    </Link>
                    {category && <span className="mx-2 text-gray-400 dark:text-gray-400">/</span>}
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
                            <span className="mx-2 text-gray-400 dark:text-gray-400">/</span>
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
    );
};

export default Breadcrumb;
