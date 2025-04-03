import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const ConfirmDialog = ({
  visible,
  onHide,
  onConfirm,
  title = "¿Estás seguro?",
  message = "¿Quieres continuar con esta acción?",
  confirmText = "Continuar",
  cancelText = "Cancelar",
  type = "info",
  showCancel = true
}) => {
  const getIcon = () => {
    switch (type) {
      case "success": return "pi pi-check-circle";
      case "error": return "pi pi-times-circle";
      case "warning": return "pi pi-exclamation-triangle";
      case "info":
      default: return "pi pi-info-circle";
    }
  };

  const getSeverity = () => {
    switch (type) {
      case "success": return "success";
      case "error": return "danger";
      case "warning": return "warning";
      case "info":
      default: return "info";
    }
  };

  const footer = (
    <div className="flex justify-content-end gap-2">

      <Button
        label={confirmText}
        onClick={onConfirm}
        severity={getSeverity()}
        autoFocus
      />
      {showCancel && (
        <Button
          label={cancelText}
          onClick={onHide}
          className="p-button-text"
        />
      )}
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={title}
      footer={footer}
      className="w-30rem"
      dismissableMask
    >
      <div className="flex align-items-center gap-3">
        <i className={`${getIcon()} text-4xl text-${getSeverity()}`} />
        <span className="text-lg">{message}</span>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;