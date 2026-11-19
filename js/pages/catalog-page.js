import { getProducts, searchAndFilterProduct } from "../api/products-api.js";
import { createProductCart } from "../ui/product-card.js";
import { showLoader, hideLoader, showError } from "../ui/alerts.js";
import { addToBasket } from "../basket.js";
import { renderBasket } from "../ui/basket-panel.js";

const listOfProducts = document.getElementById("products-contonair");
const productsCounter = document.getElementById("products-count");

const searchInput = document.getElementById("search-input");
const categoryInput = document.getElementById("category-select");
const maxPriceInput = document.getElementById("maxPrice-input");
const minPriceInput = document.getElementById("minPrice-input");
const stockInput = document.getElementById("stock-select");

searchInput.addEventListener("input", applySearchAndFilters);
categoryInput.addEventListener("change", applySearchAndFilters);
maxPriceInput.addEventListener("input", applySearchAndFilters);
minPriceInput.addEventListener("input", applySearchAndFilters);
stockInput.addEventListener("change", applySearchAndFilters);

async function applySearchAndFilters() {
  try {
    const products = await searchAndFilterProduct(
      searchInput.value.trim(),
      categoryInput.value,
      maxPriceInput.value.trim(),
      minPriceInput.value.trim(),
      stockInput.value,
    );
    renderProducts(products);
  } catch (error) {
    console.error(error.message);
  }
}

async function showProducts() {
  showLoader();

  try {
    const products = await getProducts();

    if (!Array.isArray(products)) {
      throw new Error("The API did not return a product list.");
    }

    hideLoader();
    showCategories(products);
    renderProducts(products);
  } catch (error) {
    console.error(error.message);
    productsCounter.textContent = "Unable to load products";
    showError("Please try again.");
  }
}

function renderProducts(products) {
  productsCounter.textContent = `Showing ${products.length} products`;
  listOfProducts.replaceChildren();

  products.forEach((product) => {
    const card = createProductCart(product, (selectedProduct) => {
      addToBasket(selectedProduct);
      renderBasket();
    });

    listOfProducts.appendChild(card);
  });
  if (products.length == 0) {
    showError("Not found please try again.");
  }
}

function showCategories(products) {
  categoryInput.replaceChildren();

  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "All Categories";
  categoryInput.appendChild(allOption);

  const categories = [];
  products.forEach((element) => {
    const exists = categories.some((category) => {
      return category.id === element.categoryId;
    });
    if (exists === false) {
      categories.push({
        id: element.categoryId,
        name: element.categoryName,
      });
      const categoryOption = document.createElement("option");
      categoryOption.value = element.categoryId;
      categoryOption.textContent = element.categoryName;

      categoryInput.appendChild(categoryOption);
    }
  });
}

renderBasket();
showProducts();
