import { Link } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");

  return (
    <nav className="bg-black/60 p-4 flex justify-between text-white">
      <h2 className="font-bold">E-Commerce</h2>

      <div className="flex gap-4">
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
          </>
        )}
      </div>
    </nav>
  );
}