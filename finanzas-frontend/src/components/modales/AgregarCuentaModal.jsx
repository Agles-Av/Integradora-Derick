import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import AxiosClient from "../../config/axiosconfig/http-config";
import { AlertContainer, AlertHelper } from "../alertas/AlertHelper";

export default function AgregarCuentaModal({ visible, setVisible }) {
    // Estados del formulario
    const [id, setId] = useState(null);
    const [banco, setBanco] = useState("");
    const [saldo, setSaldo] = useState(null);
    const [isFavorita, setIsFavorita] = useState(false);
    const [errors, setErrors] = useState({});

    // Función para validar y enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        const usr = localStorage.getItem("user");
        const user = JSON.parse(usr);
        const id = user.id;
        setId(id);
        
        const nuevobanco = {
            usuario: id,
            banco: banco,
            saldo: saldo,
            esFavorito: isFavorita,
        };
        console.log("Datos a enviar",nuevobanco);
        
        
        try {
            const resposne = await AxiosClient({
                method: "POST",
                url: "finanzas/cuentas/",
                headers: {
                    "Content-Type": "application/json",
                },
                data: nuevobanco
            })
           AlertHelper.showAlert(
                "Cuenta agregada correctamente",
                "success"
            );
            
        } catch (error) {
            AlertHelper.showAlert(
                error.message,
                "error"
            );
        } finally {
            setBanco("");
            setSaldo(null);
            setIsFavorita(false);
            setErrors({});
            setVisible(false);
        }
    };

    return (
        <Dialog
            header="Agregar Cuenta"
            visible={visible}
            modal
            style={{ width: "50vw" }}
            onHide={() => setVisible(false)}
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
                                className={`w-full ${errors.banco ? "p-invalid" : ""}`}
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
                            <label htmlFor="is_favorita" className="text-primary">Marcar como favorita</label>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-content-end mt-4">
                        <Button label="Cancelar" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
                        <Button label="Guardar" icon="pi pi-check" type="submit" className="p-button-primary ml-2" />
                    </div>
                </form>
            </div>

        </Dialog>
    );
}
