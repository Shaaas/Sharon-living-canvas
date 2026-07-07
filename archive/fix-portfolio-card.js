const fs = require('fs');

let html = fs.readFileSync('hub.html', 'utf8');

// Replace the portfolio card image with a styled div
const oldImg = '<img src="https://shaaas.github.io/Sharon-living-canvas/me.png" alt="Portfolio">';
const newImg = '<div style="width:100%;height:100%;background:linear-gradient(135deg,#d4af37,#38bdf8);display:flex;align-items:center;justify-content:center;font-size:3rem;">💻</div>';

html = html.replace(oldImg, newImg);

fs.writeFileSync('hub.html', html);
console.log('✓ Portfolio card image fixed');
