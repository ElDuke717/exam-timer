import React, { useEffect } from 'react';
import './Modal.css';

function Modal({ isOpen, onClose, children }) {
    useEffect(() => {
      const handleKeyDown = e => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      if (isOpen) {
        window.addEventListener('keydown', handleKeyDown);
      }
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen, onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        <button className="modal-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default Modal;