import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

// Create context for toast management
const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'default', duration = 3000) => {
    const id = Date.now().toString();
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const value = {
    toasts,
    addToast,
    removeToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col gap-2 max-w-md">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast 
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

const toastVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.95 }
};

const TOAST_TYPES = {
  default: { bg: 'bg-gray-800', icon: '🔔' },
  success: { bg: 'bg-secondary', icon: '✅' },
  error: { bg: 'bg-alert', icon: '❌' },
  warning: { bg: 'bg-yellow-500', icon: '⚠️' },
  info: { bg: 'bg-blue-500', icon: 'ℹ️' }
};

function Toast({ id, message, type = 'default', duration = 3000, onClose }) {
  const toastType = TOAST_TYPES[type] || TOAST_TYPES.default;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(
        'rounded-lg p-4 shadow-lg text-white min-w-[300px] flex items-center space-x-3',
        toastType.bg
      )}
    >
      <span className="text-lg">{toastType.icon}</span>
      <p className="flex-1">{message}</p>
      <button 
        onClick={onClose}
        className="text-white opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Close toast"
      >
        ×
      </button>
    </motion.div>
  );
} 