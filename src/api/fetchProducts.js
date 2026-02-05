export const fetchProducts = async () => {
  try {
    const result = await fetch("https://fakestoreapi.com/products").then(
      (res) => res.json(),
    );
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
