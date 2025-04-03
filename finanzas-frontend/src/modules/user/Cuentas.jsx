import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { Rating } from 'primereact/rating';
import AxiosClient from '../../config/axiosconfig/http-config';
import { AlertHelper } from '../../components/alertas/AlertHelper';
import AgregarCuentaModal from '../../components/modales/AgregarCuentaModal';
import { set } from 'react-hook-form';
import ConfirmDialog from '../../components/confirmacion/ConfirmDialog';
import EditarCuentaModal from '../../components/modales/EditarCuentaModal';

const Cuentas = () => {
  // Estado para almacenar las cuentas obtenidas de la API
  const [idCuenta, setIdCuenta] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modaleditarVisible, setModalEditarVisible] = useState(false);
  
  const [accounts, setAccounts] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const eliminarbanco = async (id) => {
    try {
      const response = await AxiosClient({
        method: "DELETE",
        url: `finanzas/cuentas/${id}/`,
        headers: {
          "Content-Type": "application/json"
        },
      });
      console.log(response);
      getCuentas();
      AlertHelper.showAlert("Cuenta eliminada", "success");

    } catch (error) {

    }
  }
  const getCuentas = async () => {
    try {
      const response = await AxiosClient({
        method: "GET",
        url: "finanzas/cuentas/mis-cuentas/",
        headers: {
          "Content-Type": "application/json"
        },
      });
      console.log(response);

      if (response !== null) {
        // Aseguramos que los datos tengan el formato correcto
        const formattedAccounts = response.cuentas.map(account => ({
          ...account,
          saldo: parseFloat(account.saldo), // Convertir saldo a número
          ultimoDeposito: new Date(account.fecha_ultimo_deposito), // Convertir fecha a objeto Date
          favorito: account.esFavorito ? 1 : 0 // Ajustar favorito para Rating
        }));

        setAccounts(formattedAccounts);
      }
    } catch (error) {
      AlertHelper.showAlert(error.message, "error");
    }
  };

  useEffect(() => {
    getCuentas();
  }, [modaleditarVisible]);
  useEffect(() => {
    getCuentas();
  }, [modalVisible]);

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  // Función para manejar el cambio de favorito
  const onFavoritoChange = (rowData, value) => {
    const updatedAccounts = accounts.map(account =>
      account.id === rowData.id ? { ...account, favorito: value } : account
    );
    setAccounts(updatedAccounts);
  };

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

  // Formateo de saldo
  const saldoBodyTemplate = (rowData) => {
    return `$ ${rowData.saldo.toLocaleString()}`;
  };

  // Formateo de fecha
  const fechaBodyTemplate = (rowData) => {
    return rowData.ultimoDeposito.toLocaleDateString('es-MX');
  };

  const mamadas = (id) => {
    setIdCuenta(id);
    setConfirm(true);
  }
  const editar = (id) => {
    setIdCuenta(id);
    setModalEditarVisible(true);
  }

  // Acciones de edición y eliminación
  const accionesBodyTemplate = (rowData) => {

    return (
      <div className="flex gap-2">
        <Button icon="pi pi-pencil" onClick={() => editar(rowData.id)} className="p-button-rounded p-button-text" />
        <Button icon="pi pi-trash" onClick={() => mamadas(rowData.id)} className="p-button-rounded p-button-text p-button-danger" />
      </div>
    );
  };

  // Template para la columna de favoritos
  const favoritoBodyTemplate = (rowData) => {
    return (
      <Rating
        value={rowData.favorito}
        onChange={(e) => onFavoritoChange(rowData, e.value)}
        stars={1}
        cancel={false}
        className="favorito-rating"
      />
    );
  };

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
        <Card title={"Cuentas"} />
      </div>
      <div className='m-4 flex justify-content-end'>
        <Button label="Agregar" onClick={() => setModalVisible(true)} icon="pi pi-plus" />
      </div>
      <div className="card m-4">
        <DataTable
          value={accounts}
          header={renderHeader()}
          paginator
          rows={rowsPerPage}
          rowsPerPageOptions={[5, 10, 20, 100]}
          paginatorTemplate={paginatorTemplate}
          onPage={(e) => setRowsPerPage(e.rows)}
          globalFilter={globalFilterValue.trim()}
          emptyMessage="No se encontraron cuentas"
          className="p-datatable-sm"
        >
          <Column header="Favorito" body={favoritoBodyTemplate} style={{ width: '100px' }} />
          <Column field="banco" header="Banco" sortable />
          <Column field="saldo" header="Saldo" body={saldoBodyTemplate} sortable />
          <Column field="ultimoDeposito" header="Último Depósito" body={fechaBodyTemplate} sortable />

          <Column header="Acciones" body={accionesBodyTemplate} />
        </DataTable>
      </div>
      <AgregarCuentaModal visible={modalVisible} setVisible={setModalVisible} />
      <EditarCuentaModal visible={modaleditarVisible} setVisible={setModalEditarVisible} cuenta={idCuenta} recarga={getCuentas} />
      <ConfirmDialog
        visible={confirm}
        onHide={() => setConfirm(false)}
        onConfirm={() => {
          eliminarbanco(idCuenta);
          setConfirm(false);
        }}
        title="Eliminar cuenta"
        message="¿Está seguro de que desea eliminar esta cuenta?"
      />
    </div>
  );
}

export default Cuentas;
