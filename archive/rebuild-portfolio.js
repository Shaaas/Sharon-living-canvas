const fs = require('fs');

const original = fs.readFileSync('portfolio.html', 'utf8');
const generated = fs.readFileSync('portfolio-cards-generated.html', 'utf8').trim();

const beforeGrid = original.substring(0, original.indexOf('<div class="portfolio-grid">') + '<div class="portfolio-grid">'.length);
const afterGrid = original.substring(original.indexOf('</div>\n\n    <footer'));

const newContent = beforeGrid + '\n' + generated + '\n\n    ' + afterGrid;

fs.writeFileSync('portfolio.html', newContent);
console.log('✓ portfolio.html updated with new cards');
