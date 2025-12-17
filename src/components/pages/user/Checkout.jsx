import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaArrowLeft, FaMobileAlt, FaShieldAlt, FaCheckCircle, FaTrash, FaWallet } from "react-icons/fa";

const WHATSAPP_NUMBER = "923084401410"; // Replace with your business WhatsApp number in international format
const WALLET_NUMBER = "0308-4401410"; // Replace with your Easypaisa/JazzCash number
const WALLET_NAME = "Syed Asad Jamil"; // Replace with your Easypaisa/JazzCash account name

const formatPKR = (value) => `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;

const defaultItems = [];

const Checkout = () => {
	const navigate = useNavigate();

	const [items, setItems] = useState([]);
	const [contact, setContact] = useState({ name: "", email: "", phone: "" });
	const [billing, setBilling] = useState({ company: "", country: "Pakistan", city: "", address: "" });
	const [paymentMethod, setPaymentMethod] = useState("card");
	const [cardDetails] = useState({ name: "", number: "", expiry: "", cvc: "" });
	const [note, setNote] = useState("");
	const [coupon, setCoupon] = useState("");
	const [couponMeta, setCouponMeta] = useState({ code: null, discount: 0 });
	const [status, setStatus] = useState({ state: "idle", message: "" });
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const stored = JSON.parse(localStorage.getItem("checkoutItems") || "[]");
		setItems(stored.length ? stored : defaultItems);
	}, []);

	useEffect(() => {
		localStorage.setItem("checkoutItems", JSON.stringify(items));
	}, [items]);

	const totals = useMemo(() => {
		const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
		const discount = couponMeta.discount ? Math.round(subtotal * couponMeta.discount) : 0;
		const processingFee = subtotal ? Math.max(99, Math.round(subtotal * 0.02)) : 0;
		const total = Math.max(0, subtotal - discount + processingFee);
		return { subtotal, discount, processingFee, total };
	}, [items, couponMeta]);

	const updateQuantity = (productId, delta) => {
		setItems((prev) =>
			prev
				.map((item) =>
					item.productId === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
				)
				.filter((item) => item.quantity > 0),
		);
	};

	const removeItem = (productId) => {
		setItems((prev) => prev.filter((item) => item.productId !== productId));
	};

	const applyCoupon = () => {
		const code = coupon.trim().toUpperCase();
		if (!code) return;

		if (["SAVE10", "WELCOME10"].includes(code)) {
			setCouponMeta({ code, discount: 0.1 });
			setStatus({ state: "success", message: "Coupon applied. 10% off your subtotal." });
		} else if (code === "VIP20") {
			setCouponMeta({ code, discount: 0.2 });
			setStatus({ state: "success", message: "VIP applied. 20% off your subtotal." });
		} else {
			setCouponMeta({ code: null, discount: 0 });
			setStatus({ state: "error", message: "Invalid coupon code." });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!items.length) {
			setStatus({ state: "error", message: "Your cart is empty." });
			return;
		}
		if (!contact.name || !contact.email || !contact.phone || !billing.city || !billing.address) {
			setStatus({ state: "error", message: "Please fill in all required fields." });
			return;
		}
		if (
			paymentMethod === "card" &&
			(!cardDetails.name.trim() || !cardDetails.number.trim() || !cardDetails.expiry.trim() || !cardDetails.cvc.trim())
		) {
			setStatus({ state: "error", message: "Please enter your card details." });
			return;
		}

		setSubmitting(true);
		setStatus({ state: "idle", message: "" });

		const payload = {
			items,
			totals,
			contact,
			billing,
			paymentMethod,
			note,
			coupon: couponMeta.code,
		};

		try {
			const lines = [
				`New checkout from ${contact.name}`,
				`Phone: ${contact.phone}`,
				`Email: ${contact.email}`,
				`City: ${billing.city}`,
				`Address: ${billing.address}`,
				contact.company ? `Company: ${contact.company}` : null,
				"",
				"Items:",
				...items.map(
					(item) =>
						`- ${item.productName} (${item.selectedPlan || "plan"}, ${item.accessType || "shared"}, ${
							item.billingPeriod || "monthly"
						}) x${item.quantity} = Rs. ${(item.price || 0) * (item.quantity || 1)}`,
				),
				"",
				`Subtotal: Rs. ${totals.subtotal}`,
				`Discount: Rs. ${totals.discount}`,
				`Processing: Rs. ${totals.processingFee}`,
				`Total: Rs. ${totals.total}`,
				`Payment: ${paymentMethod}`,
				note ? `Note: ${note}` : null,
			];

			const message = encodeURIComponent(lines.filter(Boolean).join("\n"));
			const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
			window.open(waUrl, "_blank", "noopener,noreferrer");

			// Simulate a server call while keeping UI responsive.
			await new Promise((resolve) => setTimeout(resolve, 400));
			console.log("Checkout submitted", payload);
			localStorage.removeItem("checkoutItems");
			setItems([]);
			setStatus({ state: "success", message: "Redirected to WhatsApp with your order details." });
			setContact({ name: "", email: "", phone: "" });
			setBilling({ company: "", country: "Pakistan", city: "", address: "" });
			setNote("");
			setCoupon("");
			setCouponMeta({ code: null, discount: 0 });
		} catch (err) {
			setStatus({ state: "error", message: "Something went wrong. Please try again." });
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<Helmet>
				<title>Checkout - EDM</title>
				<meta
					name="description"
					content="Secure checkout for your EDM subscription. Review your order, choose a plan, and get instant access."
				/>
			</Helmet>

			<div className="min-h-screen bg-slate-950">
				<div className="mx-auto max-w-6xl px-4 py-10">
					<div className="mb-6 flex items-center gap-3 text-slate-200">
						<button
							type="button"
							onClick={() => navigate(-1)}
							className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-700 hover:bg-slate-800"
						>
							<FaArrowLeft /> Back
						</button>
						<div className="flex flex-col">
							<span className="text-sm uppercase tracking-[0.2em] text-slate-400">Secure Checkout</span>
							<span className="text-2xl font-bold text-white">Complete your purchase</span>
						</div>
					</div>

					<div className="grid gap-6 lg:grid-cols-3">
						<form
							onSubmit={handleSubmit}
							className="lg:col-span-2 space-y-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur"
						>
							<section className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-200">Full name *</label>
									<input
										value={contact.name}
										onChange={(e) => setContact({ ...contact, name: e.target.value })}
										placeholder="Alex Johnson"
										className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-200">Email *</label>
									<input
										type="email"
										value={contact.email}
										onChange={(e) => setContact({ ...contact, email: e.target.value })}
										placeholder="you@company.com"
										className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-200">Phone *</label>
									<input
										value={contact.phone}
										onChange={(e) => setContact({ ...contact, phone: e.target.value })}
										placeholder="03XX-XXXXXXX"
										className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-200">Company (optional)</label>
									<input
										value={billing.company}
										onChange={(e) => setBilling({ ...billing, company: e.target.value })}
										placeholder="EDM Studios"
										className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
									/>
								</div>
							</section>

							<section className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-200">Country *</label>
									<input
										value={billing.country}
										onChange={(e) => setBilling({ ...billing, country: e.target.value })}
										className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-semibold text-slate-200">City *</label>
									<input
										value={billing.city}
										onChange={(e) => setBilling({ ...billing, city: e.target.value })}
										placeholder="Lahore"
										className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
									/>
								</div>
								<div className="md:col-span-2 space-y-2">
									<label className="text-sm font-semibold text-slate-200">Address *</label>
									<input
										value={billing.address}
										onChange={(e) => setBilling({ ...billing, address: e.target.value })}
										placeholder="Street, building, suite"
										className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
									/>
								</div>
							</section>

							<section className="grid gap-4 md:grid-cols-1">
								{/* <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-4">
									<div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
										<FaCreditCard className="text-indigo-400" /> Card
									</div>
									<p className="text-xs text-slate-400">Pay securely with debit/credit cards.</p>
									<input
										type="radio"
										name="payment"
										checked={paymentMethod === "card"}
										onChange={() => setPaymentMethod("card")}
										className="h-4 w-4 border-slate-700 bg-slate-950 text-indigo-500"
									/>
									{paymentMethod === "card" && (
										<div className="mt-3 space-y-3 rounded-xl border border-indigo-500/40 bg-indigo-500/5 p-3">
											<div className="grid gap-3 md:grid-cols-2">
												<div className="space-y-1">
													<label className="text-xs font-semibold text-slate-200">Name on card</label>
													<input
														value={cardDetails.name}
														onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
														placeholder="Alex Johnson"
														className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
													/>
												</div>
												<div className="space-y-1">
													<label className="text-xs font-semibold text-slate-200">Card number</label>
													<input
														value={cardDetails.number}
														onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
														placeholder="4242 4242 4242 4242"
														className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
													/>
												</div>
											</div>
											<div className="grid gap-3 md:grid-cols-2">
												<div className="space-y-1">
													<label className="text-xs font-semibold text-slate-200">Expiry (MM/YY)</label>
													<input
														value={cardDetails.expiry}
														onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
														placeholder="12/28"
														className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
													/>
												</div>
												<div className="space-y-1">
													<label className="text-xs font-semibold text-slate-200">CVC</label>
													<input
														value={cardDetails.cvc}
														onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
														placeholder="123"
														className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
													/>
												</div>
											</div>
											<p className="text-[11px] text-slate-400">
												Card details are kept on this page only; we will confirm via WhatsApp before processing.
											</p>
										</div>
									)}
								</div> */}
								<div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-4">
									<div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
										<FaMobileAlt className="text-emerald-400" /> Wallet
									</div>
									<p className="text-xs text-slate-400">Instant confirmations via Easypaisa or JazzCash.</p>
									<input
										// type="radio"
										name="payment"
										checked={paymentMethod === "wallet"}
										onChange={() => setPaymentMethod("wallet")}
										className="h-4 w-4 border-slate-700 bg-slate-950 text-indigo-500"
									/>
									{paymentMethod === "wallet" && (
										<div className="flex items-start gap-2 rounded-lg border border-emerald-600/40 bg-emerald-500/10 p-3 text-xs text-emerald-100">
											<FaWallet className="mt-0.5" />
											<div className="space-y-1">
												<div className="font-semibold text-emerald-100">Pay to Easypaisa / JazzCash</div>
												<div className="text-emerald-50">Wallet: {WALLET_NUMBER}</div>
												<div className="text-emerald-50">Name: {WALLET_NAME}</div>
												<div className="text-slate-200 font-semibold">Note: Share payment slip on WhatsApp after sending.</div>
											</div>
										</div>
									)}
								</div>
							</section>

							<section className="space-y-2">
								<label className="text-sm font-semibold text-slate-200">Order notes</label>
								<textarea
									rows={3}
									value={note}
									onChange={(e) => setNote(e.target.value)}
									placeholder="Share access instructions or timing preferences"
									className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
								/>
							</section>

							{status.state !== "idle" && (
								<div
									className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${
										status.state === "success"
											? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
											: "border-rose-500/40 bg-rose-500/10 text-rose-100"
									}`}
								>
									<FaCheckCircle /> {status.message}
								</div>
							)}

							<div className="flex flex-wrap items-center gap-3">
								<button
									type="submit"
									disabled={submitting}
									className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
								>
									{submitting ? "Processing..." : "Place order"}
								</button>
								<span className="flex items-center gap-2 text-xs text-slate-400">
									<FaShieldAlt className="text-indigo-400" /> Payments secured & encrypted
								</span>
							</div>
						</form>

						<aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur">
							<div className="flex items-center justify-between text-sm font-semibold text-white">
								<span>Order summary</span>
								<span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200">
									{items.length} item{items.length === 1 ? "" : "s"}
								</span>
							</div>

							<div className="space-y-3">
								{items.map((item) => (
									<div
										key={`${item.productId}-${item.selectedPlan}`}
										className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3"
									>
										<img
											src={item.imageUrl}
											alt={item.productName}
											className="h-12 w-12 rounded-lg object-cover"
										/>
										<div className="flex-1">
											<p className="text-sm font-semibold text-white">{item.productName}</p>
											<p className="text-xs text-slate-400">
												{item.accessType || "shared"} • {item.billingPeriod || "monthly"}
											</p>
											<div className="mt-1 flex items-center gap-2 text-sm text-slate-200">
												<button
													type="button"
													onClick={() => updateQuantity(item.productId, -1)}
													className="h-7 w-7 rounded-full border border-slate-700 text-center text-xs font-bold text-slate-200"
												>
													-
												</button>
												<span className="text-xs font-semibold text-white">{item.quantity}</span>
												<button
													type="button"
													onClick={() => updateQuantity(item.productId, 1)}
													className="h-7 w-7 rounded-full border border-slate-700 text-center text-xs font-bold text-slate-200"
												>
													+
												</button>
											</div>
										</div>
										<div className="flex flex-col items-end gap-2">
											<span className="text-sm font-semibold text-white">
												{formatPKR(item.price * item.quantity)}
											</span>
											<button
												type="button"
												onClick={() => removeItem(item.productId)}
												className="flex items-center gap-1 text-xs font-semibold text-rose-300 hover:text-rose-200"
											>
												<FaTrash /> Remove
											</button>
										</div>
									</div>
								))}

								{!items.length && (
									<div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-center text-sm text-slate-300">
										Your cart is empty. Add a product to continue.
									</div>
								)}
							</div>

							<div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
								<div className="flex items-center gap-2">
									<input
										value={coupon}
										onChange={(e) => setCoupon(e.target.value)}
										placeholder="Coupon code"
										className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
									/>
									<button
										type="button"
										onClick={applyCoupon}
										className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-900 transition hover:bg-white"
									>
										Apply
									</button>
								</div>
								{couponMeta.code && (
									<p className="text-xs text-emerald-300">Applied: {couponMeta.code}</p>
								)}
							</div>

							<div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200">
								<div className="flex items-center justify-between">
									<span>Subtotal</span>
									<span>{formatPKR(totals.subtotal)}</span>
								</div>
								<div className="flex items-center justify-between text-emerald-300">
									<span>Discount</span>
									<span>- {formatPKR(totals.discount)}</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Processing</span>
									<span>{formatPKR(totals.processingFee)}</span>
								</div>
								<div className="h-px bg-slate-800" />
								<div className="flex items-center justify-between text-base font-bold text-white">
									<span>Total</span>
									<span>{formatPKR(totals.total)}</span>
								</div>
							</div>

							<div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-xs text-indigo-100">
								<div className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-200">
									<FaShieldAlt /> Why customers trust us
								</div>
								<ul className="space-y-1 text-indigo-100">
									<li>• Instant activation after payment</li>
									<li>• 7-day onboarding assistance</li>
									<li>• Pro-rated refunds on eligible plans</li>
								</ul>
							</div>

							<div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-100">
								<FaWallet className="text-lg" />
								Pay with the wallet you already use: Easypaisa, JazzCash, or bank transfer.
							</div>
						</aside>
					</div>
				</div>
			</div>
		</>
	);
};

export default Checkout;
