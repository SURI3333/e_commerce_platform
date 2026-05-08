import { useMyOrders } from "../api/hooks";

export default function Orders() {
  const { data: orders = [] } = useMyOrders();

  return (
    <div>
      <h2>My Orders</h2>

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <p>Order ID: {order.id}</p>
          <p>Status: {order.status}</p>
          <p>Total: ₹{order.total_amount}</p>
        </div>
      ))}
    </div>
  );
}