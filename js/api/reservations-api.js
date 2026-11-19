
export async function getReservations() {
  const response = await fetch("http://localhost:3000/api/reservations");

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
