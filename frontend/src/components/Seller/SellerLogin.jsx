import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify'; // Add this import

const SellerLogin = () => {
    const { isSeller, setIsSeller, navigate } = useAppContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // Add loading state

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        // Add basic validation
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.post('/api/v1/seller/login', { email, password });
            
            if (data.success) {
                setIsSeller(true);
                navigate('/seller');
                toast.success('Login successful');
            } else {
                toast.error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isSeller) {
            navigate("/seller");
        }
    }, [isSeller, navigate]);

    if (isSeller) return null;

    return (
        <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center text-sm text-gray-600'>
            <div className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200'>
                <p className='text-2xl font-medium m-auto'>
                    <span className='text-indigo-500'>Seller</span> Login
                </p>
                
                <div className='w-full'>
                    <label htmlFor="email" className='block'>Email</label>
                    <input 
                        id="email"
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email} 
                        type="email" 
                        placeholder='Enter your email' 
                        className='border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500'
                        required
                    />
                </div>
                
                <div className='w-full'>
                    <label htmlFor="password" className='block'>Password</label>
                    <input 
                        id="password"
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                        type="password" 
                        placeholder='Enter your password' 
                        className='border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500'
                        required
                    />
                </div>
                
                <button 
                    type="submit" 
                    className='bg-indigo-500 text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50'
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </div>
        </form>
    );
};

export default SellerLogin;