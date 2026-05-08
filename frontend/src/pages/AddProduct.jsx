import { useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await api.post("/products", {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
      });

      alert("Product Added ✅");
      navigate("/products");
    } catch (err) {
      console.log(err);
      alert("Error adding product ❌");
    }
  };

  return (
    <div className="form-box">

      <h2>Add Product</h2>

      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
      <input placeholder="Stock" onChange={(e) => setStock(e.target.value)} />
      <input placeholder="Category" onChange={(e) => setCategory(e.target.value)} />
      <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)} />

      <button className="btn" onClick={handleSubmit}>
        Add Product
      </button>

    </div>
  );
}