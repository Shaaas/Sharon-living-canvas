// ===== Enter Button Hover =====
let enterBtn = document.getElementById("enterBtn");

if (enterBtn) {
  enterBtn.addEventListener("mouseenter", () => {
    enterBtn.textContent = "Let’s go →";
  });

  enterBtn.addEventListener("mouseleave", () => {
    enterBtn.textContent = "Enter my worlds";
  });
}
