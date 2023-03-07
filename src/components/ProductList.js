function ProductList({ products }) {
  return (
    <ul>
      {products.map((product, i) => (
        <li key = {i + 1}>{product}</li>
      ))}
    </ul>
  );
}

export default ProductList;
