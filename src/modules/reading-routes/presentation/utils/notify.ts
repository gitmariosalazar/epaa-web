import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';

export const notify = {
  success: (msg: string, title: string = 'Éxito') =>
    MessageToastCustom('success', msg, title, { position: 'top-right' }),
  error: (msg: string, title: string = 'Error') =>
    MessageToastCustom('error', msg, title, { position: 'top-right' }),
  warning: (msg: string, title: string = 'Atención') =>
    MessageToastCustom('warning', msg, title, { position: 'top-right' }),
  info: (msg: string, title: string = 'Información') =>
    MessageToastCustom('info', msg, title, { position: 'top-right' }),
};
