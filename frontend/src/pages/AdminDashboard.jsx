import React, { useEffect, useState } from "react";
import { api } from "../api/client";

export default function AdminDashboard() {
  const [vendors, setVendors] = useState([]);

  const load = async () => {
    const res = await api.get("/admin/vendors");
    setVendors(res.data);
  };

  useEffect(() => { load(); }, []);

  const approve = async (id, is_approved) => {
    await api.patch(`/admin/vendors/${id}`, { is_approved });
    load();
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Admin Dashboard</h2>
        <p style={{ color:"var(--muted)" }}>Approve vendors (optional feature).</p>
        {vendors.map(v => (
          <div key={v.id} className="card" style={{ marginTop: 10, display:"flex", justifyContent:"space-between" }}>
            <div>
              <b>{v.email}</b>
              <div className="badge">Approved: {String(v.is_approved)}</div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn btnPrimary" onClick={()=>approve(v.id, true)}>Approve</button>
              <button className="btn btnDanger" onClick={()=>approve(v.id, false)}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}