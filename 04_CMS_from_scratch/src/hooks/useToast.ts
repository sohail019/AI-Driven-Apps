import { useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (
    message: string,
    type: ToastType = "info",
    duration = 3000
  ) => {
    const id = Math.random().toString(36).substring(2, 9);

    const newToast = { id, message, type, duration };
    setToasts((prev) => [...prev, newToast]);

    if (duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message: string, duration?: number) => {
    return toast(message, "success", duration);
  };

  const error = (message: string, duration?: number) => {
    return toast(message, "error", duration);
  };

  const info = (message: string, duration?: number) => {
    return toast(message, "info", duration);
  };

  const warning = (message: string, duration?: number) => {
    return toast(message, "warning", duration);
  };

  return {
    toasts,
    toast,
    success,
    error,
    info,
    warning,
    removeToast,
  };
}
