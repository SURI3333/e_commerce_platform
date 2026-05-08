import { useState, useEffect } from "react";
import { api } from "../api/client";
import { useParams } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/products/${id}`);
      setForm(res.data);
    };
    load();
  }, [id]);

  const handleUpdate = async () => {
    await api.put(`/products/${id}`, form);
    alert("Updated ✅");
  };

  return (
    <div className="form-box">
      <h2>Edit Product</h2>

      {Object.keys(form).map((key) => (
        <input
          key={key}
          value={form[key]}
          onChange={(e) =>
            setForm({ ...form, [key]: e.target.value })
          }
        />
      ))}

      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}