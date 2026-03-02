const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Strip export to parse
  const exportPrefixStr = file.includes('en.ts') ? 'export const en = ' : 'export const es = ';
  let jsonString = content.replace(exportPrefixStr, '');
  if (jsonString.endsWith(';')) jsonString = jsonString.slice(0, -1);
  if (jsonString.endsWith(';\n')) jsonString = jsonString.slice(0, -2);
  
  let obj;
  try {
    eval('obj = ' + jsonString);
  } catch (e) {
    console.error("Eval failed for " + file, e);
    return;
  }
  
  const newObj = { ...obj };

  // Ensure dashboard root exists
  if (!newObj.translation.dashboard) {
    newObj.translation.dashboard = {};
  }

  // Move misnested properties under translation.dashboard
  const propsToMove = ['tabs', 'advancedReadings'];
  for (const prop of propsToMove) {
    if (newObj.translation[prop]) {
      newObj.translation.dashboard[prop] = newObj.translation[prop];
      delete newObj.translation[prop];
    }
  }

  const exportName = file.includes('en.ts') ? 'en' : 'es';
  const output = `export const ${exportName} = ` + JSON.stringify(newObj, null, 2) + ';\n';
  fs.writeFileSync(file, output);
  console.log("Fixed dashboard nesting in " + file);
}

fix('src/shared/presentation/i18n/locales/en.ts');
fix('src/shared/presentation/i18n/locales/es.ts');
