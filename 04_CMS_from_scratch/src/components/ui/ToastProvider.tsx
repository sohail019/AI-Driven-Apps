import React, { createContext, useContext, useState } from "react";
import { ToastType } from "../../hooks/useToast";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type: ToastType) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 3000);
  };

  const dismissToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      {/* Toast Container */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`flex items-center p-4 rounded shadow-lg max-w-xs ${getToastStyles(
                toast.type
              )}`}
            >
              <div className="flex-1">{toast.message}</div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};

// Helper function to get toast colors
const getToastStyles = (type: ToastType): string => {
  switch (type) {
    case "success":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "error":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    case "warning":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "info":
    default:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
  }
};
