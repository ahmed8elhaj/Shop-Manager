function appendReservationDetail(container, label, value) {
  const line = document.createElement("p");
  line.className = "mt-1 text-sm text-slate-600";
  line.textContent = `${label}: ${value}`;
  container.appendChild(line);
}

export function createReservationCarte(reservation, product) {
  const customer = reservation.customer || {};
  const quantity = reservation.quantity;
  const price = Number(reservation.unitPrice);
  const subtotal = Number(reservation.total);
  const status = reservation.status.toLowerCase();

  const card = document.createElement("article");
  card.className = "rounded-2xl border border-slate-200 bg-white p-5";
  card.dataset.reservationId = reservation.id;
  card.dataset.email = customer.email || "";
  card.dataset.status = status;

  const header = document.createElement("div");
  header.className = "flex flex-wrap items-center justify-between gap-2";

  const reference = document.createElement("p");
  reference.className = "text-sm font-semibold text-slate-500";
  reference.textContent = `Reservation #${reservation.id}`;

  const statusBadge = document.createElement("span");
  statusBadge.className =
    "rounded-full px-3 py-1 text-sm font-semibold capitalize";
  statusBadge.textContent = status;

  if (status === "pending") {
    statusBadge.classList.add("bg-amber-50", "text-amber-700");
  } else if (status === "confirmed") {
    statusBadge.classList.add("bg-green-50", "text-green-700");
  } else {
    statusBadge.classList.add("bg-slate-100", "text-slate-600");
  }

  header.append(reference, statusBadge);

  const details = document.createElement("div");

  const title = document.createElement("h2");
  title.className = "text-xl font-bold";
  title.textContent = reservation.productName;

  const priceAndQuantity = document.createElement("p");
  priceAndQuantity.className = "text-sm text-slate-600";
  priceAndQuantity.textContent =
    `$${price.toFixed(2)} each · Quantity: ${quantity}`;

  const subtotalText = document.createElement("p");
  subtotalText.className = "mt-1 font-bold";
  subtotalText.textContent = `Total: $${subtotal.toFixed(2)}`;

  details.append(title, priceAndQuantity, subtotalText);

  let date = "—";

  if (reservation.createdAt) {
    date = new Date(reservation.createdAt).toLocaleDateString();
  }

  appendReservationDetail(details, "Date", date);
  appendReservationDetail(details, "Address", customer.address || "—");
  appendReservationDetail(details, "City", customer.city || "—");
  appendReservationDetail(details, "Phone", customer.phone || "—");

  if (customer.postalCode) {
    appendReservationDetail(details, "Postal code", customer.postalCode);
  }

  if (reservation.notes) {
    appendReservationDetail(details, "Note", reservation.notes);
  }

  const content = document.createElement("div");
  content.className = "mt-4 flex items-center gap-4";

  if (product && product.image) {
    const image = document.createElement("img");
    image.src = `http://localhost:3000${product.image}`;
    image.alt = reservation.productName;
    image.className =
      "h-24 w-24 shrink-0 rounded-xl bg-slate-50 object-contain";
    content.appendChild(image);
  }

  content.appendChild(details);
  card.append(header, content);

  if (status === "pending") {
    const actions = document.createElement("div");
    actions.className =
      "mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-4 sm:justify-end";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className =
      "rounded-xl border border-slate-300 px-4 py-2 font-semibold";
    cancelButton.textContent = "Cancel";
    cancelButton.dataset.action = "cancel";

    const confirmButton = document.createElement("button");
    confirmButton.type = "button";
    confirmButton.className =
      "rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white";
    confirmButton.textContent = "Confirm";
    confirmButton.dataset.action = "confirm";

    actions.append(cancelButton, confirmButton);
    card.appendChild(actions);
  }

  return card;
}

