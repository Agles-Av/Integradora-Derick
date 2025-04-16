import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import AxiosClient from "../../config/axiosconfig/http-config";
import { AlertHelper } from "../alertas/AlertHelper";

export default function AgregarCuentaModal({ visible, setVisible }) {
    const [banco, setBanco] = useState("");
    const [saldo, setSaldo] = useState(null);
    const [isFavorita, setIsFavorita] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({
        banco: false,
        saldo: false,
    });

    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const newErrors = {};

        if (touched.banco) {
            if (!banco.trim()) {
                newErrors.banco = "El banco es requerido";
            } else if (!/^[a-zA-Z0-9()." ]+$/.test(banco)) {
                newErrors.banco = "Solo se permiten letras, números y ().\"";
            }
        }

        if (touched.saldo) {
            if (saldo == null || saldo === "") {
                newErrors.saldo = "El saldo es requerido";
            } else if (saldo <= 0) {
                newErrors.saldo = "El saldo debe ser mayor a 0";
            }
        }

        setErrors(newErrors);
        setIsFormValid(
            banco.trim() &&
            /^[a-zA-Z0-9()." ]+$/.test(banco) &&
            saldo > 0
        );
    }, [banco, saldo, touched]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const usr = localStorage.getItem("user");
        const user = JSON.parse(usr);
        const id = user.id;

        const nuevaCuenta = {
            usuario: id,
            banco,
            saldo,
            esFavorito: isFavorita,
        };

        try {
            await AxiosClient.post("finanzas/cuentas/", nuevaCuenta, {
                headers: { "Content-Type": "application/json" },
            });

            AlertHelper.showAlert("Cuenta agregada correctamente", "success");
        } catch (error) {
            AlertHelper.showAlert(error.message, "error");
        } finally {
            resetForm();
        }
    };

    const resetForm = () => {
        setBanco("");
        setSaldo(null);
        setIsFavorita(false);
        setTouched({ banco: false, saldo: false });
        setErrors({});
        setIsFormValid(false);
        setVisible(false);
    };

    return (
        <Dialog
            header="Agregar Cuenta"
            visible={visible}
            modal
            style={{ width: "50vw" }}
            onHide={resetForm}
        >
            <div className="mt-3">
                <form onSubmit={handleSubmit} className="p-fluid">
                    {/* Banco */}
                    <div className="field">
                        <FloatLabel>
                            <InputText
                                id="banco"
                                value={banco}
                                onChange={(e) => setBanco(e.target.value)}
                                onBlur={() =>
                                    setTouched((prev) => ({ ...prev, banco: true }))
                                }
                                className={`w-full ${errors.banco ? "p-invalid" : ""}`}
                                maxLength={50}
                            />
                            <label htmlFor="banco">Banco</label>
                        </FloatLabel>
                        {errors.banco && <small className="p-error">{errors.banco}</small>}
                    </div>

                    {/* Saldo */}
                    <div className="field">
                        <FloatLabel>
                            <InputNumber
                                id="saldo"
                                mode="currency"
                                currency="MXN"
                                locale="es-MX"
                                value={saldo}
                                onValueChange={(e) => setSaldo(e.value)}
                                onBlur={() =>
                                    setTouched((prev) => ({ ...prev, saldo: true }))
                                }
                                className={`w-full ${errors.saldo ? "p-invalid" : ""}`}
                            />
                            <label htmlFor="saldo">Saldo</label>
                        </FloatLabel>
                        {errors.saldo && <small className="p-error">{errors.saldo}</small>}
                    </div>

                    {/* Favorita */}
                    <div className="field">
                        <div className="flex align-items-center gap-2">
                            <Checkbox
                                id="is_favorita"
                                checked={isFavorita}
                                onChange={(e) => setIsFavorita(e.checked)}
                            />
                            <label htmlFor="is_favorita" className="text-primary">
                                Marcar como favorita
                            </label>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-content-end mt-4">
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            type="button"
                            onClick={resetForm}
                            className="p-button-text"
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
