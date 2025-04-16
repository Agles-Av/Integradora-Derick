import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import AxiosClient from '../../config/axiosconfig/http-config';
import { AlertHelper } from '../../components/alertas/AlertHelper';
import AgregarGastoModal from '../../components/modales/AgregarGastoModal';
import ConfirmDialog from '../../components/confirmacion/ConfirmDialog';
import EditarGastoModal from '../../components/modales/EditarGastoModal';

const Gastos = () => {
  // Estados
  const [idGasto, setIdGasto] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modaleditarVisible, setModalEditarVisible] = useState(false);
  const [gastos, setGastos] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Función para obtener gastos desde la API
  const getGastos = async () => {
    try {
      const response = await AxiosClient({
        method: "GET",
        url: "finanzas/gastos/mis-gastos/",
        headers: {
          "Content-Type": "application/json"
        },
      });
  
      if (response !== null) {
        // Primero obtenemos todas las cuentas del usuario
        const cuentasResponse = await AxiosClient({
          method: "GET",
          url: "finanzas/cuentas/mis-cuentas/",
          headers: {
            "Content-Type": "application/json"
          },
        });
  
        // Creamos un mapa de IDs de cuenta a nombres de banco
        const cuentasMap = {};
        cuentasResponse.cuentas.forEach(cuenta => {
          cuentasMap[cuenta.id] = cuenta.banco;
        });
  
        // Formatear los datos de gastos incluyendo el nombre del banco
        const formattedGastos = response.gastos.map(gasto => ({
          ...gasto,
          monto: parseFloat(gasto.monto),
          fecha: new Date(gasto.fecha),
          nombreBanco: cuentasMap[gasto.cuenta] || 'Sin cuenta' // Agregamos el nombre del banco
        }));
        
        setGastos(formattedGastos);
      }
    } catch (error) {
      AlertHelper.showAlert(error.message, "error");
    }
  };

  // Funciones para CRUD (vacías para que las implementes)
  const eliminarGasto = async (id) => {
    try {
      // Tu implementación aquí
      console.log("Eliminando gasto con ID:", id);
      getGastos();
      AlertHelper.showAlert("Gasto eliminado", "success");
    } catch (error) {
      AlertHelper.showAlert("Error al eliminar gasto", "error");
    }
  };

  const editarGasto = (id) => {
    setIdGasto(id);
    setModalEditarVisible(true);
  };

  const confirmarEliminacion = (id) => {
    setIdGasto(id);
    setConfirm(true);
  };

  // Efectos
  useEffect(() => {
    getGastos();
  }, [modaleditarVisible, modalVisible]);

  // Filtro global
  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  // Header con buscador
  const renderHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center bg-primary">
        <IconField iconPosition="left" className="w-6">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Buscar..."
          />
        </IconField>
      </div>
    );
  };

  // Formateo de monto
  const montoBodyTemplate = (rowData) => {
    return `$ ${rowData.monto.toLocaleString()}`;
  };

  // Formateo de fecha
  const fechaBodyTemplate = (rowData) => {
    return rowData.fecha.toLocaleDateString('es-MX');
  };
  // nombre de cuenta 
// Nombre de la cuenta bancaria
const accountName = (rowData) => {
  return rowData.nombreBanco;
};

  // Columna de acciones
  const accionesBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button 
          icon="pi pi-pencil" 
          onClick={() => editarGasto(rowData.id)} 
          className="p-button-rounded p-button-text" 
          tooltip="Editar"
          tooltipOptions={{ position: 'top' }}
        />
        <Button 
          icon="pi pi-trash" 
          onClick={() => confirmarEliminacion(rowData.id)} 
          className="p-button-rounded p-button-text p-button-danger" 
          tooltip="Eliminar"
          tooltipOptions={{ position: 'top' }}
        />
      </div>
    );
  };

  // Plantilla del paginador
  const paginatorTemplate = {
    layout: 'RowsPerPageDropdown CurrentPageReport',
    'RowsPerPageDropdown': (options) => {
      const dropdownOptions = [
        { label: '5', value: 5 },
        { label: '10', value: 10 },
        { label: '20', value: 20 },
        { label: '100', value: 100 },
      ];

      return ( 
        <div className="flex align-items-center gap-2">
          <span className='ml-4'>Filas por página</span>
          <Dropdown
            value={options.value}
            options={dropdownOptions}
            onChange={options.onChange}
            appendTo="self"
          />
        </div>
      );
    },
    'CurrentPageReport': (options) => {
      return (
        <span>
          {options.first} - {options.last} de {options.totalRecords}
        </span>
      );
    }
  };

  return (
    <div className='ml-2 mr-2 mt-2'>
      <div className='card color-primary'>
        <Card title={"Gastos"} />
      </div>
      
      <div className='m-4 flex justify-content-end'>
        <Button 
          label="Agregar" 
          onClick={() => setModalVisible(true)} 
          icon="pi pi-plus" 
        />
      </div>
      
      <div className="card m-4">
        <DataTable
          value={gastos}
          header={renderHeader()}
          paginator
          rows={rowsPerPage}
          rowsPerPageOptions={[5, 10, 20, 100]}
          paginatorTemplate={paginatorTemplate}
          onPage={(e) => setRowsPerPage(e.rows)}
          globalFilter={globalFilterValue.trim()}
          emptyMessage="No se encontraron gastos"
          className="p-datatable-sm"
        >
          <Column field="titulo" header="Título" sortable />
          <Column field="monto" header="Monto" body={montoBodyTemplate} sortable />
          <Column field="fecha" header="Fecha" body={fechaBodyTemplate} sortable />
          <Column field="descripcion" header="Descripción" sortable />
          <Column field='cuenta' header="cuenta" body={accountName} sortable />
          <Column header="Acciones" body={accionesBodyTemplate} style={{ width: '120px' }} />
        </DataTable>
      </div>

      {/* Modales y diálogos */}
      <AgregarGastoModal 
        visible={modalVisible} 
        setVisible={setModalVisible} 
        onGastoAgregado={getGastos}
      />
      
      <EditarGastoModal 
        visible={modaleditarVisible} 
        setVisible={setModalEditarVisible} 
        gastoId={idGasto}
        onGastoEditado={getGastos}
      />
      
      <ConfirmDialog
        visible={confirm}
        onHide={() => setConfirm(false)}
        onConfirm={() => {
          eliminarGasto(idGasto);
          setConfirm(false);
        }}
        title="Eliminar gasto"
        message="¿Está seguro de que desea eliminar este gasto?"
      />
    </div>
  );
}

export default Gastos;