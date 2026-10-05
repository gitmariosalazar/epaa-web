import { toast, type ToastPosition } from 'react-toastify';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import './CustomMessageToast.css';

type CustomToastProps = {
  title: string;
  icon: 'success' | 'info' | 'warning' | 'error' | 'dark';
  message: string;
};

const CustomToast = ({ title, icon, message }: CustomToastProps) => {
  let IconComponent;

  // El color del icono lo define el CSS (--toast-accent) según variante y tema.
  switch (icon) {
    case 'success':
      IconComponent = CheckCircle2;
      break;
    case 'info':
      IconComponent = Info;
      break;
    case 'warning':
      IconComponent = AlertTriangle;
      break;
    case 'error':
      IconComponent = XCircle;
      break;
    default:
      IconComponent = AlertCircle;
  }

  return (
    <div className="container-toast">
      <div className="icon-toast-wrapper" aria-hidden="true">
        <IconComponent size={20} strokeWidth={2.25} />
      </div>
      <div className="body-toast">
        <div className="title-toast">
          <p>{title}</p>
        </div>
        <div className="message-toast">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

interface ToastOptions {
  position?: ToastPosition;
  duration?: number;
}

const MessageToastCustom = (
  theme: 'success' | 'info' | 'warning' | 'error' | 'dark',
  message: string,
  title: string,
  options: ToastOptions = {}
) => {
  const { position = 'bottom-right', duration = 5000 } = options;

  toast(
    <CustomToast title={title} icon={theme} message={message} />,
    {
      position: position,
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: `custom-toast-node ${theme}`
    }
  );
};

export { MessageToastCustom };
