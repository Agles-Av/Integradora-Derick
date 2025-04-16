import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import AxiosClient from "../../config/axiosconfig/http-config";
import { AlertHelper } from "../alertas/AlertHelper";

export default function AgregarGastoModal({ visible, setVisible, onGastoAgregado }) {
    // Estados del formulario
    const [titulo, setTitulo] = useState("");
    const [monto, setMonto] = useState(null);
    const [fecha, setFecha] = useState(new Date());
    const [descripcion, setDescripcion] = useState("");
    const [cuentaId, setCuentaId] = useState(null);
    const [cuentas, setCuentas] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);


    const getCuentas = async () => {
        try {
            const response = await AxiosClient({
                method: "GET",
                url: "finanzas/cuentas/mis-cuentas/",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setCuentas(response.cuentas);
        } catch (error) {
            AlertHelper.showAlert(error.message, "error");
        }
    };

    useEffect(() => {
        if (visible) {
            getCuentas();
        }
    }, [visible]);

    // Función para validar y enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validaciones
        const newErrors = {};
        if (!titulo.trim()) newErrors.titulo = "El título es requerido";
        if (!monto || monto <= 0) newErrors.monto = "El monto debe ser mayor a 0";
        if (!cuentaId) newErrors.cuenta = "Debes seleccionar una cuenta";
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        
        const nuevoGasto = {
            usuario: user.id,
            cuenta: cuentaId,
            titulo: titulo,
            monto: monto,
            fecha: fecha.toISOString().split('T')[0], // Formato YYYY-MM-DD
            descripcion: descripcion
        };
        
        setLoading(true);
        try {
            const response = await AxiosClient({
                method: "POST",
                url: "finanzas/gastos/",
                headers: {
                    "Content-Type": "application/json",
                },
                data: nuevoGasto
            });
            
            AlertHelper.showAlert("Gasto agregado correctamente", "success");
            if (onGastoAgregado) onGastoAgregado();
            
            // Resetear formulario
            setTitulo("");
            setMonto(null);
            setFecha(new Date());
            setDescripcion("");
            setCuentaId(null);
            setErrors({});
            setVisible(false);
        } catch (error) {
            AlertHelper.showAlert(error.message || "Error al agregar gasto", "error");
        } finally {
            setLoading(false);
        }
    };

    // Template para mostrar cada opción en el dropdown
    const cuentaTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <span>{option.banco}</span>
                <span className="ml-2" style={{ color: option.saldo < 0 ? 'var(--red-500)' : 'var(--green-500)' }}>
                    (${option.saldo})
                </span>
            </div>
        );
    };

    return (
        <Dialog
            header="Agregar Gasto"
            visible={visible}
            modal
            style={{ width: "50vw" }}
            onHide={() => setVisible(false)}
        >
            <div className="mt-3">
                <form onSubmit={handleSubmit} className="p-fluid">
                    {/* Seleccionar cuenta */}
                    <div className="field mb-4">
                        <FloatLabel>
                            <Dropdown
                                id="cuenta"
                                value={cuentaId}
                                onChange={(e) => setCuentaId(e.value)}
                                options={cuentas}
                                optionLabel="banco"
                                optionValue="id"
                                itemTemplate={cuentaTemplate}
                                placeholder="Selecciona una cuenta"
                                className={`w-full ${errors.cuenta ? "p-invalid" : ""}`}
                                showClear
                            />
                            <label htmlFor="cuenta">Cuenta</label>
                        </FloatLabel>
                        {errors.cuenta && <small className="p-error">{errors.cuenta}</small>}
                    </div>

                    {/* Título */}
                    <div className="field mb-4">
                        <FloatLabel>
                            <InputText
                                id="titulo"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                className={`w-full ${errors.titulo ? "p-invalid" : ""}`}
                            />
                            <label htmlFor="titulo">Título*</label>
                        </FloatLabel>
                        {errors.titulo && <small className="p-error">{errors.titulo}</small>}
                    </div>

                    {/* Monto */}
                    <div className="field mb-4">
                        <FloatLabel>
                            <InputNumber
                                id="monto"
                                mode="currency"
                                currency="MXN"
                                locale="es-MX"
                                value={monto}
                                onValueChange={(e) => setMonto(e.value)}
                                className={`w-full ${errors.monto ? "p-invalid" : ""}`}
                            />
                            <label htmlFor="monto">Monto*</label>
                        </FloatLabel>
                        {errors.monto && <small className="p-error">{errors.monto}</small>}
                    </div>

                    {/* Fecha */}
                    <div className="field mb-4">
                        <FloatLabel>
                            <Calendar
                                id="fecha"
                                value={fecha}
                                onChange={(e) => setFecha(e.value)}
                                dateFormat="dd/mm/yy"
                                showIcon
                                className="w-full"
                            />
                            <label htmlFor="fecha">Fecha</label>
                        </FloatLabel>
                    </div>

                    {/* Descripción */}
                    <div className="field mb-4">
                        <FloatLabel>
                            <InputText
                                id="descripcion"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                className="w-full"
                            />
                            <label htmlFor="descripcion">Descripción (Opcional)</label>
                        </FloatLabel>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-content-end mt-4">
                        <Button 
                            label="Cancelar" 
                            icon="pi pi-times" 
                            onClick={() => setVisible(false)} 
                            className="p-button-text" 
                            disabled={loading}
                        />
                        <Button 
                            label="Guardar" 
                            icon="pi pi-check" 
                            type="submit" 
                            className="p-button-primary ml-2" 
                            loading={loading}
                        />
                    </div>
                </form>
            </div>
        </Dialog>
    );
}