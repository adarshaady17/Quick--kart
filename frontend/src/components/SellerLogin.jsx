import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const SellerLogin = () => {
  const { setUser, axios, navigate } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await axios.post(`/api/v1/user/login`, {
        email,
        password,
        role: "seller",
      });
      if (data.success) {
        setUser(data.user);
        navigate("/seller");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-4 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white p-8"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-indigo-500">Seller</span> Login
        </p>

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
            type="password"
            required
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          className={`bg-indigo-500 hover:bg-indigo-300 transition-all text-white w-full py-2 rounded-md cursor-pointer flex items-center justify-center ${
            isSubmitting ? "opacity-75" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/seller/signup")}
          className="w-full py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
          disabled={isSubmitting}
        >
          Create new account
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
          disabled={isSubmitting}
        >
          Back to Home
        </button>
      </form>
    </div>
  );
};

export default SellerLogin;
