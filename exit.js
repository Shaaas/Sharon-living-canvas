let exit = document.querySelector(".exit");

if (exit) {
  exit.addEventListener("click", () => {
    // Fade out the page
    document.body.style.transition = "opacity 1s ease";
    document.body.style.opacity = 0;

    setTimeout(() => {
      // Use the data attribute to go to the correct page
      const target = document.body.getAttribute("data-exit-target") || "index.html";
      window.location.href = target;
    }, 1000);
  });
}
