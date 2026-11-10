const listOfProducts = document.getElementById("products-contonair");
const productsCounter = document.getElementById("products-count");
const stock = document.getElementById("stock");


const searchInput = document.getElementById("search-input");
const categoryInput = document.getElementById("category-select");
const maxPriceInput = document.getElementById("maxPrice-input");
const minPriceInput = document.getElementById("minPrice-input");
const stockInput = document.getElementById("stock-select");

async function getProducts() {
  let products;
  try {
    const response = await fetch("http://localhost:3000/api/products");
    console.log(response.status);
    if (!response.ok) {
      const problem = await response.json();
      console.log(problem.message);
      return;
    }
    products = await response.json();
    // console.log(products);
  } catch (error) {
    console.log(error.message);
  }
  return products;
}
getProducts();

async function showProducts() {
  const products = await getProducts();
  productsCounter.textContent = `Showing ${products.length} products`;
  listOfProducts.innerHTML = "";
  products.forEach((product) => {
    createProductCart(product);
  });
}

function createProductCart(element) {
  // Create product card
  const productCarte = document.createElement("article");
  productCarte.className =
    "flex w-full flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:w-[calc(50%_-_8px)] xl:w-[calc(33.333%_-_11px)]";

  productCarte.dataset.id = "product-" + element.id;

  // Create product image
  const productImg = document.createElement("img");
  productImg.src = `http://localhost:3000${element.image}`;
  productImg.alt = element.name;
  productImg.className = "h-48 w-full object-contain";
  productCarte.appendChild(productImg);

  // Create product category
  const productCategory = document.createElement("p");
  productCategory.className =
    "self-start rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-600";
  productCategory.innerText = element.categoryName;
  productCarte.appendChild(productCategory);

  // Create product title
  const productTitle = document.createElement("h5");
  productTitle.className = "text-lg font-semibold";
  productTitle.innerText = element.name;
  productCarte.appendChild(productTitle);

  // Create product description
  const productDescription = document.createElement("p");
  productDescription.className = "text-gray-600";
  productDescription.innerText = element.description;
  productCarte.appendChild(productDescription);

  // Create product price
  const productPrice = document.createElement("h5");
  productPrice.className = "text-xl font-bold";
  productPrice.innerText = `$${element.price}`;
  productCarte.appendChild(productPrice);

  // Create stock section
  const availableSection = document.createElement("div");
  availableSection.className = "flex items-center justify-between";

  // Create available count
  const availableCount = document.createElement("small");
  availableCount.innerText = `${element.stock} available`;
  availableSection.appendChild(availableCount);

  // Create stock status container
  const isAvailableDiv = document.createElement("div");
  isAvailableDiv.className = "flex items-center gap-2";

  // Create stock circle
  const stockCircle = document.createElement("span");

  // Create stock text
  const stockText = document.createElement("span");

  // Check stock
  if (element.stock > 0) {
    stockCircle.className = "h-2 w-2 rounded-full bg-green-600";
    stockText.className = "text-sm font-medium text-green-700";
    stockText.innerText = "In Stock";
  } else {
    stockCircle.className = "h-2 w-2 rounded-full bg-red-600";
    stockText.className = "text-sm font-medium text-red-700";
    stockText.innerText = "Out of Stock";
  }

  // Append stock elements
  isAvailableDiv.appendChild(stockCircle);
  isAvailableDiv.appendChild(stockText);

  availableSection.appendChild(isAvailableDiv);

  // Append stock section to product card
  productCarte.appendChild(availableSection);

  // Append product card to products container
  listOfProducts.appendChild(productCarte);
}
async function searchAndFilterProduct(
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
  if (minPrice !== "") {
    param.append("minPrice",minPrice)
  }
  if(inStock!== ""){
    param.append("inStock",inStock)
  }
  if(!response.ok){
    throw new Error("Failed to fetch products")
  }
  const products=await response.json();
  return products
}

showProducts();
