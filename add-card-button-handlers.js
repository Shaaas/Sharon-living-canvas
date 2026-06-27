const fs = require('fs');

let html = fs.readFileSync('writing.html', 'utf8');

// Find the CARD CLICKS section and add handlers there
const cardClicksSection = `/* ══════════════════════════════════════
     CARD CLICKS
  ══════════════════════════════════════ */
  document.querySelectorAll('.card[data-file]').forEach(card => {
    const handleOpen = (e) => {
      const clickedButton = e.target.closest('.btn-share, .btn-ext, .btn-bookmark');
      if (clickedButton) return;
      openReader(card);
    };
    card.addEventListener('click', handleOpen);
    card.addEventListener('touchend', handleOpen);
  });`;

const enhancedCardClicksSection = `/* ══════════════════════════════════════
     CARD CLICKS
  ══════════════════════════════════════ */
  document.querySelectorAll('.card[data-file]').forEach(card => {
    const handleOpen = (e) => {
      const clickedButton = e.target.closest('.btn-share, .btn-ext, .btn-bookmark');
      if (clickedButton) return;
      openReader(card);
    };
    card.addEventListener('click', handleOpen);
    card.addEventListener('touchend', handleOpen);
    
    // Card button handlers
    card.querySelector('.btn-read')?.addEventListener('click', (e) => {
      e.stopPropagation();
      openReader(card);
    });
    
    card.querySelector('.btn-share')?.addEventListener('click', (e) => {
      e.stopPropagation();
      shareDoc(card.dataset.title);
    });
    
    card.querySelector('.btn-bookmark')?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleBookmark(e.target.closest('.btn-bookmark'));
    });
  });`;

html = html.replace(cardClicksSection, enhancedCardClicksSection);

fs.writeFileSync('writing.html', html);
console.log('✓ Card button event listeners added');
