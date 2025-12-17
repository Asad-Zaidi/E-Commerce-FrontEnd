// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../../../api/api";
// import "../../../styles/ProductForm.css";

// const ProductForm = () => {
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const isEditing = Boolean(id);

//     const [formData, setFormData] = useState({
//         name: "",
//         description: "",
//         seoDescription: "",
//         category: "",
//         priceMonthly: "",
//         priceYearly: "",
//         priceShared: "",
//         pricePrivate: "",
//         image: null,
//     });

//     const [enableMonthly, setEnableMonthly] = useState(true);
//     const [enableYearly, setEnableYearly] = useState(false);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [seoLoading, setSeoLoading] = useState(false);

//     // const categories = [
//     //     "Entertainment",
//     //     "AI Tools",
//     //     "Education",
//     //     "Social Media",
//     //     "Productivity",
//     //     "Other",
//     // ];

//     const [categories, setCategories] = useState([]);

//     useEffect(() => {
//         api.get("/categories").then((res) => setCategories(res.data));
//     }, []);


//     // ✅ Fetch product if editing
//     useEffect(() => {
//         if (isEditing) {
//             api.get(`/products/${id}`).then((res) => {
//                 const data = res.data;
//                 setFormData({
//                     name: data.name,
//                     description: data.description,
//                     seoDescription: data.seoDescription || "",
//                     category: data.category,
//                     priceMonthly: data.priceMonthly || "",
//                     priceYearly: data.priceYearly || "",
//                     priceShared: data.priceShared || "",
//                     pricePrivate: data.pricePrivate || "",
//                     image: null,
//                 });
//                 setEnableMonthly(Boolean(data.priceMonthly));
//                 setEnableYearly(Boolean(data.priceYearly));
//                 setImagePreview(data.imageUrl);
//             });
//         }
//     }, [id, isEditing]);

//     // ✅ Handle input change
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     // ✅ Generate SEO Description
//     const generateSEO = async () => {
//         if (!formData.name || !formData.category) {
//             alert("Please fill in Product Name and Category first");
//             return;
//         }

//         setSeoLoading(true);
//         try {
//             // For new products, we'll generate SEO without saving to DB first
//             if (!isEditing) {
//                 // Create a temporary product object for SEO generation
//                 const tempProduct = {
//                     name: formData.name,
//                     category: formData.category,
//                     description: formData.description
//                 };

//                 const response = await api.post('/products/temp/generate-seo', tempProduct);
//                 setFormData((prev) => ({ ...prev, seoDescription: response.data.seoDescription }));
//                 alert("✅ SEO description generated successfully!");
//             } else {
//                 // For existing products, use the existing endpoint
//                 const response = await api.post(`/products/${id}/generate-seo`);
//                 setFormData((prev) => ({ ...prev, seoDescription: response.data.seoDescription }));
//                 alert("✅ SEO description generated successfully!");
//             }
//         } catch (err) {
//             console.error("❌ SEO Generation failed:", err);
//             alert("❌ Failed to generate SEO description");
//         } finally {
//             setSeoLoading(false);
//         }
//     };

//     // ✅ Handle image upload
//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         setFormData((prev) => ({ ...prev, image: file }));
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (ev) => setImagePreview(ev.target.result);
//             reader.readAsDataURL(file);
//         }
//         else if (formData.imageUrl) {
//             setImagePreview(formData.imageUrl);
//         }

//     };

//     // ✅ Submit form
//     // ✅ Submit form (fixed)
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const data = new FormData();
//             Object.entries(formData).forEach(([key, value]) => {
//                 if (value !== "" && value !== null) data.append(key, value);
//             });

//             if (!enableMonthly) data.delete("priceMonthly");
//             if (!enableYearly) data.delete("priceYearly");

//             const config = {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             };

//             if (isEditing) {
//                 await api.put(`/products/${id}`, data, config);
//                 alert("✅ Product updated successfully!");
//             } else {
//                 await api.post("/products", data, config);
//                 alert("✅ Product added successfully!");
//             }

//             navigate("/admin/products");
//         } catch (err) {
//             console.error("❌ Error saving product:", err);
//             alert("❌ Error saving product!");
//         } finally {
//             setLoading(false);
//         }
//     };


