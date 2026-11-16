const openPanelButton = document.getElementById("openPanel");
const closePanelButton = document.getElementById("closePanel");
const panelWrapper = document.getElementById("panelWrapper");
const yellowPanel = document.getElementById("yellowPanel");
const overlay = document.getElementById("overlay");

function openPanel() {
  panelWrapper.inert = false;
  panelWrapper.classList.remove("pointer-events-none", "opacity-0");
  yellowPanel.classList.replace("translate-x-full", "translate-x-0");
}

function closePanel() {
  panelWrapper.inert = true;
  panelWrapper.classList.add("pointer-events-none", "opacity-0");
  yellowPanel.classList.replace("translate-x-0", "translate-x-full");
}

openPanelButton.addEventListener("click", openPanel);
closePanelButton.addEventListener("click", closePanel);
overlay.addEventListener("click", closePanel);



