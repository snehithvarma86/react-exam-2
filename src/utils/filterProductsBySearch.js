export const filterProducts = (productsList, search, category) => {
  return productsList.filter((it) => {
    const matchSearch = !search || it.title.toLowerCase().includes(search);

    const matchCategory =
      !category || category === "all" || it.category === category;

    return matchSearch && matchCategory;
  });
};
