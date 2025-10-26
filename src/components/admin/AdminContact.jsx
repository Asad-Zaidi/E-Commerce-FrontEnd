// src/components/admin/AdminContact.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "./AdminContact.css";

const AdminContact = () => {
    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [social, setSocial] = useState({});
    const [extraFields, setExtraFields] = useState({}); // object mapping key->value
    const [status, setStatus] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/contact");
                setContact(res.data);
                setSocial(res.data.social || {});
                setExtraFields(Object.fromEntries(res.data.extraFields || []));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);
        try {
            const payload = {
                companyName: contact.companyName,
                whatsapp: contact.whatsapp,
                email: contact.email,
                social,
                extraFields,
            };
            const res = await api.put("/contact", payload);
            setContact(res.data);
            setStatus({ type: "success", msg: "Contact updated" });
        } catch (err) {
            console.error("update:", err);
            setStatus({ type: "error", msg: "Update failed" });
        }
    };

    const setExtraKey = (k, v) => setExtraFields((s) => ({ ...s, [k]: v }));

    if (loading) return <div>Loading...</div>;

    return (
        <div className="admin-contact-page">
            <h2>Contact Settings</h2>
            <form className="admin-contact-form" onSubmit={handleSubmit}>
                <label>Company Title</label>
                <input value={contact.companyName} onChange={(e) => setContact({ ...contact, companyName: e.target.value })} />

                <label>WhatsApp Number</label>
                <input value={contact.whatsapp} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} placeholder="+92300xxxxxxx" />

                <label>Email</label>
                <input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="admin@example.com" />

                <h4>Social Links</h4>
                <label>Facebook</label>
                <input value={social.facebook || ""} onChange={(e) => setSocial({ ...social, facebook: e.target.value })} />
                <label>Instagram</label>
                <input value={social.instagram || ""} onChange={(e) => setSocial({ ...social, instagram: e.target.value })} />
                <label>YouTube</label>
                <input value={social.youtube || ""} onChange={(e) => setSocial({ ...social, youtube: e.target.value })} />
                <label>TikTok</label>
                <input value={social.tiktok || ""} onChange={(e) => setSocial({ ...social, tiktok: e.target.value })} />
                <label>X (Twitter)</label>
                <input value={social.x || ""} onChange={(e) => setSocial({ ...social, x: e.target.value })} />

                <h4>Extra Fields (optional)</h4>
                <small>These appear on the public contact box. Add key/value pairs.</small>
                <div className="extra-grid">
                    {Object.keys(extraFields || {}).map((k) => (
                        <div key={k} className="extra-row">
                            <input value={k} readOnly />
                            <input value={extraFields[k]} onChange={(e) => setExtraKey(k, e.target.value)} />
                            <button type="button" onClick={() => { const copy = { ...extraFields }; delete copy[k]; setExtraFields(copy); }}>Remove</button>
                        </div>
                    ))}
                </div>

                <div className="add-extra">
                    <ExtraFieldAdder onAdd={(k, v) => setExtraKey(k, v)} />
                </div>

                <div style={{ marginTop: 18 }}>
                    <button type="submit" className="save-btn">Save Contact</button>
                    {status && <span className={`status ${status.type}`}>{status.msg}</span>}
                </div>
            </form>
        </div>
    );
};

function ExtraFieldAdder({ onAdd }) {
    const [k, setK] = useState("");
    const [v, setV] = useState("");
    return (
        <div className="extra-adder">
            <input placeholder="Field name (e.g. Support Hours)" value={k} onChange={(e) => setK(e.target.value)} />
            <input placeholder="Value" value={v} onChange={(e) => setV(e.target.value)} />
            <button type="button" onClick={() => { if (!k) return; onAdd(k, v); setK(""); setV(""); }}>Add</button>
        </div>
    );
}

export default AdminContact;
