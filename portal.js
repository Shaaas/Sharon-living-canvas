const btn = document.getElementById("enterBtn");

btn.addEventListener("click", () => {
  document.body.classList.add("portal-open");

  setTimeout(() => {
    window.location.href = "hub.html";
  }, 1200);
});
