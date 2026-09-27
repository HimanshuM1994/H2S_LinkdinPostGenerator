import React from 'react';

interface ToastProps {
  message: string | null;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in flex items-center gap-2.5 bg-[#263143] text-[#ecf1ff] px-4 py-3 rounded-xl shadow-2xl border border-slate-700">
      <span className="material-symbols-outlined text-[#006d3c] text-[20px] bg-[#97f7b6] rounded-full p-0.5">
        check_circle
      </span>
      <span className="text-xs font-semibold">{message}</span>
    </div>
  );
};
