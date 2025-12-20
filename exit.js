let exit = document.querySelector(".exit");

if (exit) {
  exit.addEventListener("click", () => {
    // Fade out the page
    document.body.style.transition = "opacity 1s ease";
    document.body.style.opacity = 0;

    // After fade, go to index.html directly
    setTimeout(() => {
      window.location.href = "index.html"; // always goes to landing page
    }, 1000); // matches 1s fade
  });
}
