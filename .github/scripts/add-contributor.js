const fs = require('fs');
const path = require('path');

const username = process.env.CONTRIBUTOR_USERNAME;
if (!username) {
  console.error('Missing CONTRIBUTOR_USERNAME env variable');
  process.exit(1);
}

const readmePath = path.join(process.cwd(), '/readme.md');
let readme = fs.readFileSync(readmePath, 'utf8');

const thankYouMarker = "## 🙌 Thanks for being part of Codextream!";
const contributorsHeader = "## Contributors";
const contributorLine = `- [@${username}](https://github.com/${username})`;

// Already present? Exit.
if (readme.includes(contributorLine)) {
  console.log('Contributor already present. Skipping.');
  process.exit(0);
}

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
  readme = before + `\n${contributorsHeader}\n${contributorLine}\n` + after;
} else {
  // Fallback: append at end
  readme += `\n${contributorsHeader}\n${contributorLine}\n`;
}

fs.writeFileSync(readmePath, readme, 'utf8');
console.log(`Added ${username} to Contributors section.`);
