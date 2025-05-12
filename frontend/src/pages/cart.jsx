import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";
import { loadRazorpay } from "../utils/loadRazorpay";

function Cart() {
  const [showAddress, setShowAddress] = useState(false);
  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  
  const {
    getCartCount,
    products,
    currency,
    removeFromCart,
    cartItems,
    updateCartItem,
    navigate,
    getCartAmount,
    axios,
    user,
    setCartItems,
  } = useAppContext();

  const getCart = () => {
    setIsCartLoading(true);
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      if (product) {
        product.quantity = cartItems[key];
        tempArray.push(product);
      }
    }
    setCartArray(tempArray);
    setIsCartLoading(false);
  };

  const fetchAddresses = async () => {
    setIsAddressLoading(true);
    try {
      const { data } = await axios.get("/api/v1/address/get");

      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to load addresses");
    } finally {
      setIsAddressLoading(false);
    }
  };

  const placeOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address.");
      return;
    }

    setIsPlacingOrder(true);
    try {
      if (paymentOption === 'COD') {
        const { data } = await axios.post("/api/v1/order/cod", {
          userId: user._id,
          items: cartArray.map((item) => ({ product: item._id, quantity: item.quantity })),
          address: selectedAddress._id,
        });

        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      } else {
        const res = await loadRazorpay();
        if (!res) {
          toast.error("Razorpay SDK failed to load.");
          return;
        }

        const { data } = await axios.post("/api/v1/order/razor", {
          userId: user._id,
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });

        if (data.success) {
          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: data.currency,
            name: "Quick-Kart",
            description: "Order Payment",
            order_id: data.orderId,
            handler: function (response) {
              toast.success("Payment Successful!");
              setCartItems({});
              navigate("/my-orders");
            },
            prefill: {
              name: user.name,
              email: user.email,
            },
            theme: {
              color: "#3399cc",
            },
          };

          const razor = new window.Razorpay(options);
          razor.on("payment.failed", function () {
            toast.error("Payment failed. Please try again.");
          });
          razor.open();
        }
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  if (isCartLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return products.length > 0 && cartItems ? (
    <div className="flex flex-col md:flex-row mt-16 relative">
      {/* Loading overlay */}
      {(isLoading || isAddressLoading || isPlacingOrder) && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4">
              {isPlacingOrder 
                ? paymentOption === "COD" 
                  ? "Placing your order..." 
                  : "Processing payment..."
                : "Loading..."}
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-primary"> {getCartCount()} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => {
                  navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                  scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={product.image[0]}
                  alt={product.name}
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>Weight: <span>{product.weight || "N/A"}</span></p>
                  <div className="flex items-center">
                    <p>Qty:</p>
                    <select
                      value={cartItems[product._id]}
                      onChange={(e) => updateCartItem(product._id, Number(e.target.value))}
                      className="outline-none"
                      disabled={isPlacingOrder}
                    >
                      {Array(cartItems[product._id] > 9 ? cartItems[product._id] : 9)
                        .fill("")
                        .map((_, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center">
              {currency} {product.offerPrice * product.quantity}
            </p>
            <button
              onClick={() => removeFromCart(product._id)}
              className="cursor-pointer mx-auto"
              disabled={isPlacingOrder}
            >
              <img
                src={assets.remove_icon}
                alt="Remove icon"
                className="inline-block w-6 h-6"
              />
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
          disabled={isPlacingOrder}
        >
          <img
            src={assets.arrow_right_icon_colored}
            alt="Right arrow"
            className="group-hover:-translate-x-1 transition"
          />
          Continue Shopping
        </button>
      </div>

      {/* Right Side */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                : isAddressLoading ? "Loading addresses..." : "No address found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="hover:underline text-primary cursor-pointer"
              disabled={isAddressLoading || isPlacingOrder}
            >
              {isAddressLoading ? "Loading..." : "Change"}
            </button>
            {showAddress && (
              <div className="absolute top-8 py-1 bg-white border border-gray-300 text-sm w-full z-10">
                {addresses.map((address, index) => (
                  <p
                    key={index}
                    onClick={() => {
                      setShowAddress(false);
                      setSelectedAddress(address);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {address.street}, {address.city}, {address.state}, {address.country}
                  </p>
                ))}
                <p
                  onClick={() => {
                    navigate("/add-address");
                    setShowAddress(false);
                  }}
                  className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
            disabled={isPlacingOrder}
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>{currency} {getCartAmount()}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%) :</span>
            <span>{currency} {(getCartAmount() * 2) / 100}</span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>{currency} {getCartAmount() + (getCartAmount() * 2) / 100}</span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          disabled={isPlacingOrder || !selectedAddress}
          className={`w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition flex items-center justify-center ${
            isPlacingOrder ? 'opacity-75' : ''
          }`}
        >
          {isPlacingOrder ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {paymentOption === "COD" ? "Placing Order..." : "Processing Payment..."}
            </>
          ) : (
            paymentOption === "COD" ? "Place Order" : "Proceed to checkout"
          )}
        </button>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-xl">Your cart is empty</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dull transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default Cart;