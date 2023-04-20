import { Suspense, useState, useTransition } from 'react';
import Loading from './Loading'
import { fetchData } from '../data';


function ProductList() {
  const [isPending, startTransition] = useTransition();
  const [filterTerm, setFilterTerm] = useState('');

 
  function updateFilterHandler(event) {
    startTransition(() => {
      setFilterTerm(event.target.value);
    });
    setFilterTerm(event.target.value);
  }

  //for suspense and delay
  //const products = use(fetchData('products')); 

  function generateProducts() {
    const products = [];
    for (let i = 0; i < 30; i++) {
      products.push({
        name: `Product ${i+1}`,
        id: i+1
      });
    }
  
    return products;
  }
  
  const products = generateProducts(); 

  function filterProducts(filterTerm) {
   
    if (!filterTerm) {
      return  products;
    }
    return products.filter((product) => product.name.includes(filterTerm));
  }

  const filteredProducts = filterProducts(filterTerm)
  
  return (

    <>
        <div>
        <input type='text' placeholder= "useTransition demo..." onChange={updateFilterHandler} />
          <ul>
            {filteredProducts.map((product) => (
              <li  key = {product.id}>
                {product.name}
              </li>))
              }
        </ul>
      </div>
    </>
  );
}


function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}


export default ProductList;
