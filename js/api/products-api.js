export async function getProducts() {
  const response = await fetch("http://localhost:3000/api/products");

  if (!response.ok) {
    throw new Error("Unable to load products: " + response.status);
  }

  return await response.json();
}

export async function searchAndFilterProduct(
  search = "",
  categoryId = "",
  maxPrice = "",
  minPrice = "",
  inStock = "",
) {
  const param = new URLSearchParams();

  if (search !== "") {
    param.append("search", search);
  }
  if (categoryId !== "") {
    param.append("categoryId", categoryId);
  }
  if (maxPrice !== "") {
    param.append("maxPrice", maxPrice);
  }
  if (inStock !== "") {
    param.append("inStock", inStock);
  }
  const response = await fetch(
    `http://localhost:3000/api/products?${param.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  let products = await response.json();
  if (minPrice !== "") {
    products = products.filter((element) => {
      return element.price >= Number(minPrice);
    });
  }
  return products;
}
