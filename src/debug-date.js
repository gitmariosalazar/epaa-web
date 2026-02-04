const timeZone = 'America/Guayaquil';

function toISODateString(date) {
  const d = new Date(date);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(d);
}

const now = new Date();
console.log('System Now (UTC/Local):', now.toISOString());
console.log('System Now (toString):', now.toString());

const ecuadorDate = toISODateString(now);
console.log('Ecuador Date String:', ecuadorDate);

// Check if hardcoded timestamp works
// 2026-02-03T21:27:53-05:00 is 2026-02-04T02:27:53Z
const specificTime = new Date('2026-02-04T02:27:53Z');
console.log('Specific UTC Time:', specificTime.toISOString());
console.log('Specific Ecuador Date:', toISODateString(specificTime));