//     return (
//         <div className="admin-form-container">
//             <h2>{isEditing ? "Edit Product" : "Add New Product"}</h2>
//             <form className="product-form" onSubmit={handleSubmit} encType="multipart/form-data">
//                 <div className="form-group">
//                     <label>Product Name</label>
//                     <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label>Description</label>
//                     <textarea
//                         name="description"
//                         rows="3"
//                         value={formData.description}
//                         onChange={handleChange}
//                         required
//                     ></textarea>
//                 </div>

//                 <div className="form-group">
//                     <label>SEO Description</label>
//                     <div className="seo-description-group">
//                         <textarea
//                             name="seoDescription"
//                             rows="4"
//                             value={formData.seoDescription}
//                             onChange={handleChange}
//                             placeholder="AI-generated SEO optimized description will appear here..."
//                             disabled={seoLoading}
//                         ></textarea>
//                         <button
//     type="button"
//     onClick={generateSEO}
//     className={`generate-seo-btn flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
//         seoLoading ? "opacity-70 cursor-not-allowed" : ""
//     }`}
//     disabled={!formData.name || !formData.category || seoLoading}
// >
//     {seoLoading ? (
//         <>
//             <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//             Generating SEO...
//         </>
//     ) : (
//         "Generate SEO"
//     )}
// </button>

//                     </div>
//                     <small className="form-help">
//                         Click "Generate SEO" to create an AI-optimized description for better search engine rankings.
//                     </small>
//                 </div>

//                 <div className="form-group">
//                     <label>Category</label>
//                     {/* <select name="category" value={formData.category} onChange={handleChange} required>
//                         <option value="">-- Select Category --</option>
//                         {categories.map((cat) => (
//                             <option key={cat} value={cat}>
//                                 {cat}
//                             </option>
//                         ))}
//                     </select> */}
//                     <select
//                         name="category"
//                         value={formData.category}
//                         onChange={handleChange}
//                         required
//                     >
//                         <option value="">Select Category</option>
//                         {categories.map((cat) => (
//                             <option key={cat._id} value={cat.name}>
//                                 {cat.name}
//                             </option>
//                         ))}
//                     </select>


//                 </div>

//                 <div className="price-section">
//                     <label>
//                         <input
//                             type="checkbox"
//                             checked={enableMonthly}
//                             onChange={() => setEnableMonthly(!enableMonthly)}
//                         />{" "}
//                         Enable Monthly Price
//                     </label>
//                     {enableMonthly && (
//                         <input
//                             type="number"
//                             name="priceMonthly"
//                             placeholder="Enter Monthly Price"
//                             value={formData.priceMonthly}
//                             onChange={handleChange}
//                         />
//                     )}

//                     <label>
//                         <input
//                             type="checkbox"
//                             checked={enableYearly}
//                             onChange={() => setEnableYearly(!enableYearly)}
//                         />{" "}
//                         Enable Yearly Price
//                     </label>
//                     {enableYearly && (
//                         <input
//                             type="number"
//                             name="priceYearly"
//                             placeholder="Enter Yearly Price"
//                             value={formData.priceYearly}
//                             onChange={handleChange}
//                         />
//                     )}
//                 </div>

//                 <div className="form-group dual-prices">
//                     <div>
//                         <label>Shared Price</label>
//                         <input
//                             type="number"
//                             name="priceShared"
//                             placeholder="e.g. 999"
//                             value={formData.priceShared}
//                             onChange={handleChange}
//                         />
//                     </div>
//                     <div>
//                         <label>Private Price</label>
//                         <input
//                             type="number"
//                             name="pricePrivate"
//                             placeholder="e.g. 1999"
//                             value={formData.pricePrivate}
//                             onChange={handleChange}
//                         />
//                     </div>
//                 </div>

//                 <div className="form-group">
//                     <label>Product Image</label>
//                     <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
//                     {imagePreview && (
//                         <div className="image-preview">
//                             <img src={imagePreview} alt="Preview" />
//                         </div>
//                     )}
//                 </div>

//                 <button type="submit" disabled={loading}>
//                     {loading ? "Saving..." : isEditing ? "Update Product" : "Add Product"}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default ProductForm;


// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../../../api/api";

// const ProductForm = () => {
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const isEditing = Boolean(id);

