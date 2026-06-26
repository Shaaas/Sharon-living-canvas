const fs = require('fs');

// Read the original file
const original = fs.readFileSync('writing.html', 'utf8');

// Split at key points
const beforeArticles = original.substring(0, original.indexOf('<!-- ARTICLES -->'));
const afterBooks = original.substring(original.indexOf('<!-- READER -->'));

// Read generated cards
const generated = fs.readFileSync('cards-generated.html', 'utf8').trim();

// Combine
const newContent = beforeArticles + generated + '\n\n' + afterBooks;

// Write to file
fs.writeFileSync('writing.html', newContent);
console.log('✓ writing.html updated with new cards');
