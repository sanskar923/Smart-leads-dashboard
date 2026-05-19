import { CheckCircle, Info, X, XCircle } from 'lucide-react';
import type { Toast as ToastItem, ToastType } from '../../context/ToastContext';
import { cn } from '../../utils/cn';

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-brand-500" />,
};

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer = ({ toasts, onDismiss }: ToastContainerProps) => (
  <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={cn(
          'flex min-w-[280px] items-center gap-3 rounded-lg border bg-white px-4 py-3 shadow-lg dark:border-slate-700 dark:bg-slate-800',
          toast.type === 'success' && 'border-emerald-200 dark:border-emerald-900',
          toast.type === 'error' && 'border-red-200 dark:border-red-900'
        )}
      >
        {icons[toast.type]}
        <p className="flex-1 text-sm text-slate-700 dark:text-slate-200">{toast.message}</p>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ))}
  </div>
);
