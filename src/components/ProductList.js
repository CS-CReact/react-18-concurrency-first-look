function ProductList({ products }) {
  return (
    <ul>
      {products.map((product, i) => (
        <li key = {i}>{product}</li>
      ))}
    </ul>
  );
}

export default ProductList;
