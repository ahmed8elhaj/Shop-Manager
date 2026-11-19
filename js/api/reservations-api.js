const emailInput = document.getElementById("reservation-email");

export async function getReservations() {
  const email = emailInput.value.trim().toLowerCase();

  const response = await fetch(
    `http://localhost:3000/api/reservations?email=${email}`,
  );

  if (!response.ok) {
    throw new Error("HTTP error " + response.status);
  }

  return await response.json();
}

export async function sendReservation(form, product) {
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

async function updateReservationStatus(reservationId, status) {
  const response = await fetch(
    `http://localhost:3000/api/reservations/${reservationId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    }
  );

  if (!response.ok) {
    const problem = await response.json().catch(() => null);

    if (problem && problem.message) {
      throw new Error(problem.message);
    }

    throw new Error(`Unable to update the reservation (${response.status}).`);
  }

  return await response.json();
}

export async function confirmReservation(reservationId) {
  return await updateReservationStatus(reservationId, "confirmed");
}

export async function cancelReservation(reservationId) {
  return await updateReservationStatus(reservationId, "cancelled");
}