//     const [formData, setFormData] = useState({
//         name: "",
//         description: "",
//         seoDescription: "",
//         metaTitle: "",
//         metaDescription: "",
//         metaKeywords: "",
//         category: "",
//         priceSharedMonthly: "",
//         priceSharedYearly: "",
//         privatePriceMonthly: "",
//         privatePriceYearly: "",
//         image: null,
//     });

//     const [enableMonthly, setEnableMonthly] = useState(true);
//     const [enableYearly, setEnableYearly] = useState(false);
//     const [enableShared, setEnableShared] = useState(false);
//     const [enablePrivate, setEnablePrivate] = useState(false);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [seoLoading, setSeoLoading] = useState(false);
//     const [metaTagsLoading, setMetaTagsLoading] = useState(false);
//     const [categories, setCategories] = useState([]);

//     useEffect(() => {
//         api.get("/categories").then((res) => setCategories(res.data));
//     }, []);

//     useEffect(() => {
//         if (isEditing) {
//             api.get(`/products/${id}`).then((res) => {
//                 const data = res.data;
//                 setFormData({
//                     name: data.name,
//                     description: data.description,
//                     seoDescription: data.seoDescription || "",
//                     metaTitle: data.metaTitle || "",
//                     metaDescription: data.metaDescription || "",
//                     metaKeywords: data.metaKeywords || "",
//                     category: data.category,
//                     priceSharedMonthly: data.priceSharedMonthly || "",
//                     priceSharedYearly: data.priceSharedYearly || "",
//                     privatePriceMonthly: data.privatePriceMonthly || "",
//                     privatePriceYearly: data.privatePriceYearly || "",
//                     image: null,
//                 });
//                 setEnableMonthly(Boolean(data.priceSharedMonthly));
//                 setEnableYearly(Boolean(data.priceSharedYearly));
//                 setEnableShared(Boolean(data.privatePriceMonthly));
//                 setEnablePrivate(Boolean(data.privatePriceYearly));
//                 setImagePreview(data.imageUrl);
//             });
//         }
//     }, [id, isEditing]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const generateSEO = async () => {
//         if (!formData.name || !formData.category) {
//             alert("Please fill Product Name and Category first");
//             return;
//         }

//         setSeoLoading(true);
//         try {
//             const response = isEditing
//                 ? await api.post(`/products/${id}/generate-seo`)
//                 : await api.post("/products/temp/generate-seo", {
//                     name: formData.name,
//                     category: formData.category,
//                     description: formData.description,
//                 });

//             setFormData((prev) => ({
//                 ...prev,
//                 seoDescription: response.data.seoDescription,
//             }));

//             alert("✅ SEO description generated successfully!");
//         } catch (err) {
//             console.error(err);
//             alert("❌ Failed to generate SEO description");
//         } finally {
//             setSeoLoading(false);
//         }
//     };

//     const generateMetaTagsAI = async () => {
//         if (!formData.name || !formData.category) {
//             alert("Please fill Product Name and Category first");
//             return;
//         }

//         setMetaTagsLoading(true);
//         try {
//             const response = await api.post("/products/temp/generate-meta-tags", {
//                 name: formData.name,
//                 category: formData.category,
//                 description: formData.description,
//             });

//             setFormData((prev) => ({
//                 ...prev,
//                 metaTitle: response.data.metaTitle,
//                 metaDescription: response.data.metaDescription,
//                 metaKeywords: response.data.metaKeywords,
//             }));

//             alert("✅ Meta tags generated successfully!");
//         } catch (err) {
//             console.error(err);
//             alert("❌ Failed to generate meta tags");
//         } finally {
//             setMetaTagsLoading(false);
//         }
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         setFormData((prev) => ({ ...prev, image: file }));
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (ev) => setImagePreview(ev.target.result);
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const data = new FormData();

//             // Add non-price fields
//             data.append("name", formData.name);
//             data.append("description", formData.description);
//             data.append("category", formData.category);
//             if (formData.seoDescription) data.append("seoDescription", formData.seoDescription);
//             if (formData.metaTitle) data.append("metaTitle", formData.metaTitle);
//             if (formData.metaDescription) data.append("metaDescription", formData.metaDescription);
//             if (formData.metaKeywords) data.append("metaKeywords", formData.metaKeywords);
//             if (formData.image) data.append("image", formData.image);

