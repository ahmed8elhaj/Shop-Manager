export function showLoader(title = "Loading products…") {
  let interval;
  const startedAt = Date.now();
  Swal.fire({
    title,
    html: 'Elapsed time: <strong id="loading-seconds">0</strong>s',
    allowOutsideClick: false,
    allowEscapeKey: false,

    didOpen: function (popup) {
      Swal.showLoading();

      const counter = popup.querySelector("#loading-seconds");

      interval = setInterval(function () {
        const seconds = Math.floor((Date.now() - startedAt) / 1000);
        counter.textContent = seconds;
      }, 1000);
    },

    willClose: function () {
      clearInterval(interval);
    },
  });
}

export function hideLoader() {
  Swal.close();
}

export function showError(error, title = "Unable to load products") {
  hideLoader();
  Swal.fire({
    icon: "error",
    title,
    text: error,
  });
}


