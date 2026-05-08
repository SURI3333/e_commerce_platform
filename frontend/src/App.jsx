import { Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import VendorDashboard from "./pages/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard";


export default function App() {
  return (
    <Routes>

      {/* ✅ DEFAULT HOME ROUTE */}
      <Route path="/" element={<Auth />} />

      {/* ✅ OTHER PAGES */}
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/edit-product/:id" element={<EditProduct />} />
      <Route path="/vendor-dashboard" element={<VendorDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      {/* ✅ OPTIONAL FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}