import {
  useCart,
  useUpdateCartQty,
  useCheckout
} from "../api/hooks";

import "../styles/theme.css";

export default function Cart() {
  const { data: cart, isLoading } = useCart();
  const updateQty = useUpdateCartQty();
  const checkout = useCheckout();

  // ✅ Loading
  if (isLoading) {
    return <div>Loading cart...</div>;
  }

  const items = cart?.items || [];

  const total = items.reduce((sum, item) => {
    return sum + (item.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="cart-container">

      <h2>Your Cart</h2>

      {items.length === 0 && <p>No items in cart</p>}

      {items.map((item) => (
        <div key={item.id} className="cart-item">

          {/* ✅ IMAGE */}
          <img
            src={`https://picsum.photos/120?random=${item.product_id}`}
            alt={item.name}
          />

          {/* ✅ DETAILS */}
          <div className="cart-details">
            <h4>{item.name}</h4>
            <p>₹{item.price}</p>

            <div className="qty-box">

              {/* ✅ DECREASE */}
              <button
                onClick={() =>
                  updateQty.mutate({
                    cart_item_id: item.id,
                    quantity: Math.max(1, item.quantity - 1),
                  })
                }
              >
                -
              </button>

              <span>{item.quantity}</span>

              {/* ✅ INCREASE */}
              <button
                onClick={() =>
                  updateQty.mutate({
                    cart_item_id: item.id,
                    quantity: item.quantity + 1,
                  })
                }
              >
                +
              </button>

            </div>
          </div>

        </div>
      ))}

      <h3>Total: ₹{total}</h3>

                <button
            className="btn"
            onClick={() => {
                const token = localStorage.getItem("token");
                const role = localStorage.getItem("role");

                if (!token) return alert("Please login first ❌");
                if (role !== "customer") return alert("Only customer can checkout ❌");

                if (!items.length) return alert("Cart is empty ❌");

                checkout.mutate();
            }}
            >
            Checkout
            </button>
    </div>
  );
}