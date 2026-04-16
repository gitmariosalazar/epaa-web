import i18n from 'i18next';

export const ConvertMonth = (month: number | string): string => {
  const HashMonths: Record<number, string> = {
    1: i18n.t('accounting:months.january', 'Enero'),
    2: i18n.t('accounting:months.february', 'Febrero'),
    3: i18n.t('accounting:months.march', 'Marzo'),
    4: i18n.t('accounting:months.april', 'Abril'),
    5: i18n.t('accounting:months.may', 'Mayo'),
    6: i18n.t('accounting:months.june', 'Junio'),
    7: i18n.t('accounting:months.july', 'Julio'),
    8: i18n.t('accounting:months.august', 'Agosto'),
    9: i18n.t('accounting:months.september', 'Septiembre'),
    10: i18n.t('accounting:months.october', 'Octubre'),
    11: i18n.t('accounting:months.november', 'Noviembre'),
    12: i18n.t('accounting:months.december', 'Diciembre')
  };
  return HashMonths[Number(month)];
};

export const ConvertMonthNumber = (month: string): number => {
  const HashMonths: Record<string, number> = {
    Enero: 1,
    Febrero: 2,
    Marzo: 3,
    Abril: 4,
    Mayo: 5,
    Junio: 6,
    Julio: 7,
    Agosto: 8,
    Septiembre: 9,
    Octubre: 10,
    Noviembre: 11,
    Diciembre: 12
  };
  return HashMonths[month];
};

export const ConvertMonthAbbreviation = (month: string): string => {
  const HashMonths: Record<string, string> = {
    [i18n.t('accounting:months.january', 'Enero')]: 'Ene',
    [i18n.t('accounting:months.february', 'Febrero')]: 'Feb',
    [i18n.t('accounting:months.march', 'Marzo')]: 'Mar',
    [i18n.t('accounting:months.april', 'Abril')]: 'Abr',
    [i18n.t('accounting:months.may', 'Mayo')]: 'May',
    [i18n.t('accounting:months.june', 'Junio')]: 'Jun',
    [i18n.t('accounting:months.july', 'Julio')]: 'Jul',
    [i18n.t('accounting:months.august', 'Agosto')]: 'Ago',
    [i18n.t('accounting:months.september', 'Septiembre')]: 'Sep',
    [i18n.t('accounting:months.october', 'Octubre')]: 'Oct',
    [i18n.t('accounting:months.november', 'Noviembre')]: 'Nov',
    [i18n.t('accounting:months.december', 'Diciembre')]: 'Dic'
  };
  return HashMonths[month];
};

export const ConvertMonthAbbreviationNumber = (month: number): string => {
  const HashMonths: Record<number, string> = {
    1: i18n.t('accounting:months.january', 'Ene'),
    2: i18n.t('accounting:months.february', 'Feb'),
    3: i18n.t('accounting:months.march', 'Mar'),
    4: i18n.t('accounting:months.april', 'Abr'),
    5: i18n.t('accounting:months.may', 'May'),
    6: i18n.t('accounting:months.june', 'Jun'),
    7: i18n.t('accounting:months.july', 'Jul'),
    8: i18n.t('accounting:months.august', 'Ago'),
    9: i18n.t('accounting:months.september', 'Sep'),
    10: i18n.t('accounting:months.october', 'Oct'),
    11: i18n.t('accounting:months.november', 'Nov'),
    12: i18n.t('accounting:months.december', 'Dic')
  };
  return HashMonths[month];
};

export const ConvertDay = (day: number): string => {
  const HashDays: Record<number, string> = {
    1: i18n.t('accounting:days.monday', 'Lunes'),
    2: i18n.t('accounting:days.tuesday', 'Martes'),
    3: i18n.t('accounting:days.wednesday', 'Miercoles'),
    4: i18n.t('accounting:days.thursday', 'Jueves'),
    5: i18n.t('accounting:days.friday', 'Viernes'),
    6: i18n.t('accounting:days.saturday', 'Sabado'),
    7: i18n.t('accounting:days.sunday', 'Domingo')
  };
  return HashDays[day];
};
