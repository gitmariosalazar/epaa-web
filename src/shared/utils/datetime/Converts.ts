import { useTranslation } from 'react-i18next';

export const ConvertMonth = (month: number | string): string => {
  const { t } = useTranslation();
  const HashMonths: Record<number, string> = {
    1: t('accounting:months.january', 'Enero'),
    2: t('accounting:months.february', 'Febrero'),
    3: t('accounting:months.march', 'Marzo'),
    4: t('accounting:months.april', 'Abril'),
    5: t('accounting:months.may', 'Mayo'),
    6: t('accounting:months.june', 'Junio'),
    7: t('accounting:months.july', 'Julio'),
    8: t('accounting:months.august', 'Agosto'),
    9: t('accounting:months.september', 'Septiembre'),
    10: t('accounting:months.october', 'Octubre'),
    11: t('accounting:months.november', 'Noviembre'),
    12: t('accounting:months.december', 'Diciembre')
  };
  return HashMonths[Number(month)];
};

export const ConvertMonthNumber = (month: string): number => {
  const { t } = useTranslation();
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
  const { t } = useTranslation();
  const HashMonths: Record<string, string> = {
    [t('accounting:months.january', 'Enero')]: 'Ene',
    [t('accounting:months.february', 'Febrero')]: 'Feb',
    [t('accounting:months.march', 'Marzo')]: 'Mar',
    [t('accounting:months.april', 'Abril')]: 'Abr',
    [t('accounting:months.may', 'Mayo')]: 'May',
    [t('accounting:months.june', 'Junio')]: 'Jun',
    [t('accounting:months.july', 'Julio')]: 'Jul',
    [t('accounting:months.august', 'Agosto')]: 'Ago',
    [t('accounting:months.september', 'Septiembre')]: 'Sep',
    [t('accounting:months.october', 'Octubre')]: 'Oct',
    [t('accounting:months.november', 'Noviembre')]: 'Nov',
    [t('accounting:months.december', 'Diciembre')]: 'Dic'
  };
  return HashMonths[month];
};

export const ConvertMonthAbbreviationNumber = (month: number): string => {
  const { t } = useTranslation();
  const HashMonths: Record<number, string> = {
    1: [t('accounting:months.january', 'Ene')],
    2: [t('accounting:months.february', 'Feb')],
    3: [t('accounting:months.march', 'Mar')],
    4: [t('accounting:months.april', 'Abr')],
    5: [t('accounting:months.may', 'May')],
    6: [t('accounting:months.june', 'Jun')],
    7: [t('accounting:months.july', 'Jul')],
    8: [t('accounting:months.august', 'Ago')],
    9: [t('accounting:months.september', 'Sep')],
    10: [t('accounting:months.october', 'Oct')],
    11: [t('accounting:months.november', 'Nov')],
    12: [t('accounting:months.december', 'Dic')]
  };
  return HashMonths[month];
};

export const ConvertDay = (day: number): string => {
  const { t } = useTranslation();
  const HashDays: Record<number, string> = {
    1: t('accounting:days.monday', 'Lunes'),
    2: t('accounting:days.tuesday', 'Martes'),
    3: t('accounting:days.wednesday', 'Miercoles'),
    4: t('accounting:days.thursday', 'Jueves'),
    5: t('accounting:days.friday', 'Viernes'),
    6: t('accounting:days.saturday', 'Sabado'),
    7: t('accounting:days.sunday', 'Domingo')
  };
  return HashDays[day];
};
