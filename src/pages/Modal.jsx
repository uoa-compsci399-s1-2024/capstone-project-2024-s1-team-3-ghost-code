import React from 'react';
import './Modal.css';

const Modal = ({ show, handleClose }) => {
  return (
    <div className={`modal ${show ? 'show' : ''}`} onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={handleClose}>&times;</span>
        <p>By providing your email address, you expressly consent to the collection and use of your personal information by TMS Training Quiz. This may include disclosing your full name, organization details, and quiz progress to other users who hold just your email address within the TMS Training Quiz platform. We prioritize the protection and privacy of your data and will only disclose it for legitimate purposes consistent with our Privacy Policy. You have the right to withdraw your consent or update your preferences at any time. For more information, please review our Privacy Policy.</p>
      </div>
    </div>
  );
};

export default Modal;
