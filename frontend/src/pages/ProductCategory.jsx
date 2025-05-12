import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import ProductCart from '../components/ProductCart';

const ProductCategory = () => {

    const {products}=useAppContext();
    const {category}=useParams();

    const searchCategory=categories.find((item)=>item.path.toLowerCase()===category);
    const filterdProducts=products.filter((product)=>product.category.toLowerCase()===category);

  return (
    <div className='mt-16'>
    {searchCategory && (
        <div className='flex flex-col items-end w-max'>
            <p className='text-2xl font-medium'>{searchCategory.text.toUpperCase()}</p>
            <div className='w-16 h-0.5 rounded-full'></div>
        </div>
    )}
    {filterdProducts.length>0 ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-auto mt-6'>
            {filterdProducts.map((product)=>(
                <ProductCart key={product.id} product={product}/>
            ))}
        </div>
    ):(
        <div className='flex items-center justify-center h-[60vh]'>
        <p className='text-2xl font-medium  text-indigo-500'>
        No products found in this category.
        </p>
        </div>
    )}
    </div>
  )
}

export default ProductCategory