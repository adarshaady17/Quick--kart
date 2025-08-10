import React from "react";
import Navbar from "./components/navbar.jsx";
import Home from "./pages/Home.jsx";
import Cart from "./pages/cart.jsx";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Footer from "./components/footer.jsx";
import Login from "./components/Login.jsx";
import { useAppContext } from "./context/AppContext.jsx";
import AllProducts from "./pages/AllProducts.jsx";
import ProductCategory from "./pages/ProductCategory.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import AddAddress from "./pages/AddAddress.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import AdminLogin from "./components/Admin/AdminLogin.jsx";
import SellerLayout from "./pages/seller/SellerLayout.jsx";
import AddProduct from "./pages/seller/AddProduct.jsx";
import ProductList from "./pages/seller/ProductList.jsx";
import Orders from "./pages/seller/Orders.jsx";
import AdminLayout from "./components/Admin/AdminLayout.jsx";
import AdminProducts from "./components/Admin/AdminProducts.jsx";
import AdminOrders from "./components/Admin/AdminOrders.jsx";
import AdminStock from "./components/Admin/AdminStock.jsx";
import AdminAllProducts from "./components/Admin/AdminAllProducts.jsx";
import SellerLogin from "./components/SellerLogin.jsx";
import SellerSignup from "./components/SellerSignup.jsx";
import UserProfile from "./pages/UserProfile.jsx";

const App = () => {
  const location = useLocation();
  const isSellerPath = location.pathname.includes("seller");
  const isAdminPath = location.pathname.includes("admin");
  const { showUserLogin, isAdmin, user } = useAppContext();

  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      {!(isSellerPath || isAdminPath) && <Navbar />}
      {showUserLogin ? <Login /> : null}

      <Toaster />

      <div
        className={`${
          isSellerPath || isAdminPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/my-orders" element={<MyOrders />} />
          {/* Admin login at /admin */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* Protected admin routes under /admin/* */}
          <Route
            path="/admin/*"
            element={isAdmin ? <AdminLayout /> : <AdminLogin />}
          >
            <Route path="approvals" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="stock" element={<AdminStock />} />
            <Route path="products" element={<AdminAllProducts />} />
          </Route>

          <Route
            path="/seller/*"
            element={
              user?.role === "seller" ? <SellerLayout /> : <SellerLogin />
            }
          >
            <Route index element={<AddProduct />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
          </Route>
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/signup" element={<SellerSignup />} />
        </Routes>
      </div>
      {!(isSellerPath || isAdminPath) && <Footer />}
    </div>
  );
};

export default App;
