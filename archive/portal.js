// ===== Enter Button Click / Portal =====
let enterBtnClick = document.getElementById("enterBtn");

if (enterBtnClick) {
  enterBtnClick.addEventListener("click", () => {
    document.body.classList.add("portal-open");

    setTimeout(() => {
      window.location.href = "hub.html";
    }, 1200);
  });
}
let portals = document.querySelectorAll(".portal");

portals.forEach((p) => {
  p.addEventListener("click", () => {
    document.body.style.transition = "opacity 1s ease";
    document.body.style.opacity = 0;

    setTimeout(() => {
      const target = p.getAttribute("data-target");
      window.location.href = target;
    }, 1000);
  });
});
