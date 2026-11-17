const yellowPanelMidlleSecton = document.getElementById("yellowPanel-midlle-secton");
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
    createProductBasketCart(product)

  });
}

renderBasket();




