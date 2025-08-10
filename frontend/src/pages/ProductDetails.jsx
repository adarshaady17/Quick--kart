import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCart from "../components/ProductCart.jsx"; // if using .jsx extensions
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { products, navigate, currency, addToCart, axios, user } =
    useAppContext();
  const { id } = useParams();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const product = products.find((item) => item._id === id);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter(
        (item) => product.category === item.category
      );
      setRelatedProducts(productsCopy.slice(0, 5));
    }
  }, [products]);

  useEffect(() => {
    setThumbnail(product?.image[0] ? product.image[0] : null);
  }, [product]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`/api/v1/review/${id}`);
        if (data.success) {
          setReviews(data.reviews);
          setAvgRating(data.averageRating || 0);
        }
      } catch (error) {
        // ignore
      }
    };
    if (id) {
      fetchReviews();
    }
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to review");
      return;
    }
    try {
      const { data } = await axios.post("/api/v1/review", {
        productId: id,
        rating: Number(rating),
        comment,
      });
      if (data.success) {
        toast.success("Review submitted");
        setComment("");
        // refresh reviews
        const res = await axios.get(`/api/v1/review/${id}`);
        if (res.data.success) {
          setReviews(res.data.reviews);
          setAvgRating(res.data.averageRating || 0);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    product && (
      <div className="mt-12">
        <p>
          <Link to={"/"}>Home</Link>
          <Link to={"/products"}>Products</Link>
          <Link to={`/products/${product.category.toLowerCase()}`}>
            {product.category}
          </Link>
          <span className="text-indigo-500"> {product.name}</span>
        </p>

        <div className="flex flex-col md:flex-row gap-16 mt-4">
          <div className="flex gap-3">
            <div className="flex flex-col gap-3">
              {product.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image)}
                  className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>

            <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
              <img src={thumbnail} alt="Selected product" />
            </div>
          </div>

          <div className="text-sm w-full md:w-1/2">
            <h1 className="text-3xl font-medium">{product.name}</h1>

            <div className="flex items-center gap-0.5 mt-1">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <img
                    key={i}
                    src={
                      i < Math.round(avgRating)
                        ? assets.star_icon
                        : assets.star_dull_icon
                    }
                    alt=""
                    className="md:w-4 w-3.5"
                  />
                ))}
              <p className="text-base ml-2">({avgRating || 0})</p>
            </div>

            <div className="mt-6">
              <p className="text-gray-500/70 line-through">
                MRP: {currency}
                {product.price}
              </p>
              <p className="text-2xl font-medium">
                MRP: {currency}
                {product.offerPrice}
              </p>
              <span className="text-gray-500/70">(inclusive of all taxes)</span>
            </div>

            <p className="text-base font-medium mt-6">About Product</p>
            <ul className="list-disc ml-4 text-gray-500/70">
              {product.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>

            <div className="flex items-center mt-10 gap-4 text-base">
              <button
                onClick={() => addToCart(product._id)}
                className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  addToCart(product._id);
                  navigate("/cart");
                }}
                className="w-full py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mt-20">
          <div className="flex flex-col items-center w-max">
            <p className="text-3xl font-medium">Related Products</p>
            <div className="w-20 h-0.5 bg-indigo-500 rounded-full mt-2"></div>
          </div>
          <br></br>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts
              .filter((product) => product.inStock)
              .map((product, index) => (
                <ProductCart key={index} product={product} />
              ))}
          </div>
          <button
            onClick={() => {
              navigate("/products");
              scrollTo(0, 0);
            }}
            className="max-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-indigo-500 hover:bg-indigo-300 transition"
          >
            See more
          </button>
        </div>
        {/* Reviews Section */}
        <div className="mt-10">
          <div className="flex flex-col items-start w-full">
            <p className="text-xl font-medium">Customer Reviews</p>
            <div className="w-16 h-0.5 bg-indigo-500 rounded-full mt-1" />
          </div>
          <div className="mt-4 space-y-4">
            {reviews.length === 0 && (
              <p className="text-gray-500">No reviews yet.</p>
            )}
            {reviews.map((r) => (
              <div key={r._id} className="border border-gray-200 rounded p-3">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{r.user?.name || "User"}</p>
                  <div className="flex items-center gap-0.5">
                    {Array(5)
                      .fill("")
                      .map((_, i) => (
                        <img
                          key={i}
                          src={
                            i < r.rating
                              ? assets.star_icon
                              : assets.star_dull_icon
                          }
                          alt=""
                          className="w-3.5"
                        />
                      ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {r.comment && <p className="text-gray-600 mt-1">{r.comment}</p>}
              </div>
            ))}
          </div>

          {/* Add Review */}
          <form
            onSubmit={submitReview}
            className="mt-6 border rounded p-4 space-y-3"
          >
            <p className="font-medium">Write a review</p>
            <div className="flex items-center gap-3">
              <label className="text-sm">Rating:</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="border rounded p-1"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Share your experience (optional)"
              rows={3}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white rounded"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default ProductDetails;
