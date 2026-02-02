import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import api from "../../api/api";

const formatPKR = (value) => `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;

const Cart = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useUser();
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);

	// Redirect if not authenticated (hide cart for logged-out users)
	useEffect(() => {
		if (!loading && !isAuthenticated) {
			navigate('/login');
		}
	}, [isAuthenticated, navigate, loading]);

	// Utility function to deduplicate cart items
	const deduplicateCart = (cart) => {
		const uniqueCart = [];
		cart.forEach(item => {
			const exists = uniqueCart.findIndex(u => 
				String(u.productId) === String(item.productId) && 
				u.selectedPlan === item.selectedPlan
			);
			if (exists === -1) {
				uniqueCart.push(item);
			} else {
				// If duplicate found, keep the one with higher quantity
				if (item.quantity > uniqueCart[exists].quantity) {
					uniqueCart[exists].quantity = item.quantity;
				}
			}
		});
		return uniqueCart;
	};

	// Load cart from backend if authenticated, otherwise from localStorage
	useEffect(() => {
		const loadCart = async () => {
			if (isAuthenticated) {
				try {
					const res = await api.get('/auth/cart');
					const backendCart = res.data.cart || [];
					const localCart = JSON.parse(localStorage.getItem("checkoutItems") || "[]");
					
					// Merge backend cart with local cart (local cart takes priority for new items)
					const mergedCart = [...backendCart];
					localCart.forEach(localItem => {
						const existingIndex = mergedCart.findIndex(item => 
							String(item.productId) === String(localItem.productId) && 
							item.selectedPlan === localItem.selectedPlan
						);
						if (existingIndex >= 0) {
							// Update quantity if item exists
							mergedCart[existingIndex].quantity = localItem.quantity;
						} else {
							// Add new item
							mergedCart.push(localItem);
						}
					});
					
					// Deduplicate the merged cart
					const uniqueCart = deduplicateCart(mergedCart);
					
					setItems(uniqueCart);
					localStorage.setItem("checkoutItems", JSON.stringify(uniqueCart));
					
					// Sync unique cart to backend (not merged cart which might have duplicates)
					if (uniqueCart.length > 0 && JSON.stringify(backendCart) !== JSON.stringify(uniqueCart)) {
						await api.put('/auth/cart', { cart: uniqueCart });
					}
				} catch (err) {
					console.error('Error loading cart:', err);
					// Fallback to localStorage if backend fails
					const stored = JSON.parse(localStorage.getItem("checkoutItems") || "[]");
					const uniqueCart = deduplicateCart(stored);
					setItems(uniqueCart);
					if (uniqueCart.length !== stored.length) {
						localStorage.setItem("checkoutItems", JSON.stringify(uniqueCart));
					}
				}
			} else {
				const stored = JSON.parse(localStorage.getItem("checkoutItems") || "[]");
				
				// Deduplicate localStorage cart as well
				const uniqueCart = deduplicateCart(stored);
				
				setItems(uniqueCart);
				if (uniqueCart.length !== stored.length) {
					// Update localStorage if we found duplicates
					localStorage.setItem("checkoutItems", JSON.stringify(uniqueCart));
				}
			}
			setLoading(false);
		};
		
		loadCart();
	}, [isAuthenticated]);
	
	// Listen for cart updates and reload
	useEffect(() => {
		const handleCartUpdate = () => {
			const stored = JSON.parse(localStorage.getItem("checkoutItems") || "[]");
			const uniqueCart = deduplicateCart(stored);
			setItems(uniqueCart);
			if (uniqueCart.length !== stored.length) {
				localStorage.setItem("checkoutItems", JSON.stringify(uniqueCart));
			}
		};
		
		window.addEventListener('cartUpdated', handleCartUpdate);
		return () => window.removeEventListener('cartUpdated', handleCartUpdate);
	}, []);

	// Sync cart to backend and localStorage whenever items change
	useEffect(() => {
		if (!loading) {
			localStorage.setItem("checkoutItems", JSON.stringify(items));
			window.dispatchEvent(new Event('cartUpdated'));
			
			// Sync to backend if authenticated
			if (isAuthenticated) {
				const syncCart = async () => {
					try {
						await api.put('/auth/cart', { cart: items });
					} catch (err) {
						console.error('Error syncing cart:', err);
					}
				};
				syncCart();
			}
		}
	}, [items, isAuthenticated, loading]);

	const updateQuantity = (productId, selectedPlan, delta) => {
		setItems((prev) =>
			prev
				.map((item) =>
					item.productId === productId && item.selectedPlan === selectedPlan
						? { ...item, quantity: Math.max(1, item.quantity + delta) } 
						: item
				)
				.filter((item) => item.quantity > 0)
		);
	};

	const removeItem = (productId, selectedPlan) => {
		setItems((prev) => prev.filter((item) => 
			!(item.productId === productId && item.selectedPlan === selectedPlan)
		));
	};

	const clearCart = () => {
		setItems([]);
	};

	const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
	const total = subtotal;

	if (!loading && !isAuthenticated) {
		return null;
	}

	return (
		<>
			<Helmet>
				<title>Shopping Cart - ServiceHub</title>
				<meta name="description" content="Review your cart items before checkout" />
			</Helmet>

			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
				<div className="max-w-6xl mx-auto">
					{/* Header */}
					<div className="flex items-center justify-between mb-8">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
							<FaShoppingCart className="text-indigo-600 dark:text-indigo-400" />
							Shopping Cart
						</h1>
						<button
							onClick={() => navigate('/products')}
							className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline"
						>
							<FaArrowLeft />
							Continue Shopping
						</button>
					</div>

					{loading ? (
						/* Loading State */
						<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
							<div className="w-16 h-16 mx-auto mb-4 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
							<p className="text-gray-600 dark:text-gray-400">Loading your cart...</p>
						</div>
					) : items.length === 0 ? (
						/* Empty Cart */
						<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
							<FaShoppingCart className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
							<h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
								Your cart is empty
							</h2>
							<p className="text-gray-500 dark:text-gray-400 mb-6">
								Add some products to get started!
							</p>
							<button
								onClick={() => navigate('/products')}
								className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
							>
								Browse Products
			</button>
						</div>
					) : (
						/* Cart with Items */
						<div className="grid lg:grid-cols-3 gap-8">
							{/* Cart Items */}
							<div className="lg:col-span-2 space-y-4">
								{/* Clear Cart Button */}
								<div className="flex justify-end">
									<button
										onClick={clearCart}
										className="text-sm text-red-600 dark:text-red-400 hover:underline flex items-center gap-2"
									>
										<FaTrash />
										Clear Cart
									</button>
								</div>

								{items.map((item, index) => (
									<div
										key={`${item.productId}-${item.selectedPlan || 'default'}-${index}`}
										className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4"
									>
										{/* Product Image */}
										<div className="w-full sm:w-24 h-24 flex-shrink-0">
											<img
												src={item.imageUrl || item.image || "/placeholder.png"}
												alt={item.productName || item.name}
												className="w-full h-full object-cover rounded-lg"
											/>
										</div>

										{/* Product Details */}
										<div className="flex-1">
											<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
												{item.productName || item.name}
											</h3>
											{item.selectedPlan && (
												<p className="text-xs text-indigo-600 dark:text-indigo-400 mb-1">
													{item.selectedPlan} {item.accessType && `• ${item.accessType}`} {item.billingPeriod && `• ${item.billingPeriod}`}
												</p>
											)}
											<p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
												{item.description && item.description.substring(0, 60)}...
											</p>
											<p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
												{formatPKR(item.price)}
											</p>
										</div>

										{/* Quantity Controls */}
										<div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
											<div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg">
												<button
												onClick={() => updateQuantity(item.productId, item.selectedPlan, -1)}
													className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
													aria-label="Decrease quantity"
												>
													<FaMinus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
												</button>
												<span className="px-4 font-semibold text-gray-900 dark:text-white">
													{item.quantity}
												</span>
												<button
												onClick={() => updateQuantity(item.productId, item.selectedPlan, 1)}
													className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
													aria-label="Increase quantity"
												>
													<FaPlus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
												</button>
											</div>

											{/* Remove Button */}
											<button
											onClick={() => removeItem(item.productId, item.selectedPlan)}
												className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition"
												aria-label="Remove item"
											>
												<FaTrash className="w-4 h-4" />
											</button>
										</div>
									</div>
								))}
							</div>

							{/* Order Summary */}
							<div className="lg:col-span-1">
								<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-24">
									<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
										Order Summary
									</h2>

									<div className="space-y-3 mb-6">
										<div className="flex justify-between text-gray-600 dark:text-gray-400">
											<span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
											<span>{formatPKR(subtotal)}</span>
										</div>
										<div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
											<span>Total</span>
											<span className="text-indigo-600 dark:text-indigo-400">{formatPKR(total)}</span>
										</div>
									</div>

									<button
										onClick={() => navigate('/checkout')}
										className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition flex items-center justify-center gap-2"
									>
										Checkout
										<FaArrowRight />
									</button>

									<button
										onClick={() => navigate('/products')}
										className="w-full mt-3 py-3 border border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
									>
										Continue Shopping
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Cart;
