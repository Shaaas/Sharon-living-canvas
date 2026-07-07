const fs = require('fs');

let html = fs.readFileSync('writing.html', 'utf8');

const buttonCSS = `
    /* Enhanced Like Button */
    .like-btn {
      display: flex !important; align-items: center !important; justify-content: center !important;
      gap: 10px !important;
      background: linear-gradient(135deg, rgba(224,92,122,0.08), transparent) !important;
      border: 2px solid #e05c7a !important;
      padding: 12px 20px !important;
      border-radius: 4px !important;
      font-weight: 600 !important;
      min-width: 150px !important;
      transition: all 0.3s ease !important;
    }
    .like-btn:hover { background: rgba(224,92,122,0.15) !important; box-shadow: 0 0 15px rgba(224,92,122,0.3) !important; }
    .like-btn.liked { background: rgba(224,92,122,0.2) !important; border-color: #e05c7a !important; }
    .like-btn .like-heart { font-size: 1.4rem !important; }

    /* Enhanced Bookmark Button */
    .btn-bookmark-r {
      background: transparent !important;
      border: 2px solid #d4af37 !important;
      color: #d4af37 !important;
      padding: 10px 18px !important;
      border-radius: 4px !important;
      font-weight: 600 !important;
      min-width: 140px !important;
      transition: all 0.3s ease !important;
    }
    .btn-bookmark-r:hover { background: rgba(212,175,55,0.1) !important; box-shadow: 0 0 15px rgba(212,175,55,0.2) !important; }
    .btn-bookmark-r.saved { background: rgba(212,175,55,0.15) !important; border-color: #d4af37 !important; color: #d4af37 !important; }

    /* Enhanced Share Button */
    .btn-share-r {
      background: transparent !important;
      border: 2px solid #38bdf8 !important;
      color: #38bdf8 !important;
      padding: 10px 18px !important;
      border-radius: 4px !important;
      font-weight: 600 !important;
      transition: all 0.3s ease !important;
    }
    .btn-share-r:hover { background: rgba(56,189,248,0.1) !important; box-shadow: 0 0 15px rgba(56,189,248,0.2) !important; }

    /* Enhanced Close Button */
    .btn-close-r {
      background: transparent !important;
      border: 2px solid #6a6760 !important;
      color: var(--text) !important;
      padding: 10px 18px !important;
      border-radius: 4px !important;
      font-weight: 600 !important;
      transition: all 0.3s ease !important;
    }
    .btn-close-r:hover { border-color: var(--text) !important; background: rgba(255,255,255,0.05) !important; }
`;

html = html.replace('</style>', buttonCSS + '\n  </style>');

fs.writeFileSync('writing.html', html);
console.log('✓ Button CSS added');
