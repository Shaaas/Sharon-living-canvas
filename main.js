// Interactions live here (scroll, hover, portal clicks)
const btn = document.getElementById("enterBtn");

btn.addEventListener("mouseenter", () => {
  btn.textContent = "Let’s go →";
});

btn.addEventListener("mouseleave", () => {
  btn.textContent = "Enter my worlds";
});
