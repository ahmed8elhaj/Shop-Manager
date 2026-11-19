import {
  getReservations,
  confirmReservation,
  cancelReservation,
} from "../api/reservations-api.js";
import { getProducts } from "../api/products-api.js";
import { createReservationCarte } from "../ui/reservation-card.js";
import { showLoader, hideLoader, showError } from "../ui/alerts.js";

const list = document.getElementById("reservations-list");
const statusSelect = document.getElementById("reservation-status");
const reservationCount = document.getElementById("reservation-count");
const noReservations = document.getElementById("no-reservations");
const emailInput = document.getElementById("reservation-email");

function filterReservations() {
  const status = statusSelect.value;
  const cards = list.querySelectorAll("[data-reservation-id]");
  let visibleCount = 0;

  cards.forEach((card) => {
    const matchesStatus = status === "" || card.dataset.status === status;

    if (matchesStatus) {
      card.classList.remove("hidden");
      visibleCount++;
    } else {
      card.classList.add("hidden");
    }
  });

  reservationCount.textContent = `Reservations found: ${visibleCount}`;
  noReservations.classList.toggle("hidden", visibleCount !== 0);
}

async function showReservation() {
  let reservations;
  const email = emailInput.value.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!emailRegex.test(email)) {
    Swal.fire({
      icon: "warning",
      title: "Invalid email",
      text: "Please enter a valid email address.",
    });
    return;
  }

  showLoader("Loading reservations…");

  try {
    reservations = await getReservations();

    if (!Array.isArray(reservations)) {
      throw new Error("The API did not return a reservation list.");
    }
  } catch (error) {
    console.error(error.message);
    reservationCount.textContent = "Unable to load reservations";
    showError("Please try again.", "Unable to load reservations");
    return;
  }

  let products = [];

  try {
    if (reservations.length > 0) {
      const result = await getProducts();

      if (Array.isArray(result)) {
        products = result;
      }
    }
  } catch (error) {
    console.error("Unable to load product images:", error.message);
  }

  hideLoader();
  list.replaceChildren();

  reservations.forEach((reservation) => {
    const product = products.find((item) => {
      return item.id === reservation.productId;
    });

    const card = createReservationCarte(reservation, product);
    list.appendChild(card);
  });

  filterReservations();
}

emailInput.addEventListener("change", showReservation);
statusSelect.addEventListener("change", filterReservations);

list.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  const card = button.closest("[data-reservation-id]");

  if (!card) {
    return;
  }

  const reservationId = card.dataset.reservationId;
  const action = button.dataset.action;

  const buttons = card.querySelectorAll("button[data-action]");
  buttons.forEach((item) => {
    item.disabled = true;
  });

  try {
    if (action === "confirm") {
      await confirmReservation(reservationId);
    } else if (action === "cancel") {
      await cancelReservation(reservationId);
    }

    await showReservation();
  } catch (error) {
    showError(error.message, "Unable to update reservation");
  } finally {
    buttons.forEach((item) => {
      item.disabled = false;
    });
  }
});
