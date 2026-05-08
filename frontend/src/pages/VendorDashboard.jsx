import { useProducts } from "../api/hooks";
import { api } from "../api/client";

export default function VendorDashboard() {
  const { data: products = [] } = useProducts();

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      alert("Deleted ✅");
      window.location.reload();
    } catch {
      alert("Delete failed ❌");
    }
  };

  const role = localStorage.getItem("role");

  if (role !== "vendor") {
    return <h2>Access Denied ❌</h2>;
  }

  return (
    <div className="dash-container">
      <h2>Vendor Dashboard</h2>

      <button
        className="btn"
        onClick={() => (window.location.href = "/add-product")}
      >
        + Add Product
      </button>

      <table className="dash-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>
                <button
                  onClick={() =>
                    (window.location.href = `/edit-product/${p.id}`)
                  }
                >
                  Edit
                </button>

                <button onClick={() => handleDelete(p.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}