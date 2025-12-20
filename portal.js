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
