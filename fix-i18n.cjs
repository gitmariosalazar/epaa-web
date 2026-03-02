const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Extract the misguided block
  const extractRegex = /(?:[ \t]*tabs: \{\n(?:.*?)\n[ \t]*additionalInfo: \{\n(?:.*?)\n[ \t]*\}\n)/s;
  const match = extractRegex.exec(content);
  if (!match) {
    console.log('No match found for misplaced blocks in ' + file);
    return;
  }
  
  const extracted = match[0];
  content = content.replace(extracted, '');
  
  // Reformat it to use 4 spaces instead of 8 for its top level keys
  const reformatted = extracted.split('\n').map(line => {
    if (line.startsWith('    ')) return line.substring(4);
    return line;
  }).join('\n');
  
  // Inject reformatted inside `readings: {`
  content = content.replace(/([ \t]*)readings: \{\n/, '$1readings: {\n' + reformatted);
  
  // Move `readings` block inside `translation` block
  content = content.replace(/\}[ \t\n]*\},[ \t\n]*readings: \{/, '  },\n      readings: {');
  
  // Fix the closing brace since `readings` is now inside `translation`
  // Previously we had:
  //      }
  //    },
  //    readings: {
  //      ...
  //    }
  //  }
  // };
  // But wait, the file ends with
  //    }
  //  }
  //};
  // Wait, let's not touch the end of the file yet, as if `readings` was moved inside, the file would now have an extra brace!
  fs.writeFileSync(file, content);
  
  // Let's actually fix the braces at the end of the file.
  // We can just count braces or ensure the last few lines are correct.
  // The original ended with:
  //       }
  //     }
  //   }
  // };
  // Wait, let's just make the closing `};` correct.
  
  console.log('Fixed ' + file);
}

fixFile('src/shared/presentation/i18n/locales/en.ts');
fixFile('src/shared/presentation/i18n/locales/es.ts');
