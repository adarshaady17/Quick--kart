import React, { useState } from 'react'
import {assets, categories} from '../../assets/assets'
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(Array(4).fill(false));

  const {axios} = useAppContext();

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      setIsSubmitting(true);

      const productData = {
        name,
        description: description.split('\n'),
        category,
        price,
        offerPrice,
      }

      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));
      for (let i = 0; i < files.length; i++) {
        if (files[i]) {
          formData.append("image", files[i]);
        }
      }

      const {data} = await axios.post("/api/v1/product/add", formData)
      if(data.success){
        toast.success(data.message);
        setName('');
        setDescription('');
        setCategory('');
        setPrice('');
        setOfferPrice('');
        setFiles([]);
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImageChange = (e, index) => {
    const updatedFiles = [...files];
    const updatedUploading = [...isUploadingImages];
    
    if (e.target.files[0]) {
      updatedUploading[index] = true;
      setIsUploadingImages(updatedUploading);
      
      // Simulate upload delay
      setTimeout(() => {
        updatedFiles[index] = e.target.files[0];
        setFiles(updatedFiles);
        updatedUploading[index] = false;
        setIsUploadingImages(updatedUploading);
      }, 800);
    }
  }

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <form onSubmit={onSubmitHandler} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4).fill('').map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input 
                  onChange={(e) => handleImageChange(e, index)}
                  accept="image/*" 
                  type="file" 
                  id={`image${index}`} 
                  hidden 
                  disabled={isSubmitting}
                />

                <div className="relative">
                  {isUploadingImages[index] ? (
                    <div className="w-24 h-24 flex items-center justify-center border border-gray-300 rounded bg-gray-100">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <img 
                      className="max-w-24 cursor-pointer" 
                      src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area} 
                      alt="uploadArea" 
                      width={100} 
                      height={100} 
                    />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
          <input 
            onChange={(e)=> setName(e.target.value)} 
            value={name}
            id="product-name" 
            type="text" 
            placeholder="Type here" 
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" 
            required 
            disabled={isSubmitting}
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
          <textarea 
            onChange={(e)=> setDescription(e.target.value)} 
            value={description}
            id="product-description" 
            rows={4} 
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" 
            placeholder="Type here"
            disabled={isSubmitting}
          ></textarea>
        </div>
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="category">Category</label>
          <select 
            onChange={(e)=> setCategory(e.target.value)} 
            value={category}
            id="category" 
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            disabled={isSubmitting}
          >
            <option value="">Select Category</option>
            {categories.map((item, index) => (
              <option key={index} value={item.path}>{item.path}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
            <input 
              onChange={(e)=> setPrice(e.target.value)} 
              value={price}
              id="product-price" 
              type="number" 
              placeholder="0" 
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" 
              required 
              disabled={isSubmitting}
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
            <input 
              onChange={(e)=> setOfferPrice(e.target.value)} 
              value={offerPrice}
              id="offer-price" 
              type="number" 
              placeholder="0" 
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" 
              required 
              disabled={isSubmitting}
            />
          </div>
        </div>
        <button 
          type="submit"
          className={`px-8 py-2.5 bg-primary text-white font-medium rounded cursor-pointer flex items-center justify-center ${
            isSubmitting ? 'opacity-75' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </>
          ) : (
            'ADD'
          )}
        </button>
      </form>
    </div>
  )
}

export default AddProduct