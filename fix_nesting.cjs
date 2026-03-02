const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Strip export to parse
  let jsonString = content.replace('export const en = ', '').replace('export const es = ', '');
  if (jsonString.endsWith(';')) jsonString = jsonString.slice(0, -1);
  if (jsonString.endsWith(';\n')) jsonString = jsonString.slice(0, -2);
  
  let obj;
  try {
    eval('obj = ' + jsonString);
  } catch (e) {
    console.error("Eval failed for " + file, e);
    return;
  }
  
  // Now reconstruct it!
  const newObj = { ...obj };

  if (newObj.translation.readings) {
    const toMove = ['header', 'pages', 'common'];
    for (const key of toMove) {
      if (newObj.translation.readings[key]) {
        newObj.translation[key] = newObj.translation.readings[key];
        delete newObj.translation.readings[key];
      }
    }
  }

  const exportName = file.includes('en') ? 'en' : 'es';
  const output = `export const ${exportName} = ` + JSON.stringify(newObj, null, 2) + ';\n';
  fs.writeFileSync(file, output);
  console.log("Fixed " + file);
}

fix('src/shared/presentation/i18n/locales/en.ts');
fix('src/shared/presentation/i18n/locales/es.ts');
