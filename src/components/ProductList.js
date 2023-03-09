function ProductList({ products }) {
  return (
    <ul>
      {products.map((product) => (
        <li className ="DoNotInspect" key = {product.id}>{product.name}</li>
      ))}
    </ul>
  );
}

export default ProductList;
