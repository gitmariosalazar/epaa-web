export type TypeIncomeStatus = 'P' | 'A' | 'B' | '0' | null | undefined;

export const getLabelIncomeStatus = (status: TypeIncomeStatus): string => {
  switch (status) {
    case 'P':
      return 'Pagado';
    case 'A':
      return 'Anulado';
    case 'B':
      return 'Baja';
    case '0':
      return 'Estado 0';
    case null:
      return 'Pendiente';
    case undefined:
      return 'Pendiente';
    default:
      return 'Pendiente';
  }
};

export const getColorIncomeStatus = (
  status: TypeIncomeStatus
):
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'primary'
  | 'secondary'
  | 'accent' => {
  switch (status) {
    case 'P':
      return 'success';
    case 'A':
      return 'error';
    case 'B':
      return 'warning';
    case '0':
      return 'warning';
    case null:
      return 'error';
    case undefined:
      return 'error';
    default:
      return 'warning';
  }
};
