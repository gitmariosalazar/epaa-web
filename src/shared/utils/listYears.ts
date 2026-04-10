export const listYears = (yearsToGenerate: number = 20) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= currentYear - yearsToGenerate; i--) {
    years.push(i);
  }
  return years;
};
