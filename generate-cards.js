const fs = require('fs');

const data = JSON.parse(fs.readFileSync('pieces.json', 'utf8'));

function sortByDate(arr) {
  return [...arr].sort((a, b) => {
    const da = a.date ? new Date(a.date) : new Date('1900-01-01');
    const db = b.date ? new Date(b.date) : new Date('1900-01-01');
    return db - da;
  });
}

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

  return `    <div class="card" ${file} data-type="${type}" data-time="${escapeHtml(piece.time)}" data-title="${escapeHtml(piece.title)}" ${tagsAttr}><div class="card-meta"><span class="card-badge">${type}</span></div><h3>${escapeHtml(piece.title)}</h3><p>${escapeHtml(piece.description)}</p><div class="card-tags">${tagsList}</div><div class="card-foot">${button}<button class="btn-share" onclick="event.stopPropagation();shareDoc(this.closest('.card').dataset.title)">Share</button><button class="btn-bookmark" onclick="event.stopPropagation();toggleBookmark(this)"><svg width="14" height="14" viewBox="0 0 24 24" style="vertical-align:middle"><path d="M5 2h14a1 1 0 0 1 1 1v19l-8-5-8 5V3a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button></div></div>`;
}

console.log('<!-- ARTICLES -->');
console.log('<div class="collection active" id="col-articles">');
console.log('  <div class="grid">');
sortByDate(data.articles).forEach(p => console.log(generateCard(p, 'article')));
console.log('  </div>');
console.log('</div>');
console.log('');

console.log('<!-- POEMS -->');
console.log('<div class="collection" id="col-poems">');
console.log('  <div class="grid">');
sortByDate(data.poems).forEach(p => console.log(generateCard(p, 'poem')));
console.log('  </div>');
console.log('</div>');
console.log('');

console.log('<!-- BOOKS -->');
console.log('<div class="collection" id="col-books">');
console.log('  <div class="grid">');
sortByDate(data.books).forEach(p => console.log(generateCard(p, 'article')));
console.log('  </div>');
console.log('</div>');
