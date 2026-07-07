const fs = require('fs');

let html = fs.readFileSync('writing.html', 'utf8');

// Vibrant Bookmark Icon (Gold/Orange gradient)
const bookmarkSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="margin-right:8px;display:inline-block;vertical-align:middle;">
  <defs><linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#d4af37;stop-opacity:1" /><stop offset="100%" style="stop-color:#f5a623;stop-opacity:1" /></linearGradient></defs>
  <path d="M5 2h14a1 1 0 0 1 1 1v19l-8-5-8 5V3a1 1 0 0 1 1-1z" fill="url(#bookGrad)"/>
</svg>`;

// Vibrant Heart Icon (Red/Pink gradient)
const heartSVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;">
  <defs><linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff6b9d;stop-opacity:1" /><stop offset="100%" style="stop-color:#e05c7a;stop-opacity:1" /></linearGradient></defs>
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="url(#heartGrad)"/>
</svg>`;

// Vibrant Share Icon (Blue/Cyan gradient)
const shareSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="margin-right:8px;display:inline-block;vertical-align:middle;">
  <defs><linearGradient id="shareGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#38bdf8;stop-opacity:1" /><stop offset="100%" style="stop-color:#0ea5e9;stop-opacity:1" /></linearGradient></defs>
  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M12 2v10M5.5 9.5L12 2l6.5 7.5" stroke="url(#shareGrad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;

// Replace bookmark button
html = html.replace(
  /<button class="btn-bookmark-r".*?<\/button>/,
  `<button class="btn-bookmark-r" id="r-bookmark-btn" title="Save for later">${bookmarkSVG}Bookmark</button>`
);

// Replace share button
html = html.replace(
  /<button class="btn-share-r".*?Share.*?<\/button>/,
  `<button class="btn-share-r" id="r-share-btn">${shareSVG}Share</button>`
);

// Replace like button heart
html = html.replace(
  /<span class="like-heart">.*?<\/span>/,
  `<span class="like-heart">${heartSVG}</span>`
);

fs.writeFileSync('writing.html', html);
console.log('✓ Vibrant gradient icons applied');
