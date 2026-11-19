import { getReservations } from "../api/reservations-api.js";
import { getProducts } from "../api/products-api.js";
import { createReservationCarte } from "../ui/reservation-card.js";
import { showLoader, hideLoader, showError } from "../ui/alerts.js";

const list = document.getElementById("reservations-list");
const emailInput = document.getElementById("reservation-email");
const statusSelect = document.getElementById("reservation-status");
const reservationCount = document.getElementById("reservation-count");
const noReservations = document.getElementById("no-reservations");

function filterReservations() {
  const email = emailInput.value.trim().toLowerCase();
  const status = statusSelect.value;
  const cards = list.querySelectorAll("[data-reservation-id]");
  let visibleCount = 0;

  cards.forEach((card) => {
    const matchesEmail = email === "" || card.dataset.email.toLowerCase() === email;
    const matchesStatus = status === "" || card.dataset.status === status;

    if (matchesEmail && matchesStatus) {
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

emailInput.addEventListener("input", filterReservations);
statusSelect.addEventListener("change", filterReservations);

showReservation();
