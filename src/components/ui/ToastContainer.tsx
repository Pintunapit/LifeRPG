import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useToast, ToastType } from '../../context/ToastContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-rpg-emerald shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-rpg-gold shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rpg-crimson shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-rpg-cyan shrink-0" />;
    }
  };

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-rpg-emerald/40 shadow-glow-emerald';
      case 'warning':
        return 'border-rpg-gold/40 shadow-glow-gold';
      case 'error':
        return 'border-rpg-crimson/40 shadow-glow-crimson';
      default:
        return 'border-rpg-cyan/40 shadow-glow-cyan';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl glass-panel border bg-rpg-card/95 ${getBorderColor(
              toast.type
            )} backdrop-blur-md transition-all shadow-xl`}
          >
            {getToastIcon(toast.type)}
            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-0.5 font-rpg">
                  {toast.title}
                </h4>
              )}
              <p className="text-sm text-slate-300 font-medium leading-tight break-words">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
