// src/pages/admin/AdminAllProducts.jsx

import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AdminAllProducts = () => {
  const { axios } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products
  const fetchAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/admin/products/all");
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  // Delete product by ID
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      const { data } = await axios.delete(`/api/v1/admin/products/${id}`);
      if (data.success) {
        toast.success("Product deleted successfully");
        fetchAllProducts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 h-[95vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">All Products</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white shadow rounded-lg p-4">
              <img
                src={product.image?.[0]}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-600 mb-1">Category: {product.category}</p>
              <p className="text-sm text-gray-600 mb-1">
                Seller: {product.seller?.name || "Unknown"}
              </p>
              <div className="flex justify-between items-center mt-2 mb-4">
                <span className="line-through text-gray-400">${product.price}</span>
                <span className="text-green-600 font-bold">${product.offerPrice}</span>
              </div>
              <button
                onClick={() => handleDelete(product._id)}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAllProducts;
