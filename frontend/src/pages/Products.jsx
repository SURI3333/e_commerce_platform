import { useMemo, useState } from "react";
import { useProducts, useAddToCart } from "../api/hooks";
import "../styles/theme.css";
import { useNavigate } from "react-router-dom";



function imageUrl(name) {
    // Reliable placeholder image with product name text
    return `https://placehold.co/64x64/ffffff/111111.png?text=${encodeURIComponent(
        name?.slice(0, 8) || "Item"
    )}`;
}

function statusFromStock(stock) {
    if (stock === 0) return "Out of stock";
    if (stock <= 5) return "Low stock";
    return "In stock";
}

export default function Products() {
    const { data: products = [], isLoading, isError, error } = useProducts();
    const addToCart = useAddToCart();
    const navigate = useNavigate();
    const [q, setQ] = useState("");

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return products;
        return products.filter((p) => {
            const name = (p.name || "").toLowerCase();
            const desc = (p.description || "").toLowerCase();
            const cat = (p.category || "").toLowerCase();
            return name.includes(s) || desc.includes(s) || cat.includes(s);
        });
    }, [q, products]);

    const handleAdd = (p) => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token) {
            alert("Please login first");
            return;
        }
        if (role !== "customer") {
            alert("Only customer can add to cart");
            return;
        }
        if (p.stock <= 0) {
            alert("Out of stock");
            return;
        }

        addToCart.mutate(
            { product_id: p.id, quantity: 1 },
            {
                onSuccess: () => alert("Added to cart"),
                onError: (err) => {
                    const msg =
                        err?.response?.data?.detail ||
                        `Add to cart failed (status ${err?.response?.status || "?"})`;
                    alert(msg);
                },
            }
        );
    };

    return (
        <div className="dash-page">
            {/* Top header */}
            <div className="dash-topbar">
                <div className="dash-brand">GoShopping</div>
                <div className="dash-toplinks">
                    <span className="dash-link">Products</span>
                    <span
                        className="dash-link"
                        onClick={() => navigate("/cart")}
                        style={{ cursor: "pointer" }}
                    >
                        Cart
                    </span>
                    <span onClick={() => navigate("/orders")}>Orders</span>
                </div>
            </div>

            {/* Quick tiles row */}
            <div className="dash-tiles">
                <div className="dash-tile active">
                    <div className="tile-icon">📦</div>
                    <div>
                        <div className="tile-title">Products</div>
                        <div className="tile-sub">{products.length} items</div>
                    </div>
                </div>

                <div className="dash-tile">
                    <div className="tile-icon">🛒</div>
                    <div>
                        <div className="tile-title">Cart</div>
                        <div className="tile-sub">Add items</div>
                    </div>
                </div>

                <div className="dash-tile">
                    <div className="tile-icon">🧾</div>
                    <div>
                        <div className="tile-title">Orders</div>
                        <div className="tile-sub">Track status</div>
                    </div>
                </div>
            </div>

            {/* Content card */}
            <div className="dash-card">
                <div className="dash-card-head">
                    <div>
                        <div className="dash-title">Products</div>
                        <div className="dash-muted">Browse products and add to cart</div>
                    </div>

                    <div className="dash-actions">
                        <input
                            className="dash-search"
                            placeholder="Search name / category / description..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                        <div className="dash-count">
                            Showing <b>{filtered.length}</b> Products
                        </div>
                    </div>
                </div>

                {isLoading && <div className="dash-msg">Loading products...</div>}
                {isError && (
                    <div className="dash-msg error">
                        Failed to load: {error?.message || "unknown error"}
                    </div>
                )}

                {!isLoading && !isError && (
                    <div className="dash-table-wrap">
                        <table className="dash-table">
                            <thead>
                                <tr>
                                    <th style={{ width: 70 }}>Image</th>
                                    <th>Product</th>
                                    <th style={{ width: 90 }}>Stock</th>
                                    <th style={{ width: 110 }}>Price</th>
                                    <th style={{ width: 140 }}>Status</th>
                                    <th style={{ width: 160 }}>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filtered.map((p) => (
                                    <tr key={p.id}>
                                        <td>
                                            <img
                                                className="pimg"
                                                src={imageUrl(p.name)}
                                                alt={p.name}
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        "https://placehold.co/64x64/eeeeee/111111.png?text=No";
                                                }}
                                            />
                                        </td>

                                        <td>
                                            <div className="pname">{p.name}</div>
                                            <div className="pdesc">
                                                {p.description || "No description"}
                                            </div>
                                            <div className="ptags">
                                                <span className="tag">{p.category || "general"}</span>
                                                <span className="tag subtle">Vendor #{p.vendor_id}</span>
                                            </div>
                                        </td>

                                        <td>
                                            <span className="pill">{p.stock}</span>
                                        </td>

                                        <td>
                                            <span className="price">₹{p.price}</span>
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    "status " +
                                                    (p.stock === 0
                                                        ? "danger"
                                                        : p.stock <= 5
                                                            ? "warn"
                                                            : "ok")
                                                }
                                            >
                                                {statusFromStock(p.stock)}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className="btn-mini dark"
                                                onClick={() => handleAdd(p)}
                                                disabled={addToCart.isPending || p.stock <= 0}
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                className="btn-mini light"
                                                onClick={() => alert(`Product ID: ${p.id}`)}
                                            >
                                                View
                                            </button>

                                            <button
                                                className="btn"
                                                onClick={() => window.location.href = "/add-product"}
                                            >
                                                + Add Product
                                            </button>

                                        </td>
                                    </tr>
                                ))}

                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ padding: 20, textAlign: "center" }}>
                                            No products found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}