//             // Add price fields only if enabled and not empty
//             if (enableMonthly && formData.priceSharedMonthly) {
//                 data.append("priceSharedMonthly", formData.priceSharedMonthly);
//             }
//             if (enableYearly && formData.priceSharedYearly) {
//                 data.append("priceSharedYearly", formData.priceSharedYearly);
//             }
//             if (enableShared && formData.privatePriceMonthly) {
//                 data.append("privatePriceMonthly", formData.privatePriceMonthly);
//             }
//             if (enablePrivate && formData.privatePriceYearly) {
//                 data.append("privatePriceYearly", formData.privatePriceYearly);
//             }

//             console.log("📤 Submitting form data:");
//             for (let pair of data.entries()) {
//                 console.log(pair[0] + ': ' + pair[1]);
//             }

//             const config = { headers: { "Content-Type": "multipart/form-data" } };

//             isEditing
//                 ? await api.put(`/products/${id}`, data, config)
//                 : await api.post("/products", data, config);

//             alert(`✅ Product ${isEditing ? "updated" : "added"} successfully!`);
//             navigate("/admin/products");
//         } catch (err) {
//             console.error(err);
//             alert("❌ Error saving product");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="max-w-5xl mx-auto p-6">
//             <div className="bg-white rounded-xl shadow-lg p-8">
//                 <h2 className="text-2xl font-bold mb-6">
//                     {isEditing ? "Edit Product" : "Add New Product"}
//                 </h2>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Product Name */}
//                     <div>
//                         <label className="block text-sm font-medium mb-1">Product Name</label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             required
//                             className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     {/* Description & SEO Description */}
//                     <div className="space-y-4">
//                         <div>
//                             <label className="block text-sm font-medium mb-1">Description</label>
//                             <textarea
//                                 name="description"
//                                 rows="3"
//                                 value={formData.description}
//                                 onChange={handleChange}
//                                 required
//                                 className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium mb-1">SEO Description</label>
//                             <textarea
//                                 rows="4"
//                                 name="seoDescription"
//                                 value={formData.seoDescription}
//                                 onChange={handleChange}
//                                 disabled={seoLoading}
//                                 className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>

//                         <button
//                             type="button"
//                             onClick={generateSEO}
//                             disabled={seoLoading}
//                             className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
//                         >
//                             {seoLoading ? "Generating..." : "Generate SEO"}
//                         </button>

//                         <p className="text-xs text-gray-500">
//                             AI-optimized description for better search rankings.
//                         </p>
//                     </div>

//                     {/* Meta Tags Section */}
//                     <div className="space-y-4 border-t pt-6">
//                         <h3 className="text-lg font-semibold">Meta Tags (SEO)</h3>

//                         <div>
//                             <label className="block text-sm font-medium mb-1">Meta Title</label>
//                             <input
//                                 type="text"
//                                 name="metaTitle"
//                                 value={formData.metaTitle}
//                                 onChange={handleChange}
//                                 placeholder="e.g., Buy Adobe Photoshop - Best Photo Editing Software"
//                                 className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//                             />
//                             <p className="text-xs text-gray-500 mt-1">Displayed in search results (50-60 characters recommended)</p>
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium mb-1">Meta Description</label>
//                             <textarea
//                                 name="metaDescription"
//                                 rows="3"
//                                 value={formData.metaDescription}
//                                 onChange={handleChange}
//                                 placeholder="Brief description that appears in search results"
//                                 className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//                             />
//                             <p className="text-xs text-gray-500 mt-1">Appears in search results (150-160 characters recommended)</p>
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium mb-1">Meta Keywords</label>
//                             <input
//                                 type="text"
//                                 name="metaKeywords"
//                                 value={formData.metaKeywords}
//                                 onChange={handleChange}
//                                 placeholder="e.g., photo editing, image editor, adobe, design software"
//                                 className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//                             />
//                             <p className="text-xs text-gray-500 mt-1">Comma-separated keywords for SEO</p>
//                         </div>

//                         <button
//                             type="button"
//                             onClick={generateMetaTagsAI}
//                             disabled={metaTagsLoading}
//                             className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
//                         >
//                             {metaTagsLoading ? "⏳ Generating Meta Tags..." : "✨ Generate Meta Tags with AI"}
//                         </button>
//                     </div>

