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
}
// Folder-based content reveal
const folders = document.querySelectorAll('.folder');
const acts = document.querySelectorAll('.act');

folders.forEach(folder => {
  folder.addEventListener('click', () => {
    const target = folder.dataset.target;

    acts.forEach(act => {
      if (act.classList.contains(target)) {
        act.style.display = 'flex';
        requestAnimationFrame(() => {
          act.style.opacity = '1';
        });
      } else {
        act.style.opacity = '0';
        setTimeout(() => {
          act.style.display = 'none';
        }, 400);
      }
    });
  });
});
                       
                       
                       );
