const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Let's use eval to parse the JS! Wait, it has 'export const es = ...', which is ES module.
  // So we strip that...
  let jsonString = content.replace('export const en = ', '').replace('export const es = ', '');
  if (jsonString.endsWith(';')) jsonString = jsonString.slice(0, -1);
  if (jsonString.endsWith(';\n')) jsonString = jsonString.slice(0, -2);
  
  // Actually, evaling it is easy:
  let obj;
  try {
    eval('obj = ' + jsonString);
  } catch (e) {
    console.error("Eval failed for " + file, e);
    return;
  }
  
  // Now reconstruct it!
  const newObj = {
    translation: {
      ...obj.translation,
    }
  };

  // Add the properties that are mistakenly at the root
  for (const k of Object.keys(obj)) {
    if (k !== 'translation') {
      newObj.translation[k] = obj[k];
    }
  }

  // Also, maybe `tabs` and `advancedReadings` which are currently under `translation`
  // should actually be inside `dashboard`? 
  // Let's look at `en.ts` history. Originally `tabs` and `advancedReadings` were under `dashboard` probably, 
  // but wait, `readings` has its own `tabs` and `columns` but they were incorrectly put under `dashboard` in the PR maybe.
  // For now, let's just make SURE everything missing is inside `translation`.
  
  const output = 'export const ' + (file.includes('en') ? 'en' : 'es') + ' = ' + JSON.stringify(newObj, null, 2) + ';\n';
  fs.writeFileSync(file, output);
  console.log("Fixed " + file);
}

fix('src/shared/presentation/i18n/locales/en.ts');
fix('src/shared/presentation/i18n/locales/es.ts');