//                     {/* Category */}
//                     <div>
//                         <label className="block text-sm font-medium mb-1">Category</label>
//                         <select
//                             name="category"
//                             value={formData.category}
//                             onChange={handleChange}
//                             required
//                             className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//                         >
//                             <option value="">Select Category</option>
//                             {categories.map((cat) => (
//                                 <option key={cat._id} value={cat.name}>
//                                     {cat.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Shared Account Prices */}
//                     <div>
//                         <h3 className="text-lg font-semibold mb-3">Shared Account Prices</h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div>
//                                 <label className="flex items-center gap-2 mb-2">
//                                     <input
//                                         type="checkbox"
//                                         checked={enableMonthly}
//                                         onChange={() => setEnableMonthly(!enableMonthly)}
//                                     />
//                                     Enable Monthly Price
//                                 </label>
//                                 {enableMonthly && (
//                                     <input
//                                         type="number"
//                                         name="priceSharedMonthly"
//                                         value={formData.priceSharedMonthly}
//                                         onChange={handleChange}
//                                         placeholder="Shared Monthly price"
//                                         className="w-full border rounded-lg px-4 py-2"
//                                     />
//                                 )}
//                             </div>
//                             <div>
//                                 <label className="flex items-center gap-2 mb-2">
//                                     <input
//                                         type="checkbox"
//                                         checked={enableYearly}
//                                         onChange={() => setEnableYearly(!enableYearly)}
//                                     />
//                                     Enable Yearly Price
//                                 </label>
//                                 {enableYearly && (
//                                     <input
//                                         type="number"
//                                         name="priceSharedYearly"
//                                         value={formData.priceSharedYearly}
//                                         onChange={handleChange}
//                                         placeholder="Shared Yearly price"
//                                         className="w-full border rounded-lg px-4 py-2"
//                                     />
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Private Account Prices */}
//                     <div>
//                         <h3 className="text-lg font-semibold mb-3">Private Account Prices</h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div>
//                                 <label className="flex items-center gap-2 mb-2">
//                                     <input
//                                         type="checkbox"
//                                         checked={enableShared}
//                                         onChange={() => setEnableShared(!enableShared)}
//                                     />
//                                     Enable Private Price
//                                 </label>
//                                 {enableShared && (
//                                     <input
//                                         type="number"
//                                         name="privatePriceMonthly"
//                                         value={formData.privatePriceMonthly}
//                                         onChange={handleChange}
//                                         placeholder="Private Monthly price"
//                                         className="w-full border rounded-lg px-4 py-2"
//                                     />
//                                 )}
//                             </div>
//                             <div>
//                                 <label className="flex items-center gap-2 mb-2">
//                                     <input
//                                         type="checkbox"
//                                         checked={enablePrivate}
//                                         onChange={() => setEnablePrivate(!enablePrivate)}
//                                     />
//                                     Enable Private Price
//                                 </label>
//                                 {enablePrivate && (
//                                     <input
//                                         type="number"
//                                         name="privatePriceYearly"
//                                         value={formData.privatePriceYearly}
//                                         onChange={handleChange}
//                                         placeholder="Private Yearly price"
//                                         className="w-full border rounded-lg px-4 py-2"
//                                     />
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Image */}
//                     <div>
//                         <label className="block text-sm font-medium mb-1">Product Image</label>
//                         <input type="file" accept="image/*" onChange={handleImageChange} />
//                         {imagePreview && (
//                             <img
//                                 src={imagePreview}
//                                 alt="Preview"
//                                 className="mt-4 w-40 h-40 object-cover rounded-lg border"
//                             />
//                         )}
//                     </div>

