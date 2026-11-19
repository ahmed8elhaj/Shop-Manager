import { BASKET_KEY, readFromLS, saveToLS } from "./storage.js";

export let basket = readFromLS(BASKET_KEY);

export function addToBasket(element) {
  const existingProduct = basket.find((product) => {
    return product.id === element.id;
  });

  if (existingProduct) {
    existingProduct.reserve = (existingProduct.reserve || 1) + 1;
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
}
