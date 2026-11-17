const yellowPanelMidlleSecton = document.getElementById(
  "yellowPanel-midlle-secton",
);
const formYellowPanel = document.getElementById("form-yellowPanel");
let basket = readFromLS(BASKET_KEY);

console.log(basket);

function renderBasket() {
  yellowPanelMidlleSecton.replaceChildren();

  if (basket.length === 0) {
    yellowPanelMidlleSecton.className = "flex h-64 items-center justify-center";
    formYellowPanel.classList.add("hidden");

    const message = document.createElement("h2");
    message.className = "text-4xl";
    message.textContent = "Your basket is empty";
    yellowPanelMidlleSecton.appendChild(message);
    return;
  }

  yellowPanelMidlleSecton.className = "flex flex-col gap-4";
  formYellowPanel.classList.remove("hidden");

  basket.forEach((product) => {
    createProductBasketCart(product);
  });
}

renderBasket();

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

async function sendReservation(form, product) {
  const formData = new FormData(form);

  const reservation = {
    productId: product.id,
    quantity: product.reserve || 1,
    customer: {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      postalCode: formData.get("postalCode"),
    },
    notes: formData.get("notes") || "",
  };

  const response = await fetch("http://localhost:3000/api/reservations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reservation),
  });

  return response;
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

    basket = basket.filter((item) => {
      return item.id !== product.id;
    });

    saveToLS(BASKET_KEY, basket);
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
