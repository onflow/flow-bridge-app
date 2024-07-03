// src/components/GenericModal.tsx
import React, { useRef } from 'react';

interface GenericModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const GenericModal: React.FC<GenericModalProps> = ({ title, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-card p-6 rounded-lg w-full max-w-lg min-w-[200px] min-h-[300px] h-[50%] flex flex-col"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">{title}</h2>
          <button onClick={onClose} className="bg-transparent text-white">&times;</button>
        </div>
        <div className="overflow-auto flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GenericModal;