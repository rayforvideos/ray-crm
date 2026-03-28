import { useEffect } from 'react';
import type { ToastConfig } from '../types';

interface Props {
  config: ToastConfig;
  onDismiss: () => void;
}

export function Toast({ config, onDismiss }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, config.duration * 1000);
    return () => clearTimeout(timer);
  }, [config.duration, onDismiss]);

  return (
    <div className="ray-crm-toast-container">
      <div
        className={`ray-crm-toast ray-crm-toast--${config.toastType}`}
        onClick={onDismiss}
      >
        {config.message}
      </div>
    </div>
  );
}
