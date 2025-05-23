import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminOrders = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/admin/orders");
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/v1/admin/orders/${orderId}/status`, { status });
      toast.success("Order status updated");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const { data } = await axios.get(`/api/v1/admin/orders/${orderId}`);
      if (data.success) {
        setSelectedOrder(data.order);
        setShowModal(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const statusColors = {
    "Order Placed": "bg-blue-100 text-blue-800",
    Processing: "bg-yellow-100 text-yellow-800",
    Shipped: "bg-purple-100 text-purple-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  if (loading) {
    return (
      <div className="flex-1 h-[95vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Payment</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 font-medium">{order._id.slice(-8)}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{order.userId?.name}</p>
                      <p className="text-sm text-gray-500">{order.userId?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">${order.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.paymentType === "COD"
                          ? "bg-gray-100"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.paymentType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className={`text-sm rounded border p-1 ${
                        statusColors[order.status] || "bg-gray-100"
                      }`}
                    >
                      {Object.keys(statusColors).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => viewOrderDetails(order._id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold mb-4">
                  Order #{selectedOrder._id.slice(-8)}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Customer Details</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedOrder.userId?.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedOrder.userId?.email}
                    </p>
                    {selectedOrder.userId?.phone && (
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {selectedOrder.userId.phone}
                      </p>
                    )}
                  </div>

                  <h3 className="font-semibold mt-4 mb-2">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p>{selectedOrder.address?.street}</p>
                    <p>
                      {selectedOrder.address?.city}, {selectedOrder.address?.state}{" "}
                      {selectedOrder.address?.zipCode}
                    </p>
                    <p>{selectedOrder.address?.country}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Order Summary</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.product?.image[0]}
                              alt={item.product?.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div>
                              <p className="font-medium">{item.product?.name}</p>
                              <p className="text-sm text-gray-500">
                                {item.quantity} × ${item.product?.offerPrice}
                              </p>
                            </div>
                          </div>
                          <p>
                            ${(item.quantity * item.product?.offerPrice).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t mt-4 pt-4">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${selectedOrder.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold mt-2">
                        <span>Total:</span>
                        <span>${selectedOrder.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block font-semibold mb-2">Update Status</label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => {
                        updateStatus(selectedOrder._id, e.target.value);
                        setSelectedOrder({
                          ...selectedOrder,
                          status: e.target.value,
                        });
                      }}
                      className={`w-full p-2 rounded border ${
                        statusColors[selectedOrder.status] || "bg-gray-100"
                      }`}
                    >
                      {Object.keys(statusColors).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;