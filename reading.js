let lastScroll = 0;
let slowScrollTime = 0;
const hiddenLine = document.querySelector(".hidden-line");

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  const delta = Math.abs(currentScroll - lastScroll);

  if (delta < 6) {
    slowScrollTime += 1;
  } else {
    slowScrollTime = 0;
  }

  if (slowScrollTime > 25 && hiddenLine) {
    hiddenLine.style.opacity = 1;
  }

  lastScroll = currentScroll;
});
