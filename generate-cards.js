const fs = require('fs');

const data = JSON.parse(fs.readFileSync('pieces.json', 'utf8'));

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function generateCard(piece, type) {
  const file = piece.file ? `data-file="${escapeHtml(piece.file)}"` : '';
  const tags = piece.tags ? piece.tags.join(',') : '';
  const tagsAttr = tags ? `data-tags="${tags}"` : '';
  
  const tagsList = piece.tags
    ? piece.tags.map(t => `<span class="card-tag">${escapeHtml(t)}</span>`).join('')
    : '';

  const button = piece.external
    ? `<button class="btn-ext" onclick="window.open('${escapeHtml(piece.externalUrl)}','_blank')">Read on Wattpad ↗</button>`
    : `<button class="btn-read">Read</button>`;

  return `    <div class="card" ${file} data-type="${type}" data-time="${escapeHtml(piece.time)}" data-title="${escapeHtml(piece.title)}" ${tagsAttr}><div class="card-meta"><span class="card-badge">${type}</span></div><h3>${escapeHtml(piece.title)}</h3><p>${escapeHtml(piece.description)}</p><div class="card-tags">${tagsList}</div><div class="card-foot">${button}<button class="btn-share" onclick="event.stopPropagation();shareDoc(this.closest('.card').dataset.title)">Share</button><button class="btn-bookmark" onclick="event.stopPropagation();toggleBookmark(this)">🌟 </button></div></div>`;
}

console.log('<!-- ARTICLES -->');
console.log('<div class="collection active" id="col-articles">');
console.log('  <div class="grid">');
data.articles.forEach(p => console.log(generateCard(p, 'article')));
console.log('  </div>');
console.log('</div>');
console.log('');

console.log('<!-- POEMS -->');
console.log('<div class="collection" id="col-poems">');
console.log('  <div class="grid">');
data.poems.forEach(p => console.log(generateCard(p, 'poem')));
console.log('  </div>');
console.log('</div>');
console.log('');

console.log('<!-- BOOKS -->');
console.log('<div class="collection" id="col-books">');
console.log('  <div class="grid">');
data.books.forEach(p => console.log(generateCard(p, 'article')));
console.log('  </div>');
console.log('</div>');
