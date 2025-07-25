import React from "react";

const Modal = ({ open, isOpen, onClose, title, children, actions, size = "md" }) => {
  const isModalOpen = open || isOpen;
  if (!isModalOpen) return null;
  
  let maxWidth = "max-w-lg";
  if (size === "lg") maxWidth = "max-w-2xl";
  if (size === "xl") maxWidth = "max-w-4xl";
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className={`bg-[#181a20] rounded-2xl shadow-2xl border border-white/10 w-full ${maxWidth} p-8 relative animate-fadeIn mt-16`}>
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {title && <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>}
        <div className="mb-6">{children}</div>
        {actions && <div className="flex gap-4 justify-end">{actions}</div>}
      </div>
    </div>
  );
};

export default Modal; 