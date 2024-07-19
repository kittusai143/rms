import React from 'react';
import { IoMdCloseCircleOutline } from "react-icons/io";
import './Model.css'; // Assume we have some basic styling for the modal

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}  ><IoMdCloseCircleOutline style={{ width:"2em",height:'2em'}}/></button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
