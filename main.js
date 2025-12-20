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


  if (slowScrollTime > 25 && hiddenLine) {
    hiddenLine.style.opacity = 1;
  }

  lastScroll = currentScroll;
});
