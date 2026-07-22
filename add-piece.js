const fs = require('fs');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

(async () => {
  const dataPath = 'pieces.json';
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log('--- Add a new piece ---');
  const typeInput = (await ask('Type (article/poem/book): ')).trim().toLowerCase();
  const section = typeInput === 'poem' ? 'poems' : typeInput === 'book' ? 'books' : 'articles';

  const title = (await ask('Title: ')).trim();
  const description = (await ask('Description (no em dashes please): ')).trim();
  const tagsRaw = (await ask('Tags (comma separated, e.g. love,grief): ')).trim();
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
  const time = (await ask('Read time (e.g. "5 MIN READ"): ')).trim() || '5 MIN READ';

  let file = null;
  let external = false;
  let externalUrl = null;

  if (section !== 'books') {
    file = (await ask('Exact PDF filename (must match file in repo root): ')).trim();
    if (!fs.existsSync(file)) {
      console.log(`⚠ Warning: "${file}" not found in this folder. Double check the filename before pushing.`);
    }
  } else {
    const isExternal = (await ask('Is this an external link (Wattpad etc)? (y/n): ')).trim().toLowerCase();
    if (isExternal === 'y') {
      external = true;
      externalUrl = (await ask('External URL: ')).trim();
    }
  }

  if (description.includes('—') || description.includes('–')) {
    console.log('⚠ Description contains an em/en dash — removing per your preference.');
  }
  const cleanDescription = description.replace(/—|–/g, ',');

  const today = new Date().toISOString();

  const entry = { file, title, description: cleanDescription, tags, time, date: today };
  if (section === 'books') {
    entry.external = external;
    if (external) entry.externalUrl = externalUrl;
  }

  data[section].push(entry);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log(`\n✓ Added "${title}" to ${section} with date ${today}`);

  rl.close();

  console.log('\nRegenerating site files...');
  execSync('npm run update-pieces', { stdio: 'inherit' });

  console.log('\nDone. Review the changes, then commit with:');
  console.log(`  git add pieces.json cards-generated.html writing.html "${file || ''}"`);
  console.log(`  git commit -m "Add new piece: ${title}"`);
  console.log('  git push');
})();
