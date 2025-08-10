import React, { useState, useEffect, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCart from "../components/ProductCart";
import { categories as sharedCategories } from "../assets/assets.js"; // Adjust the path if needed

const AllProducts = () => {
  const { products, searchQuery = "", navigate } = useAppContext(); // Ensure default is ''
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedShopId, setSelectedShopId] = useState("");

  const priceRanges = [
    { label: "All", value: "" },
    { label: "Under ₹50", value: "0-50" },
    { label: "₹50 - ₹100", value: "50-100" },
    { label: "Above ₹100", value: "100-" },
  ];

  // Build unique shops from products
  const shops = useMemo(() => {
    const map = new Map();
    for (const p of products) {
      const sellerId = p?.seller?._id || p?.seller; // supports populated or raw id
      const sellerName = p?.seller?.name || "Shop";
      if (sellerId && !map.has(sellerId)) {
        map.set(sellerId, { id: sellerId, name: sellerName });
      }
    }
    return Array.from(map.values());
  }, [products]);

  useEffect(() => {
    let updatedProducts = products;

    // Apply search filter (with type check)
    if (typeof searchQuery === "string" && searchQuery.trim().length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      updatedProducts = updatedProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Apply shop filter
    if (selectedShopId) {
      updatedProducts = updatedProducts.filter((product) => {
        const sellerId = product?.seller?._id || product?.seller;
        return sellerId === selectedShopId;
      });
    }

    // Apply price filter
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split("-");
      updatedProducts = updatedProducts.filter((product) => {
        const price = parseFloat(product.price);
        if (max) {
          return price >= parseFloat(min) && price <= parseFloat(max);
        } else {
          return price >= parseFloat(min);
        }
      });
    }

    setFilteredProducts(updatedProducts);
  }, [products, searchQuery, selectedCategory, selectedPriceRange]);

  return (
    <div className="mt-16 px-4 md:px-8 flex flex-col">
      {/* Header */}
      <div className="flex flex-col items-end w-max">
        <p className="text-2xl font-medium uppercase">All Products</p>
        <div className="w-16 h-0.5 bg-indigo-500 rounded-full mt-1" />
      </div>
      <br />

      {/* Shops row */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-6">
        {shops.map((shop) => (
          <button
            key={shop.id}
            onClick={() =>
              setSelectedShopId((prev) => (prev === shop.id ? "" : shop.id))
            }
            className={`px-4 py-2 rounded-full border ${
              selectedShopId === shop.id
                ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                : "border-gray-300 bg-white text-gray-700"
            } whitespace-nowrap`}
            title={`View products from ${shop.name}`}
          >
            {shop.name}
          </button>
        ))}
        {shops.length === 0 && (
          <span className="text-gray-400">No shops yet</span>
        )}
      </div>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">All Categories</option>
          {sharedCategories.map((cat, index) => (
            <option key={index} value={cat.path}>
              {cat.text}
            </option>
          ))}
        </select>

        {/* Price Filter */}
        <select
          value={selectedPriceRange}
          onChange={(e) => setSelectedPriceRange(e.target.value)}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {priceRanges.map((range, index) => (
            <option key={index} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>

        {/* Clear Shop Filter */}
        {selectedShopId && (
          <button
            onClick={() => setSelectedShopId("")}
            className="px-3 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Clear Shop
          </button>
        )}
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts
          .filter((product) => product.inStock)
          .map((product, index) => (
            <ProductCart key={index} product={product} />
          ))}

        {filteredProducts.length === 0 && (
          <p className="col-span-full text-center text-gray-600 mt-10">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
