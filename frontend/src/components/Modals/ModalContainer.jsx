import React from "react";

const ModalContainer = ({ children, visible, onClose, ignoreContainer }) => {
  const handleClick = (e) => {
    if (e.target.id === "modal-container") {
      onClose && onClose();
    }
  };

  const renderChildren = () => {
    if (ignoreContainer) return children;
    return (
      <div className="dark:bg-primary bg-white rounded w-[45rem] h-[40rem] overflow-auto p-2 custom-scroll-bar">
        {children}
      </div>
    );
  };

  if (!visible) return null;

  // This Div is act as backdrop

  return (
    <div
      onClick={handleClick}
      id="modal-container"
      className="fixed inset-0 dark:bg-white dark:bg-opacity-50 bg-primary bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
    >
      {/* syntex to use custom value in tailwind css h-[40rem]*/}
      {renderChildren()}
      {/* <div className="dark:bg-primary bg-white rounded w-[45rem] h-[40rem] overflow-auto custom-scroll-bar p-2">
        {children}
      </div> */}
    </div>
  );
};

export default ModalContainer;
