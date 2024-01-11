import React, { Fragment } from "react";
import ModalContainer from "./ModalContainer";
import { ImSpinner3 } from "react-icons/im";
const commonClass = "px-3 py-1 text-white ";
const ConfirmModal = ({
  visible,
  busy,
  onConfirm,
  onCancel,
  title,
  subTitle,
}) => {
  return (
    <ModalContainer visible={visible} ignoreContainer>
      <div className="dark:bg-primary bg-white rounded p-3">
        <h1 className="text-red-400 font-semibold text-lg">{title}</h1>
        <p className="text-secondary dark:text-white text-sm">{subTitle}</p>

        <div className="flex items-center space-x-3 mt-3 rounded">
          {busy ? (
            <p className="flex items-center space-x-2">
              <ImSpinner3 className="animate-spin" />
              <span>Please wait...</span>
            </p>
          ) : (
            <Fragment>
              <button
                type="button"
                onClick={onConfirm}
                className={commonClass + " bg-red-400"}
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={onCancel}
                className={commonClass + " bg-blue-400"}
              >
                Cancel
              </button>
            </Fragment>
          )}
        </div>
      </div>
    </ModalContainer>
  );
};

export default ConfirmModal;
