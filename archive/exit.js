let exit = document.querySelector(".exit");

if (exit) {
  exit.addEventListener("click", () => {
    document.body.style.transition = "opacity 1s ease";
    document.body.style.opacity = 0;

    setTimeout(() => {
      // Decide where to go based on current page
      const page = window.location.pathname.split("/").pop();

      if (page === "writing.html") {
        window.location.href = "hub.html";   // writing world → back to hub
      } else {
        window.location.href = "index.html"; // hub or others → landing page
      }
    }, 1000);
  });
}
