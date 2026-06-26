// ═══════════════════════════════════════════════════════════════
// CREATIVE READING FEATURES
// ═══════════════════════════════════════════════════════════════

/* 1. READING LIST / COLLECTION */
class ReadingList {
  constructor() {
    this.list = JSON.parse(localStorage.getItem('sm-reading-list') || '[]');
  }

  add(title, slug) {
    const item = {
      title,
      slug,
      addedAt: new Date().toISOString(),
      readTime: document.getElementById('r-readtime')?.textContent || 'unknown'
    };
    if (!this.list.find(x => x.slug === slug)) {
      this.list.push(item);
      this.save();
      return true;
    }
    return false;
  }

  remove(slug) {
    this.list = this.list.filter(x => x.slug !== slug);
    this.save();
  }

  save() {
    localStorage.setItem('sm-reading-list', JSON.stringify(this.list));
  }

  get() {
    return this.list;
  }

  clear() {
    this.list = [];
    this.save();
  }
}

const readingList = new ReadingList();

/* 2. ENHANCED BOOKMARK BUTTON */
function createEnhancedBookmark() {
  const btn = document.getElementById('r-bookmark-btn');
  if (!btn) return;
  
  btn.innerHTML = '📚 Reading List';
  btn.classList.remove('saved');
  btn.style.cssText = `
    background: transparent;
    border: 2px solid #d4af37;
    color: #d4af37;
    padding: 10px 18px;
    border-radius: 4px;
    font-weight: 600;
    min-width: 140px;
    transition: all 0.3s ease;
  `;
  
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    const title = document.getElementById('r-bar-title').textContent;
    const slug = slugify(title);
    
    const isAdded = readingList.add(title, slug);
    
    if (isAdded) {
      this.innerHTML = '✓ Added to List';
      this.style.background = 'rgba(212,175,55,0.1)';
      this.style.borderColor = '#d4af37';
      toast('Added to Reading List');
      setTimeout(() => {
        this.innerHTML = '📚 Reading List';
        this.style.background = 'transparent';
      }, 2000);
    }
  });
}

/* 3. ENHANCED LIKE BUTTON */
function createEnhancedLike() {
  const btn = document.querySelector('.like-btn');
  if (!btn) return;
  
  btn.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: linear-gradient(135deg, rgba(224,92,122,0.1), transparent);
    border: 2px solid #e05c7a;
    padding: 10px 20px;
    border-radius: 4px;
    font-weight: 600;
    min-width: 140px;
    transition: all 0.3s ease;
    cursor: pointer;
  `;
  
  btn.querySelector('.like-heart').style.fontSize = '1.3rem';
  btn.querySelector('.like-count').style.fontSize = '0.9rem';
}

/* 4. SHARE BUTTON IMPROVEMENTS */
function createShareButtons() {
  const shareBtn = document.getElementById('r-share-btn');
  if (!shareBtn) return;
  
  shareBtn.style.cssText = `
    background: transparent;
    border: 2px solid #38bdf8;
    color: #38bdf8;
    padding: 10px 20px;
    border-radius: 4px;
    font-weight: 600;
    transition: all 0.3s ease;
  `;
  
  shareBtn.addEventListener('mouseenter', function() {
    this.style.background = 'rgba(56,189,248,0.1)';
  });
  
  shareBtn.addEventListener('mouseleave', function() {
    this.style.background = 'transparent';
  });
}

/* 5. OFFLINE MODE / READING PROGRESS */
function initOfflineMode() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  
  // Track reading progress
  const article = document.getElementById('r-scroll');
  if (article) {
    article.addEventListener('scroll', () => {
      const scrollPercent = (article.scrollTop / (article.scrollHeight - article.clientHeight)) * 100;
      const title = document.getElementById('r-bar-title').textContent;
      localStorage.setItem(`reading-progress-${slugify(title)}`, Math.round(scrollPercent));
    });
    
    // Restore progress on load
    const title = document.getElementById('r-bar-title').textContent;
    const saved = localStorage.getItem(`reading-progress-${slugify(title)}`);
    if (saved && parseInt(saved) > 0) {
      const targetScroll = (parseInt(saved) / 100) * (article.scrollHeight - article.clientHeight);
      setTimeout(() => {
        article.scrollTop = targetScroll;
      }, 500);
    }
  }
}

/* 6. QUICK READING STATS */
function addReadingStats() {
  const inner = document.getElementById('r-inner');
  if (!inner) return;
  
  const list = readingList.get();
  const stats = document.createElement('div');
  stats.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(8,8,8,0.95);
    border: 1px solid #d4af37;
    padding: 12px 20px;
    border-radius: 4px;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #d4af37;
    z-index: 99;
    display: none;
  `;
  
  const updateStats = () => {
    const list = readingList.get();
    stats.innerHTML = `📚 ${list.length} items in reading list`;
    if (list.length > 0) stats.style.display = 'block';
  };
  
  document.body.appendChild(stats);
  updateStats();
  
  // Update on bookmark add
  const originalAdd = readingList.add.bind(readingList);
  readingList.add = function(title, slug) {
    const result = originalAdd(title, slug);
    updateStats();
    return result;
  };
}

/* 7. HIGHLIGHTS TO READING LIST */
function highlightToList() {
  const scroll = document.getElementById('r-scroll');
  if (!scroll) return;
  
  scroll.addEventListener('mouseup', () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.toString().length < 10) return;
    
    const text = sel.toString().trim();
    const btn = document.createElement('button');
    btn.textContent = '+ Add to List';
    btn.style.cssText = `
      position: absolute;
      background: #d4af37;
      color: #000;
      border: none;
      padding: 8px 16px;
      border-radius: 2px;
      font-size: 0.7rem;
      font-weight: 600;
      cursor: pointer;
      z-index: 9999;
      transition: 0.2s;
    `;
    
    btn.addEventListener('click', () => {
      const title = document.getElementById('r-bar-title').textContent;
      readingList.add(title, slugify(title));
      toast('Saved highlight');
      btn.remove();
    });
    
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    btn.style.top = (rect.top + window.scrollY - 40) + 'px';
    btn.style.left = rect.left + 'px';
    document.body.appendChild(btn);
    
    setTimeout(() => btn.remove(), 3000);
  });
}

/* 8. INIT ALL */
function initCreativeFeatures() {
  createEnhancedBookmark();
  createEnhancedLike();
  createShareButtons();
  initOfflineMode();
  addReadingStats();
  highlightToList();
}

// Run on reader open
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCreativeFeatures);
} else {
  initCreativeFeatures();
}
