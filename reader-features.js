function slugify(text) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Check window scope to prevent "already been declared" crash
if (!window.ReadingList) {
  window.ReadingList = class ReadingList {
    constructor() {
      this.items = [];
    }
    // Your existing reading list methods go below if needed
  };
}

console.log("✔ Reader features initialization initialized cleanly.");
