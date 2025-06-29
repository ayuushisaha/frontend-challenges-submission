const fs = require('fs');
const path = require('path');

const username = process.env.CONTRIBUTOR_USERNAME;
if (!username) {
  console.error('Missing CONTRIBUTOR_USERNAME env variable');
  process.exit(1);
}

const readmePath = path.join(process.cwd(), 'README.md');
let readme = fs.readFileSync(readmePath, 'utf8');

const contribSectionRegex = /(## Contributors\s*\n)((?:.|\n)*?)(\n## |\n# |\n$)/;
const contributorLine = `- [@${username}](https://github.com/${username})`;

if (readme.includes(contributorLine)) {
  console.log('Contributor already present. Skipping.');
  process.exit(0);
}

if (contribSectionRegex.test(readme)) {
  // Add to existing Contributors section
  readme = readme.replace(
    contribSectionRegex,
    (_, sectionHeader, sectionBody, sectionEnd) =>
      `${sectionHeader}${sectionBody}${contributorLine}\n${sectionEnd}`
  );
} else {
  // Add new Contributors section at the end
  readme += `\n## Contributors\n${contributorLine}\n`;
}

fs.writeFileSync(readmePath, readme, 'utf8');
console.log(`Added ${username} to Contributors section.`);
