import React from 'react';
import './modal.css';

const Modal = (props) => {
  const { onClick = () => {}, visible = false, modalData = null } = props;
  return (
    <div
      style={{ display: visible ? 'block' : 'none' }}
      className="modal"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">Error</div>
          <button type="button" data-close aria-label="Close" onClick={onClick}>
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              className="bi bi-x"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          {modalData
            ? modalData
            : 'API is down or not responding. Please contact an administrator.'}
        </div>
      </div>
    </div>
  );
};

export default Modal;
