import { BASKET_KEY, readFromLS, saveToLS } from "./storage.js";
import { renderBasket } from "./ui/basket-panel.js";

export let basket = readFromLS(BASKET_KEY);

export function addToBasket(element) {
  const existingProduct = basket.find((product) => {
    return product.id === element.id;
  });

  let quantityInBasket = 0;

  if (existingProduct) {
    quantityInBasket = existingProduct.reserve || 1;
  }

  if (quantityInBasket >= element.stock) {
    Swal.fire({
      icon: "warning",
      title: "Stock limit reached",
      text: "No more units are available to add to your basket."
    });

    return;
  }

  if (existingProduct) {
    existingProduct.reserve = quantityInBasket + 1;
  } else {
    basket.push({ ...element, reserve: 1 });
  }

  saveToLS(BASKET_KEY, basket);
}

export function removeFromBasket(productId) {
  basket = basket.filter((item) => {
    return item.id !== productId;
  });

  saveToLS(BASKET_KEY, basket);
  renderBasket();
}