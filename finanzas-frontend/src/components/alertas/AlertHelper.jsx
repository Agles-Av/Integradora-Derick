import React from 'react';
import ReactDOM from 'react-dom';
import { Toast } from 'primereact/toast';

let toastRef = null;

export const AlertHelper = {
  initialize: (ref) => {
    toastRef = ref;
  },
  showAlert: (message, type = 'info') => {
    if (!toastRef) {
      console.error('Toast reference not initialized. Call AlertHelper.initialize first.');
      return;
    }

    const severityMap = {
      success: 'success',
      info: 'info',
      warning: 'warn',
      error: 'error'
    };

    toastRef.current.show({
      severity: severityMap[type] || 'info',
      summary: message,
      life: 3000
    });
  }
};

// Componente contenedor para las alertas
export const AlertContainer = () => {
  const toast = React.useRef(null);
  
  React.useEffect(() => {
    AlertHelper.initialize(toast);
  }, []);

  return <Toast ref={toast} position="top-right" />;
};