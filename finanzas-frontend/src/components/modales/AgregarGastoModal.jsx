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
    const [titulo, setTitulo] = useState("");
    const [monto, setMonto] = useState(null);
    const [fecha, setFecha] = useState(new Date());
    const [descripcion, setDescripcion] = useState("");
    const [cuentaId, setCuentaId] = useState(null);
    const [cuentas, setCuentas] = useState([]);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({ titulo: false, monto: false, cuenta: false });
    const [isFormValid, setIsFormValid] = useState(false);

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
            setTouched({ titulo: false, monto: false, cuenta: false });
        }
    }, [visible]);

    useEffect(() => {
        const newErrors = {};

        if (touched.titulo) {
            if (!titulo.trim()) {
                newErrors.titulo = "El título es requerido";
            } else if (!/^[a-zA-Z0-9()." ]+$/.test(titulo)) {
                newErrors.titulo = "Solo se permiten letras, números y ().\"";
            }
        }

        if (touched.monto) {
            if (monto == null || monto === "") {
                newErrors.monto = "El monto es requerido";
            } else if (monto <= 0) {
                newErrors.monto = "El monto debe ser mayor a 0";
            }
        }

        if (touched.cuenta && !cuentaId) {
            newErrors.cuenta = "Debes seleccionar una cuenta";
        }

        setErrors(newErrors);
        setIsFormValid(
            titulo.trim() &&
            /^[a-zA-Z0-9()." ]+$/.test(titulo) &&
            monto > 0 &&
            cuentaId
        );
    }, [titulo, monto, cuentaId, touched]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem("user"));

        const nuevoGasto = {
            usuario: user.id,
            cuenta: cuentaId,
            titulo,
            monto,
            fecha: fecha.toISOString().split('T')[0],
            descripcion,
        };

        try {
            await AxiosClient({
                method: "POST",
                url: "finanzas/gastos/",
                headers: {
                    "Content-Type": "application/json",
                },
                data: nuevoGasto,
            });

            AlertHelper.showAlert("Gasto agregado correctamente", "success");
            onGastoAgregado?.();

            // Reset form
            setTitulo("");
            setMonto(null);
            setFecha(new Date());
            setDescripcion("");
            setCuentaId(null);
            setErrors({});
            setVisible(false);
        } catch (error) {
            AlertHelper.showAlert(error.message || "Error al agregar gasto", "error");
        }
    };

    const cuentaTemplate = (option) => (
        <div className="flex align-items-center">
            <span>{option.banco}</span>
            <span className="ml-2" style={{ color: option.saldo < 0 ? 'var(--red-500)' : 'var(--green-500)' }}>
                (${option.saldo})
            </span>
        </div>
    );

    const cancelHandler = () => {
        setTitulo("");
        setMonto(null);
        setFecha(new Date());
        setDescripcion("");
        setCuentaId(null);
        setErrors({});
        setVisible(false);
    }

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
                    {/* Cuenta */}
                    <div className="field mb-4">
                        <FloatLabel>
                            <Dropdown
                                id="cuenta"
                                value={cuentaId}
                                onChange={(e) => setCuentaId(e.value)}
                                onBlur={() => setTouched((prev) => ({ ...prev, cuenta: true }))}
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
                                onBlur={() => setTouched((prev) => ({ ...prev, titulo: true }))}
                                className={`w-full ${errors.titulo ? "p-invalid" : ""}`}
                                maxLength={50}
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
                                onBlur={() => setTouched((prev) => ({ ...prev, monto: true }))}
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
                            onClick={() => cancelHandler()}
                            className="p-button-text"
                            type="button"
                        />
                        <Button
                            label="Guardar"
                            icon="pi pi-check"
                            type="submit"
                            className="p-button-primary ml-2"
                            disabled={!isFormValid}
                        />
                    </div>
                </form>
            </div>
        </Dialog>
    );
}
