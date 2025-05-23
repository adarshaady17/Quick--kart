import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AdminStock = () => {
    const { axios, products, fetchProducts } = useAppContext();
    const [loading, setLoading] = useState(false);

    const toggleStock = async (productId, currentStatus) => {
        try {
            setLoading(true);
            const { data } = await axios.post('/api/v1/product/stock', {
                id: productId,
                inStock: !currentStatus
            });

            if (data.success) {
                toast.success('Stock status updated');
                fetchProducts();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-6">Product Stock Management</h1>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-3 px-4 text-left">Product</th>
                            <th className="py-3 px-4 text-left">Seller</th>
                            <th className="py-3 px-4 text-left">Price</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id} className="border-b">
                                <td className="py-3 px-4 flex items-center gap-3">
                                    <img 
                                        src={product.image[0]} 
                                        alt={product.name} 
                                        className="w-10 h-10 object-cover rounded"
                                    />
                                    <span>{product.name}</span>
                                </td>
                                <td className="py-3 px-4">{product.seller?.name || 'Unknown'}</td>
                                <td className="py-3 px-4">${product.offerPrice}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        product.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <button
                                        onClick={() => toggleStock(product._id, product.inStock)}
                                        disabled={loading}
                                        className={`px-3 py-1 rounded text-sm ${
                                            product.inStock 
                                                ? 'bg-green-500 hover:bg-green-600 text-white' 
                                                : 'bg-red-500 hover:bg-red-600 text-white'
                                        }`}
                                    >
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminStock;