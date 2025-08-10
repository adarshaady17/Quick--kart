import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const UserProfile = () => {
  const { user, axios, setUser, currency } = useAppContext();
  const [addresses, setAddresses] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get("/api/v1/address/get");
        if (data.success) setAddresses(data.addresses || []);
      } catch {}
    };
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/v1/order/user");
        if (data.success) setOrders(data.orders || []);
      } catch {}
    };
    if (user) fetchAddresses();
    if (user) fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-10">
        <p className="text-gray-600">Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-6 sm:py-10">
      <div className="flex items-start sm:items-center flex-col sm:flex-row gap-4 sm:gap-6">
        <img
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border"
          src={
            user.profilePhoto ||
            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          }
          alt="profile"
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const formData = new FormData();
            formData.append("photo", file);
            try {
              setIsUploading(true);
              const { data } = await axios.post(
                "/api/v1/user/profile/photo",
                formData,
                {
                  headers: { "Content-Type": "multipart/form-data" },
                }
              );
              if (data.success) {
                toast.success("Profile photo updated");
                setUser(data.user);
              } else {
                toast.error(data.message);
              }
            } catch (error) {
              toast.error(error.response?.data?.message || error.message);
            } finally {
              setIsUploading(false);
            }
          }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 border rounded text-sm w-full sm:w-auto"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Change Photo"}
        </button>
        <div className="min-w-0">
          <p className="text-2xl font-medium leading-tight break-words">
            {user.name}
          </p>
          <p className="text-gray-600 break-all">{user.email}</p>
          <p className="text-sm mt-1">
            Role: <span className="font-medium capitalize">{user.role}</span>
          </p>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-xl font-medium">Saved Addresses</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {addresses.length === 0 && (
            <p className="text-gray-600">No addresses saved.</p>
          )}
          {addresses.map((addr) => (
            <div key={addr._id} className="border rounded p-4">
              <p className="font-medium">
                {addr.firstName} {addr.lastName}
              </p>
              <p className="text-gray-700">{addr.email}</p>
              <p className="text-gray-700 mt-1">
                {addr.street}, {addr.city}, {addr.state} - {addr.zipcode}
              </p>
              <p className="text-gray-700">{addr.country}</p>
              <p className="text-gray-600 mt-1">Phone: {addr.phone}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <p className="text-xl font-medium">Recent Orders</p>
        {orders.length === 0 && (
          <p className="text-gray-600 mt-3">No recent orders.</p>
        )}
        <div className="mt-4 space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order._id} className="border rounded p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-sm text-gray-600">
                <span className="truncate">OrderId: {order._id}</span>
                <span>Payment: {order.paymentType}</span>
                <span>
                  Total: {currency} {order.amount}
                </span>
                <span>Status: {order.status}</span>
                <span>
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img
                      src={it.product?.image?.[0]}
                      alt=""
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {it.product?.name}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Qty: {it.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
