const fs = require('fs');

let html = fs.readFileSync('writing.html', 'utf8');

// Bookmark button with Font Awesome
html = html.replace(
  /<button class="btn-bookmark-r" id="r-bookmark-btn".*?<\/button>/,
  '<button class="btn-bookmark-r" id="r-bookmark-btn" title="Save for later"><i class="fa-solid fa-bookmark"></i> Bookmark</button>'
);

// Share button with Font Awesome
html = html.replace(
  /<button class="btn-share-r" id="r-share-btn">.*?<\/button>/,
  '<button class="btn-share-r" id="r-share-btn"><i class="fa-solid fa-share-nodes"></i> Share</button>'
);

// Like button with Font Awesome heart
html = html.replace(
  /<span class="like-heart">.*?<\/span>/,
  '<span class="like-heart"><i class="fa-solid fa-heart"></i></span>'
);

fs.writeFileSync('writing.html', html);
console.log('✓ Font Awesome icons applied');
