const fs = require('fs');

let html = fs.readFileSync('writing.html', 'utf8');

// Update bookmark button text
html = html.replace(
  '<button class="btn-bookmark-r" id="r-bookmark-btn" title="Bookmark">🌟 </button>',
  '<button class="btn-bookmark-r" id="r-bookmark-btn" title="Save for later"><span style="font-size:1.1rem;margin-right:6px;">🔖</span>Save</button>'
);

// Update share button text  
html = html.replace(
  '<button class="btn-share-r" id="r-share-btn">Share</button>',
  '<button class="btn-share-r" id="r-share-btn"><span style="font-size:1.1rem;margin-right:6px;">↗</span>Share</button>'
);

// Update like button to show heart icon
html = html.replace(
  '<span class="like-heart">🌟 </span>',
  '<span class="like-heart">♥</span>'
);

fs.writeFileSync('writing.html', html);
console.log('✓ Button icons updated');
