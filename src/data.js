export function generateProducts() {
  const products = [];
  for (let i = 0; i < 50; i++) {
    products.push({
      name: `Product ${i+1}`,
      id: i+1
    });
  }
  return products;
}