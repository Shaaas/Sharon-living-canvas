// Select the exit element
let exit = document.querySelector(".exit");

if (exit) {
  exit.addEventListener("click", () => {
    // Fade out the body
    document.body.style.transition = "opacity 1s ease";
    document.body.style.opacity = 0;

    // After fade, go back to previous page
    setTimeout(() => {
      window.history.back();
    }, 1000); // matches the 1s fade
  });
}
