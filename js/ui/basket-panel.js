import { basket, removeFromBasket } from "../basket.js";
import { sendReservation } from "../api/reservations-api.js";

const openPanelButton = document.getElementById("openPanel");
const closePanelButton = document.getElementById("closePanel");
const panelWrapper = document.getElementById("panelWrapper");
const yellowPanel = document.getElementById("yellowPanel");
const overlay = document.getElementById("overlay");

function openPanel() {
  panelWrapper.inert = false;
  panelWrapper.classList.remove("pointer-events-none", "opacity-0");
  yellowPanel.classList.replace("translate-x-full", "translate-x-0");
  renderBasket();
}

function closePanel() {
  panelWrapper.inert = true;
  panelWrapper.classList.add("pointer-events-none", "opacity-0");
  yellowPanel.classList.replace("translate-x-0", "translate-x-full");
}

openPanelButton.addEventListener("click", openPanel);
closePanelButton.addEventListener("click", closePanel);
overlay.addEventListener("click", closePanel);

const yellowPanelMidlleSecton = document.getElementById(
  "yellowPanel-midlle-secton",
);
const formYellowPanel = document.getElementById("form-yellowPanel");

export function renderBasket() {
  yellowPanelMidlleSecton.replaceChildren();

  if (basket.length === 0) {
    yellowPanelMidlleSecton.className = "flex h-64 items-center justify-center";
    formYellowPanel.classList.add("hidden");
    selectedProduct = null;

    const message = document.createElement("h2");
    message.className = "text-4xl";
    message.textContent = "Your basket is empty";
    yellowPanelMidlleSecton.appendChild(message);
    return;
  }

  yellowPanelMidlleSecton.className = "flex flex-col gap-4";

  if (selectedProduct === null) {
    formYellowPanel.classList.add("hidden");
  }

  basket.forEach((product) => {
    createProductBasketCart(product);
  });
}

const checkoutProductName = document.getElementById("checkout-product-name");
let selectedProduct = null;

function openCheckoutForm(product) {
  selectedProduct = product;

  const quantity = selectedProduct.reserve || 1;
  checkoutProductName.textContent = `${selectedProduct.name} × ${quantity}`;

  formYellowPanel.classList.remove("hidden");
}

function validateCheckoutForm() {
  const requiredInputs = formYellowPanel.querySelectorAll(
    '[name="name"], [name="email"], [name="address"], [name="city"]',
  );

  for (const input of requiredInputs) {
    if (input.value.trim() === "") {
      alert("Please fill in all required fields.");
      input.focus();
      return false;
    }
  }

  return true;
}

function createProductBasketCart(product) {
  const quantity = product.reserve || 1;
  const price = Number(product.price);
  const subtotal = price * quantity;

  const productCarte = document.createElement("article");
  productCarte.className = "flex w-full items-center gap-4 rounded-xl bg-white p-4";

  const productImg = document.createElement("img");
  productImg.src = `http://localhost:3000${product.image}`;
  productImg.alt = product.name;
  productImg.className = "h-auto w-28 shrink-0 object-contain sm:w-36";

  const details = document.createElement("div");
  details.className = "flex flex-1 flex-col gap-1";

  const title = document.createElement("h3");
  title.className = "text-lg font-bold";
  title.textContent = product.name;

  const unitPrice = document.createElement("p");
  unitPrice.textContent = `Unit price: $${price.toFixed(2)}`;

  const quantityText = document.createElement("p");
  quantityText.textContent = `Quantity: ${quantity}`;

  const subtotalText = document.createElement("p");
  subtotalText.className = "font-bold";
  subtotalText.textContent = `Subtotal: $${subtotal.toFixed(2)}`;

  const checkoutButton = document.createElement("button");
  checkoutButton.type = "button";
  checkoutButton.className = "mt-2 rounded-lg bg-black px-3 py-2 text-sm text-white";
  checkoutButton.textContent = "Checkout this item";

  checkoutButton.addEventListener("click", () => {
    openCheckoutForm(product);
  });

  details.append(title, unitPrice, quantityText, subtotalText, checkoutButton);
  productCarte.append(productImg, details);
  yellowPanelMidlleSecton.appendChild(productCarte);
}

formYellowPanel.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (selectedProduct === null || !validateCheckoutForm()) {
    return;
  }

  const product = selectedProduct;
  const submitButton = formYellowPanel.querySelector('[type="submit"]');

  if (submitButton.disabled) {
    return;
  }

  submitButton.disabled = true;

  try {
    const response = await sendReservation(formYellowPanel, product);

    if (!response.ok) {
      throw new Error("Reservation failed: " + response.status);
    }

    removeFromBasket(product.id);
    formYellowPanel.reset();
    formYellowPanel.classList.add("hidden");
    selectedProduct = null;

    renderBasket();

    alert("Your reservation was submitted successfully.");
  } catch (error) {
    console.error(error);
    alert("Unable to complete the reservation. Please try again.");
  } finally {
    submitButton.disabled = false;
  }
});
