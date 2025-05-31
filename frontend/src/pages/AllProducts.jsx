import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCart from '../components/ProductCart';

const AllProducts = () => {
  const { products, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');

  // Categories (you can dynamically get these if needed)
  const categories = ["Vegetables", "Fruits","Drinks", "Instant"];

  // Example price ranges
  const priceRanges = [
    { label: 'All', value: '' },
    { label: 'Under $50', value: '0-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: 'Above $100', value: '100-' },
  ];

  useEffect(() => {
    let updatedProducts = products;

    // Search filter
    if (searchQuery.length > 0) {
      updatedProducts = updatedProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      updatedProducts = updatedProducts.filter(
        product => product.category === selectedCategory
      );
    }

    // Price filter
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-');
      updatedProducts = updatedProducts.filter(product => {
        if (max) {
          return product.price >= parseInt(min) && product.price <= parseInt(max);
        } else {
          return product.price >= parseInt(min);
        }
      });
    }

    setFilteredProducts(updatedProducts);
  }, [products, searchQuery, selectedCategory, selectedPriceRange]);

  return (
    <div className="mt-16 flex flex-col">
      <div className="flex flex-col items-end w-max">
        <p className="text-2xl font-medium uppercase">All products</p>
        <div className="w-16 h-0.5 bg-indigo-500 rounded-full"></div>
      </div>
      <br />

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Price Filter */}
        <select
          value={selectedPriceRange}
          onChange={(e) => setSelectedPriceRange(e.target.value)}
          className="p-2 border rounded"
        >
          {priceRanges.map((range) => (
            <option key={range.label} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredProducts.filter((product) => product.inStock).map((product, index) => (
          <ProductCart key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
