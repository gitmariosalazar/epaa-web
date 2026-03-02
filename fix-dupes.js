const fs = require('fs');

function fixDupes(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Find the exact block created by my previous script
  // It added:
  //   },
  //     readings: {
  //     header: {
  // So we replace it with:
  //   },
  //   header: {
  content = content.replace(/([ \t]*\}\n)[ \t]*\},?\n[ \t]*readings: \{\n[ \t]*header: \{/, '$1    },\n    header: {');
  
  fs.writeFileSync(file, content);
  console.log('Fixed ' + file);
}

fixDupes('src/shared/presentation/i18n/locales/en.ts');
fixDupes('src/shared/presentation/i18n/locales/es.ts');
