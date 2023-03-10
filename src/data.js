let cache = new Map(); 

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


async function getProducts() {
  await new Promise(resolve => {
    setTimeout(resolve, 2000);
  });

  return products; 
}

async function getData(url) {
  if (url === 'products') return await getProducts(); 
  else throw Error('No data'); 
}

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
} 
