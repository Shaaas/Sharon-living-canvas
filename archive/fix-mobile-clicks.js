const fs = require('fs');

let html = fs.readFileSync('writing.html', 'utf8');

// Find and replace the card click handler
const oldHandler = `document.querySelectorAll('.card[data-file]').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.classList.contains('btn-share') ||
          e.target.classList.contains('btn-ext') ||
          e.target.classList.contains('btn-bookmark')) return;
      openReader(card);
    });`;

const newHandler = `document.querySelectorAll('.card[data-file]').forEach(card => {
    card.addEventListener('click', e => {
      // Check if clicked element or any parent is a button
      const clickedButton = e.target.closest('.btn-share, .btn-ext, .btn-bookmark');
      if (clickedButton) return;
      openReader(card);
    });`;

html = html.replace(oldHandler, newHandler);

fs.writeFileSync('writing.html', html);
console.log('✓ Mobile click handlers fixed');