//                     {/* Submit */}
//                     <div className="pt-4">
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-60"
//                         >
//                             {loading
//                                 ? "Saving..."
//                                 : isEditing
//                                     ? "Update Product"
//                                     : "Add Product"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ProductForm;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../../api/api";
import { toast } from "react-toastify";
import { IoSparkles } from "react-icons/io5";

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        seoDescription: "",
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        category: "",
        priceSharedMonthly: "",
        priceSharedYearly: "",
        privatePriceMonthly: "",
        privatePriceYearly: "",
        image: null,
    });

    const [enableMonthly, setEnableMonthly] = useState(true);
    const [enableYearly, setEnableYearly] = useState(false);
    const [enableShared, setEnableShared] = useState(false);
    const [enablePrivate, setEnablePrivate] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [seoLoading, setSeoLoading] = useState(false);
    const [metaTagsLoading, setMetaTagsLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    // Fetch categories
    useEffect(() => {
        api.get("/categories").then((res) => setCategories(res.data));
    }, []);

    // Fetch product data if editing
    useEffect(() => {
        if (isEditing) {
            api.get(`/products/${id}`).then((res) => {
                const data = res.data;
                setFormData({
                    name: data.name,
                    description: data.description,
                    seoDescription: data.seoDescription || "",
                    metaTitle: data.metaTitle || "",
                    metaDescription: data.metaDescription || "",
                    metaKeywords: data.metaKeywords || "",
                    category: data.category,
                    priceSharedMonthly: data.priceSharedMonthly || "",
                    priceSharedYearly: data.priceSharedYearly || "",
                    privatePriceMonthly: data.privatePriceMonthly || "",
                    privatePriceYearly: data.privatePriceYearly || "",
                    image: null,
                });
                setEnableMonthly(Boolean(data.priceSharedMonthly));
                setEnableYearly(Boolean(data.priceSharedYearly));
                setEnableShared(Boolean(data.privatePriceMonthly));
                setEnablePrivate(Boolean(data.privatePriceYearly));
                setImagePreview(data.imageUrl);
            });
        }
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, image: file }));
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const generateSEO = async () => {
        if (!formData.name || !formData.category) {
            toast.error("Please fill Product Name and Category first");
            return;
        }
        setSeoLoading(true);
        try {
            const response = isEditing
                ? await api.post(`/products/${id}/generate-seo`)
                : await api.post("/products/temp/generate-seo", {
                    name: formData.name,
                    category: formData.category,
                    description: formData.description,
                });
            setFormData((prev) => ({ ...prev, seoDescription: response.data.seoDescription }));
            toast.success("SEO description generated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate SEO description");
        } finally {
            setSeoLoading(false);
        }
    };

    const generateMetaTagsAI = async () => {
        if (!formData.name || !formData.category) {
            toast.error("Please fill Product Name and Category first");
            return;
        }
        setMetaTagsLoading(true);
        try {
            const response = await api.post("/products/temp/generate-meta-tags", {
                name: formData.name,
                category: formData.category,
                description: formData.description,
            });
            setFormData((prev) => ({
                ...prev,
                metaTitle: response.data.metaTitle,
                metaDescription: response.data.metaDescription,
                metaKeywords: response.data.metaKeywords,
            }));
            toast.success("Meta tags generated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate meta tags");
        } finally {
            setMetaTagsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value) data.append(key, value);
            });
            if (!enableMonthly) data.delete("priceSharedMonthly");
            if (!enableYearly) data.delete("priceSharedYearly");
            if (!enableShared) data.delete("privatePriceMonthly");
            if (!enablePrivate) data.delete("privatePriceYearly");

            const config = { headers: { "Content-Type": "multipart/form-data" } };

            isEditing
                ? await api.put(`/products/${id}`, data, config)
                : await api.post("/products", data, config);

            toast.success(`Product ${isEditing ? "updated" : "added"} successfully!`);
            navigate("/admin/products");
        } catch (err) {
            console.error(err);
            toast.error("Error saving product");
        } finally {
            setLoading(false);
        }
    };

    const fieldVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" } }),
    };

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-5xl mx-auto bg-gray-800 text-gray-200 rounded-xl shadow-lg p-8"
            >
                <h2 className="text-2xl font-bold mb-6">{isEditing ? "Edit Product" : "Add New Product"}</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Name */}
                    <motion.div custom={0} initial="hidden" animate="visible" variants={fieldVariants}>
                        <label className="block text-sm font-medium mb-1">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
                        />
                    </motion.div>

                    {/* Category */}
                    <motion.div custom={3} initial="hidden" animate="visible" variants={fieldVariants}>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </motion.div>

                    {/* Description & SEO */}
                    <motion.div custom={1} initial="hidden" animate="visible" variants={fieldVariants}>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
                        />

                        <label className="block text-sm font-medium mb-1 mt-4">SEO Description</label>
                        <textarea
                            name="seoDescription"
                            rows="4"
                            value={formData.seoDescription}
                            onChange={handleChange}
                            disabled={seoLoading}
                            className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={generateSEO}
                            disabled={seoLoading}
                            className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {seoLoading ? (
                                <>
                                    <span className="h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                "Generate SEO"
                            )}
                        </button>
                    </motion.div>

                    {/* Meta Tags */}
                    <motion.div custom={2} initial="hidden" animate="visible" variants={fieldVariants} className="space-y-4 border-t pt-6">
                        <h3 className="text-lg font-semibold">Meta Tags (SEO)</h3>
                        <input
                            type="text"
                            name="metaTitle"
                            value={formData.metaTitle}
                            onChange={handleChange}
                            placeholder="Meta Title"
                            className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                            name="metaDescription"
                            rows="3"
                            value={formData.metaDescription}
                            onChange={handleChange}
                            placeholder="Meta Description"
                            className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            name="metaKeywords"
                            value={formData.metaKeywords}
                            onChange={handleChange}
                            placeholder="Meta Keywords"
                            className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={generateMetaTagsAI}
                            disabled={metaTagsLoading}
                            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {metaTagsLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <span className="h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                                    Generating...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <IoSparkles className="text-lg" />
                                    Generate Meta Tags with AI
                                </div>
                            )}
                        </button>
                    </motion.div>

                    {/* Prices */}
                    <motion.div custom={4} initial="hidden" animate="visible" variants={fieldVariants}>
                        <h3 className="text-lg font-semibold mb-3">Shared Account Prices</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 mb-2">
                                    <input type="checkbox" checked={enableMonthly} onChange={() => setEnableMonthly(!enableMonthly)} />
                                    Enable Monthly Price
                                </label>
                                {enableMonthly && (
                                    <input
                                        type="number"
                                        name="priceSharedMonthly"
                                        value={formData.priceSharedMonthly}
                                        onChange={handleChange}
                                        placeholder="Shared Monthly price"
                                        className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200"
                                    />
                                )}
                            </div>
                            <div>
                                <label className="flex items-center gap-2 mb-2">
                                    <input type="checkbox" checked={enableYearly} onChange={() => setEnableYearly(!enableYearly)} />
                                    Enable Yearly Price
                                </label>
                                {enableYearly && (
                                    <input
                                        type="number"
                                        name="priceSharedYearly"
                                        value={formData.priceSharedYearly}
                                        onChange={handleChange}
                                        placeholder="Shared Yearly price"
                                        className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200"
                                    />
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div custom={5} initial="hidden" animate="visible" variants={fieldVariants}>
                        <h3 className="text-lg font-semibold mb-3">Private Account Prices</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 mb-2">
                                    <input type="checkbox" checked={enableShared} onChange={() => setEnableShared(!enableShared)} />
                                    Enable Private Price
                                </label>
                                {enableShared && (
                                    <input
                                        type="number"
                                        name="privatePriceMonthly"
                                        value={formData.privatePriceMonthly}
                                        onChange={handleChange}
                                        placeholder="Private Monthly price"
                                        className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200"
                                    />
                                )}
                            </div>
                            <div>
                                <label className="flex items-center gap-2 mb-2">
                                    <input type="checkbox" checked={enablePrivate} onChange={() => setEnablePrivate(!enablePrivate)} />
                                    Enable Private Price
                                </label>
                                {enablePrivate && (
                                    <input
                                        type="number"
                                        name="privatePriceYearly"
                                        value={formData.privatePriceYearly}
                                        onChange={handleChange}
                                        placeholder="Private Yearly price"
                                        className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200"
                                    />
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Image */}
                    <motion.div custom={6} initial="hidden" animate="visible" variants={fieldVariants}>
                        <label className="block text-sm font-medium mb-1">Product Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="text-gray-200" />
                        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-40 h-40 object-cover rounded-lg border" />}
                    </motion.div>

                    {/* Submit */}
                    <motion.div custom={7} initial="hidden" animate="visible" variants={fieldVariants} className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-60 w-full sm:w-auto"
                        >
                            {loading ? "Saving..." : isEditing ? "Update Product" : "Add Product"}
                        </button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default ProductForm;
