const fs = require('fs');
const path = require('path');

const username = process.env.CONTRIBUTOR_USERNAME;
if (!username) {
  console.error('Missing CONTRIBUTOR_USERNAME env variable');
  process.exit(1);
}

const readmePath = path.join(process.cwd(), 'README.md');
let readme = fs.readFileSync(readmePath, 'utf8');

// Where to add the Contributors section (after "Thanks for being part of Codextream")
const thankYouMarker = "## 🙌 Thanks for being part of Codextream!";

// Contributor markdown line
const contributorLine = `- [@${username}](https://github.com/${username})`;

// Check if already present
if (readme.includes(contributorLine)) {
  console.log('Contributor already present. Skipping.');
  process.exit(0);
}

const contributorsHeader = "## Contributors";
const insertSection = `\n${contributorsHeader}\n${contributorLine}\n`;

if (readme.includes(contributorsHeader)) {
  // Add to existing Contributors section (append if not present)
  const contribSectionRegex = /(## Contributors\s*\n)((?:.|\n)*?)(\n## |\n# |\n$)/;
  readme = readme.replace(
    contribSectionRegex,
    (match, sectionHeader, sectionBody, sectionEnd) => {
      if (sectionBody.includes(contributorLine)) {
        return match; // Already present
      }
      return `${sectionHeader}${sectionBody}${contributorLine}\n${sectionEnd}`;
    }
  );
} else if (readme.includes(thankYouMarker)) {
  // Add Contributors section after Thank You marker
  const thankYouIndex = readme.indexOf(thankYouMarker);
  const afterThankYouIndex = readme.indexOf('\n', thankYouIndex);
  const before = readme.slice(0, afterThankYouIndex + 1);
  const after = readme.slice(afterThankYouIndex + 1);
  readme = before + insertSection + after;
} else {
  // Fallback: append at end
  readme += insertSection;
}

fs.writeFileSync(readmePath, readme, 'utf8');
console.log(`Added ${username} to Contributors section.`);
