import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import { assets } from "../assets/assets.js";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios,
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/v1/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  return (
    <>
      <nav className="flex items-center justify-between px-4 sm:px-6 md:px-16 lg:px-24 py-4 border-b border-gray-300 bg-white relative">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2">
          <NavLink to="/" onClick={() => setOpen(false)}>
            <img className="h-9" src={assets.logo} alt="Quick-Kart Logo" />
          </NavLink>
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-6">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">All Products</NavLink>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center gap-2 border border-gray-300 px-3 rounded-full">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-1.5 bg-transparent outline-none placeholder-gray-500"
              type="text"
              placeholder="Search products"
            />
            <img src={assets.search_icon} alt="search" className="w-4 h-4" />
          </div>

          {/* Cart */}
          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer"
          >
            <img
              src={assets.nav_cart_icon}
              alt="cart"
              className="w-6 opacity-80"
            />
            <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">
              {getCartCount()}
            </button>
          </div>

          {/* Login/User */}
          {!user ? (
            <button
              onClick={() => setShowUserLogin(true)}
              className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full"
            >
              Login
            </button>
          ) : (
            <div className="relative group">
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-600 font-medium">
                  Welcome {user.name} ({user.role})
                </p>
                <img
                  className="w-10 h-10 rounded-full object-cover cursor-pointer border"
                  alt="user"
                  src={
                    user?.profilePhoto ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                />
              </div>
              <ul className="hidden group-hover:block absolute top-12 right-0 bg-white shadow border border-gray-200 py-2.5 w-36 rounded-md text-sm z-40">
                <li
                  onClick={() => navigate("/profile")}
                  className="p-1.5 pl-3 hover:bg-indigo-50 cursor-pointer"
                >
                  Profile
                </li>
                <li
                  onClick={() => navigate("/my-orders")}
                  className="p-1.5 pl-3 hover:bg-indigo-50 cursor-pointer"
                >
                  My Orders
                </li>
                <li
                  onClick={logout}
                  className="p-1.5 pl-3 hover:bg-indigo-50 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="sm:hidden">
          <button onClick={() => setOpen(!open)}>
            <img src={assets.menu_icon} alt="menu" className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="sm:hidden bg-white border-t border-gray-200 shadow-md absolute top-16 left-0 w-full z-50">
          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className="block px-6 py-3 border-b"
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            onClick={() => setOpen(false)}
            className="block px-6 py-3 border-b"
          >
            All Products
          </NavLink>

          {!user ? (
            <button
              onClick={() => {
                setShowUserLogin(true);
                setOpen(false);
              }}
              className="w-full text-left px-6 py-3 border-b"
            >
              Login
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate("/my-orders");
                  setOpen(false);
                }}
                className="w-full text-left px-6 py-3 border-b"
              >
                My Orders
              </button>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="w-full text-left px-6 py-3 border-b"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
