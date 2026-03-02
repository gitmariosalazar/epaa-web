const fs = require('fs');

function fixBraces(file) {
  let content = fs.readFileSync(file, 'utf8');

  // We know the current structure ends with:
  //       end: 'Fin'
  //     } // closes additionalInfo
  //     header: {
  //       ...
  //     },
  //     common: {
  //       ...
  //       cadastralPlaceholder: 'Ej: 1-125 o 40-5'
  //     } // closes common
  //   } // closes readings
  // }; // closes module

  // Wait, if it's missing the translation brace, we just need to add it BEFORE `readings`,
  // and add a closing brace FOR translation at the end.
  // We need to change:
  //     }
  //     header: {
  // to:
  //     }
  //   },
  //   readings: {
  //     header: {

  content = content.replace(
    /([ \t]+end: '[^']+'\n[ \t]*\})\n([ \t]*header: \{)/,
    '$1\n  },\n    readings: {\n$2'
  );

  // Then we need to fix the end of the file.
  // The file currently ends with:
  //     }
  //   }
  // };
  // But wait! If we added `readings: {`, then `readings` is inside `translation`? No `readings` is closed, and `translation` needs closing!
  // Wait, `translation` has 2 spaces indent. `readings` inside `translation` should have 4 spaces indent.
  // The indentation of `header: {` is currently 4 spaces.
  // So `readings: {` should be 4 spaces, `header: {` should be 6 spaces?
  // Let's just wrap `readings` properly and not worry about perfect indentation of its contents for now.

  const endReplacementRegex =
    /([ \t]*cadastralPlaceholder: '[^']+'\n[ \t]*\})\n[ \t]*\}\n\};/;
  // We need to add one more brace.
  content = content.replace(endReplacementRegex, '$1\n    }\n  }\n};');

  fs.writeFileSync(file, content);
  console.log('Fixed braces ' + file);
}

fixBraces('src/shared/presentation/i18n/locales/en.ts');
fixBraces('src/shared/presentation/i18n/locales/es.ts');
