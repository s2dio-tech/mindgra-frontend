import React from "react";

const Modal: React.FC<{
  id: string,
  onClose?: ()=> void,
  children: any
}> = ({
  id,
  onClose,
  children
}) => {

  return (
    <dialog id={id} className="modal" onCancel={e => onClose?.call(this)}>
      <div className="modal-box bg-transparent overflow-visible shadow-none">
        {children}
        <button
          onClick={e => onClose?.call(this)}
          className="btn btn-sm btn-ghost absolute right-8 top-8"
        >✕</button>
      </div>
    </dialog>
  )
}

export default Modal;