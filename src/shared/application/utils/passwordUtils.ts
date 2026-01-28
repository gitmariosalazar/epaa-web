export const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;

  let score = 0;

  // Length check
  if (password.length > 6) score += 1;
  if (password.length > 10) score += 1;

  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // Cap at 4
  return Math.min(score, 4);
};

export const getStrengthLabel = (score: number): string => {
  switch (score) {
    case 0:
      return 'Very Weak';
    case 1:
      return 'Weak';
    case 2:
      return 'Fair';
    case 3:
      return 'Good';
    case 4:
      return 'Strong';
    default:
      return '';
  }
};
