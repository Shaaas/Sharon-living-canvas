const fs = require('fs');

let html = fs.readFileSync('writing.html', 'utf8');

// Find the card button section and rebuild it properly
const oldButtons = `<button class="btn-read">Read</button><button class="btn-share" onclick="event.stopPropagation();shareDoc(this.closest('.card').dataset.title)">Share</button><button class="btn-bookmark" onclick="event.stopPropagation();toggleBookmark(this)">🌟 </button>`;

const newButtons = `<button class="btn-read">Read</button><button class="btn-share">Share</button><button class="btn-bookmark">🌟 </button>`;

html = html.replace(new RegExp(oldButtons.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newButtons);

fs.writeFileSync('writing.html', html);
console.log('✓ Card button onclick handlers removed');
