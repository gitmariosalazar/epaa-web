const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // We need to extract the misplaced blocks from inside `dashboard`
  // and put them inside `readings`.
  // The misplaced blocks start with `        tabs: {` and end with `        additionalInfo: { ... }`
  
  // They are roughly after `sectorReadings: { ... } },\n`
  const extractRegex = /(?:[ \t]*tabs: \{\n(?:.*?)\n[ \t]*additionalInfo: \{\n(?:.*?)\n[ \t]*\}\n)/s;
  
  const match = extractRegex.exec(content);
  if (!match) {
    console.log('No match found for misplaced blocks in ' + file);
    return;
  }
  
  const extracted = match[0];
  content = content.replace(extracted, '');
  
  // Now we need to move `readings: {` INSIDE `translation: {`
  // The file currently has:
  // `    },\n    readings: {\n` at the end of `translation`.
  // Wait, no, it has `      }\n    },\n    readings: {`
  // Let's find `    },\n    readings: {\n`
  
  const readingsStart = content.indexOf('    readings: {\n');
  if (readingsStart === -1) {
    console.log('No readings block found in ' + file);
    return;
  }
  
  // The block of `readings` goes all the way to `    }\n  }\n};\n`
  // wait, let's just do a string replace:
  // Re-format `extracted` so it has 4 spaces instead of 8:
  const reformatted = extracted.split('\n').map(line => {
    if (line.startsWith('    ')) return line.substring(4);
    return line;
  }).join('\n');
  
  // Instead of complex AST, let's just do:
  // 1. Move the `extracted` block to be inside `readings: {`
  // 2. Put `readings` inside `translation:{`
  // Let's just find `readings: {` and inject `reformatted` right after it
  
  content = content.replace('    readings: {\n', '    readings: {\n' + reformatted);
  
  // Now move `readings` inside `translation`
  // We can change:
  /*
        }
      }
    },
    readings: {
  */
  // to:
  /*
        }
      },
      readings: {
  */
  content = content.replace(/\}[ \t\n]*\},[ \t\n]*readings: \{/, '  },\n      readings: {');
  
  // Also we need to fix the end brace.
  // The file originally ended with:
  /*
      }
    }
  };
  */
  // But wait, en.ts line 301 is `      }`, 302 is `    },`, 303 `    readings: {`
  // so `},\n    readings: {` should become `},\n      readings: {`
  
  content = content.replace(/^[ \t]*\},[ \t]*\n[ \t]*readings: \{/m, '      readings: {');
  
  fs.writeFileSync(file, content);
  console.log('Fixed ' + file);
}

fixFile('src/shared/presentation/i18n/locales/en.ts');
fixFile('src/shared/presentation/i18n/locales/es.ts');
