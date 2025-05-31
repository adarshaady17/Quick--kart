import React from 'react'
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { NavLink, Outlet, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminLayout = () => {
   const { axios, navigate, setIsAdmin, setUser } = useAppContext();
    const sidebarLinks = [
        { name: "Pending Approvals", path: "/admin/approvals", icon: assets.add_icon },
        { name: "All Products", path: "/admin/products", icon: assets.product_list_icon },
        { name: "Orders", path: "/admin/orders", icon: assets.order_icon },
        { name: "Stock", path: "/admin/stock", icon: assets.add_icon },
    ];

    const logout = async () => {
        try {
            const { data } = await axios.get('/api/v1/admin/logout', {
                withCredentials: true // Important for cookies
            });
            
            if (data.success) {
                setIsAdmin(false);
                setUser(null);
                localStorage.removeItem('adminAuth'); // Clear any client-side storage
                toast.success(data.message);
                navigate('/');
            } else {
                toast.error(data.message || 'Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Force logout even if API fails
            setIsAdmin(false);
            setUser(null);
            localStorage.removeItem('adminAuth');
            toast.error(error.response?.data?.message || 'Logout failed');
            navigate('/');
        }
    }

    return (
        <>
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
                <div className="hidden sm:flex items-center gap-8">
                    <Link to='/'>
                        <img className="h-9" src={assets.logo} alt="dummyLogoColored" />
                    </Link>
                </div>
                <div className="flex items-center gap-5 text-gray-500">
                    <p>Hi! Admin</p>
                    <button 
                        onClick={logout}
                        className='px-8 py-2.5 bg-indigo-500 text-white font-medium rounded cursor-pointer hover:bg-indigo-600 transition-colors'
                    >
                        Logout
                    </button>
                </div>
            </div>
            <div className='flex'>
                <div className="md:w-64 w-16 border-r h-[550px] text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
                    {sidebarLinks.map((item) => (
                        <NavLink 
                            to={item.path} 
                            key={item.name} 
                            end={item.path === "/admin"}
                            className={({isActive}) => `flex items-center py-3 px-4 gap-3 
                                ${isActive ? "border-r-4 md:border-r-[6px] bg-indigo-500/10 border-indigo-500 text-indigo-500"
                                    : "hover:bg-gray-100/90 border-white text-gray-700"
                                }`
                            }
                        >
                            <img src={item.icon} alt="" className='w-7 h-7'/>
                            <p className="md:block hidden text-center">{item.name}</p>
                        </NavLink>
                    ))}
                </div>
                <Outlet/>
            </div>
        </>
    )
}

export default AdminLayout;