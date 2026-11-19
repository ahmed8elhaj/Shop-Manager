# ShopEase | Shop-Manager

ShopEase is a front-end product catalog and reservation app. Browse products,
add items to your basket, reserve a product, and manage your reservations from
a separate page.

## Features

- **Catalog** — Browse products with pictures, prices, categories, and stock
  information. Search by name or description and filter by category, price
  range, and stock availability.
- **Basket** — Items and quantities are saved in the browser using
  `localStorage`. Adding the same product increases its quantity instead of
  creating a duplicate. The basket prevents adding more than the displayed
  stock and refreshes after an item is removed.
- **Checkout** — Submit a reservation for one basket item at a time with its
  quantity and customer details. A successful submission creates a pending
  reservation and removes only that item from the basket.
- **My Reservations** — Open the page from the catalog and search using your
  full email address. The search ignores letter case and sends no request until
  a valid email is submitted. Results are sorted from newest to oldest and can
  be filtered by status.
- **Reservation details and actions** — See the product, quantity, unit price,
  total, status, date, address, city, and phone. Postal code and notes are shown
  when present. Pending reservations can be confirmed or cancelled. The API
  handles the stock changes when a reservation is cancelled.
- **Feedback** — The interface shows loading, empty, and error states, including
  a message when no reservations match the email or the server is unreachable.

## Run locally

1. Start the project's REST API on port `3000`. Check that
   `http://localhost:3000/api/products` returns a product list.
2. Open the project folder in VS Code and serve `index.html` with **Live Server**.
   Use the server URL rather than opening the file directly, since the pages use
   JavaScript modules.
3. Open **My Reservations** from the catalog, or visit `confirm.html` on the same
   front-end server.

The front end uses HTML, Tailwind CSS, vanilla JavaScript modules, the Fetch API,
and SweetAlert2. Tailwind and SweetAlert2 are loaded from CDNs, so they need
internet access in this setup.

## Project structure

| Path | Responsibility |
| --- | --- |
| `index.html` | Product catalog, basket panel, and checkout form |
| `confirm.html` | Email search, status filter, and reservation cards |
| `js/pages/catalog-page.js` | Catalog loading, filtering, and rendering |
| `js/pages/reservations-page.js` | Reservation search, sorting, filtering, and button events |
| `js/api/` | Product and reservation requests |
| `js/ui/` | Cards, basket panel, and alerts |
| `js/basket.js` and `js/storage.js` | Basket updates and browser storage |

Each page loads its own entry module. Keep the CDN scripts in the HTML and
avoid loading the old local scripts alongside the entry modules.

```html
<!-- index.html -->
<script type="module" src="./js/pages/catalog-page.js"></script>

<!-- confirm.html -->
<script type="module" src="./js/pages/reservations-page.js"></script>
```

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/products` | Load and filter products |
| POST | `/api/reservations` | Create a pending reservation |
| GET | `/api/reservations?email=...` | Look up reservations by full email address |
| PATCH | `/api/reservations/:id` | Update a reservation's status to `confirmed` or `cancelled` |

The front end builds query strings with `URLSearchParams` so email addresses
and search terms are encoded correctly. Confirm and Cancel send the reservation
ID and the new status, not a product ID or a manual stock update.

## Quick test

1. Add the same in-stock product twice. Check that there is one basket item with
   quantity two. Remove it and check that the basket updates without reloading.
2. Submit a reservation for one item. Check that only that item is removed from
   the basket and that the reservation appears as **Pending**.
3. Open **My Reservations**. Check that no API request runs before submitting
   an email. Search for the checkout email, then repeat with different letter
   casing and verify that the same reservations appear.
4. Confirm or cancel a pending reservation and check that the displayed status
   updates. Try an email with no matches, then stop the API and repeat a search
   to check the connection error message.
