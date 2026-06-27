const fs = require('fs');

const data = JSON.parse(fs.readFileSync('portfolio.json', 'utf8'));

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function generateCard(project) {
  const tagsHtml = project.tags
    .map(tag => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join('');

  const linksHtml = project.links
    .map(link => `<a href="${escapeHtml(link.url)}" class="view-link" target="_blank">${escapeHtml(link.text)}</a>`)
    .join('');

  return `      <div class="project-card">
        <h3>${escapeHtml(project.title)}</h3>
        <div class="tags">${tagsHtml}</div>
        <p>${escapeHtml(project.description)}</p>
        <div class="card-links">
          ${linksHtml}
        </div>
      </div>`;
}

console.log(data.projects.map(generateCard).join('\n\n'));
