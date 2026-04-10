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
