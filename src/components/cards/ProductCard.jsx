// import React from "react";
// import { Link } from "react-router-dom";
// import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
// import "../../styles/ProductCard.css"

// // Function to render stars
// const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//         if (rating >= i) {
//             stars.push(<FaStar key={i} color="#FFD700" />);
//         } else if (rating >= i - 0.5) {
//             stars.push(<FaStarHalfAlt key={i} color="#FFD700" />);
//         } else {
//             stars.push(<FaRegStar key={i} color="#FFD700" />);
//         }
//     }
//     return stars;
// };

// const ProductCard = ({ product }) => {
//     return (
//         <div className="product-card">
//             <Link
//                 to={`/products?category=${encodeURIComponent(product.category)}`}
//                 className="category-tag"
//             >
//                 {product.category}
//             </Link>
//             <img src={product.imageUrl} alt={product.name} />
//             <div className="product-info">
//                 <h3>{product.name}</h3>
//                 <p className="product-price">{product.priceMonthly?.toFixed(2) || "N/A"} /month</p>
//                 <div className="product-rating">
//                     {renderStars(product.avgRating || 0)}
//                     <span className="rating-value">{product.avgRating?.toFixed(1) || "0.0"}</span>
//                 </div>
//                 <Link
//                     to={`/products/${product.category.toLowerCase().replace(/[\s\W-]+/g, '-')}/${product.name.toLowerCase().replace(/[\s\W-]+/g, '-')}`}
//                     className="detail-btn"
//                 >
//                     Detail →
//                 </Link>
//             </div>
//         </div>
//     );
// };

// export default ProductCard;

import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

import "../../styles/ProductCard.css"


// Function to render stars
const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars.push(<FaStar key={i} color="#FFD700" />);
        } else if (rating >= i - 0.5) {
            stars.push(<FaStarHalfAlt key={i} color="#FFD700" />);
        } else {
            stars.push(<FaRegStar key={i} color="#FFD700" />);
        }
    }
    return stars;
};

const ProductCard = ({ product, badge }) => {
    return (
        <div className="product-card">
            {badge && <div className="badge">{badge}</div>}
            
            <Link
                to={`/products?category=${encodeURIComponent(product.category)}`}
                className="category-tag"
            >
                {product.category}
            </Link>
            <img src={product.imageUrl} alt={product.name} loading="lazy" />
            <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">{product.priceSharedMonthly?.toFixed(2) || "N/A"} /month</p>
                <div className="product-rating">
                    {renderStars(product.avgRating || 0)}
                    <span className="rating-value">{product.avgRating?.toFixed(1) || "0.0"}</span>
                </div>
                <Link
                    to={`/products/${product.slug}`}
                    className="detail-btn"
                >
                    Detail →
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;

