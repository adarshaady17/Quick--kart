import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';

const AdminProducts = () => {
    const { axios, products, fetchProducts } = useAppContext();
    const [pendingProducts, setPendingProducts] = useState([]);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchPendingProducts();
    }, []);

    const fetchPendingProducts = async () => {
        try {
            const { data } = await axios.get('/api/v1/admin/products/pending');
            if (data.success) {
                setPendingProducts(data.products);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const handleApprove = async (productId, action) => {
        try {
            const { data } = await axios.post('/api/v1/admin/products/approve', {
                productId,
                action,
                rejectionReason: action === 'reject' ? rejectionReason : ''
            });

            if (data.success) {
                toast.success(data.message);
                fetchPendingProducts();
                fetchProducts();
                setRejectionReason('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-6">Pending Product Approvals</h1>
            
            {pendingProducts.length === 0 ? (
                <p className="text-gray-500">No pending products for approval</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingProducts.map(product => (
                        <div key={product._id} className="border rounded-lg p-4 shadow-sm">
                            <div className="flex gap-4 mb-4">
                                {product.image.slice(0, 3).map((img, idx) => (
                                    <img 
                                        key={idx} 
                                        src={img} 
                                        alt={product.name} 
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                ))}
                            </div>
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-2">
                                Seller: {product.seller?.name || 'Unknown'}
                            </p>
                            <p className="text-gray-600 text-sm mb-2">
                                Category: {product.category}
                            </p>
                            <div className="flex justify-between mb-3">
                                <span className="text-gray-500 line-through">
                                    ${product.price}
                                </span>
                                <span className="font-bold text-primary">
                                    ${product.offerPrice}
                                </span>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rejection Reason (if applicable)
                                </label>
                                <input
                                    type="text"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="Enter reason for rejection"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleApprove(product._id, 'approve')}
                                    className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleApprove(product._id, 'reject')}
                                    className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminProducts;