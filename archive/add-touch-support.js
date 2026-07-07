const fs = require('fs');

let html = fs.readFileSync('writing.html', 'utf8');

// Find where click handlers are added and add touch support
const oldCode = `document.querySelectorAll('.card[data-file]').forEach(card => {
    card.addEventListener('click', e => {
      // Check if clicked element or any parent is a button
      const clickedButton = e.target.closest('.btn-share, .btn-ext, .btn-bookmark');
      if (clickedButton) return;
      openReader(card);
    });`;

const newCode = `document.querySelectorAll('.card[data-file]').forEach(card => {
    const handleOpen = (e) => {
      const clickedButton = e.target.closest('.btn-share, .btn-ext, .btn-bookmark');
      if (clickedButton) return;
      openReader(card);
    };
    card.addEventListener('click', handleOpen);
    card.addEventListener('touchend', handleOpen);
  });`;

html = html.replace(oldCode, newCode);

fs.writeFileSync('writing.html', html);
console.log('✓ Touch event support added');
