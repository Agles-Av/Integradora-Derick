import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import AxiosClient from "../../config/axiosconfig/http-config";
import { AlertHelper } from "../alertas/AlertHelper";

export default function EditarCuentaModal({ visible, setVisible, cuenta, recarga }) {
    const [banco, setBanco] = useState("");
    const [saldo, setSaldo] = useState(null);
    const [isFavorita, setIsFavorita] = useState(false);
    const [reload, setReload] = useState(false);
    

    const getCuenta = async () =>{
        setReload(true);
        if(cuenta!== null)
        try {
            const response = await AxiosClient({
                method: "GET",
                url: `finanzas/cuentas/${cuenta}/`,
                headers: {
                    "Content-Type": "application/json",
                },
            })
            console.log(response);
            setBanco(response.banco || "");
            setSaldo(response.saldo || 0);
            setIsFavorita(response.is_favorita || false);
        
        } catch (error) {
            AlertHelper.showAlert(
                error.message,
                "error"
            );
        }
    }

    useEffect(() => {
        if (cuenta) {
            setBanco(cuenta.banco || "");
            setSaldo(cuenta.saldo || 0);
            setIsFavorita(cuenta.is_favorita || false);
        }
        getCuenta();

    }, [reload,cuenta]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        const updatedCuenta = {
            banco,
            saldo,
            is_favorita: isFavorita,
        };

        try {
            await AxiosClient({
                method: "PUT",
                url: `finanzas/cuentas/${cuenta}/`,
                headers: {
                    "Content-Type": "application/json",
                },
                data: updatedCuenta,
            });
            
            AlertHelper.showAlert("Cuenta actualizada correctamente", "success");
            setVisible(false);
            setReload(true);
            recarga;
        } catch (error) {
            AlertHelper.showAlert(error.message, "error");
        }
    };

    return (
        <Dialog
            header="Editar Cuenta"
            visible={visible}
            modal
            style={{ width: "50vw" }}
            onHide={() => setVisible(false)}
        >
            <div className="mt-3">
                <form onSubmit={handleUpdate} className="p-fluid">
                    <div className="field">
                        <FloatLabel>
                            <InputText
                                id="banco"
                                value={banco}
                                onChange={(e) => setBanco(e.target.value)}
                                className="w-full"
                            />
                            <label htmlFor="banco">Banco</label>
                        </FloatLabel>
                    </div>

                    <div className="field">
                        <FloatLabel>
                            <InputNumber
                                id="saldo"
                                mode="currency"
                                currency="MXN"
                                locale="es-MX"
                                value={saldo}
                                onValueChange={(e) => setSaldo(e.value)}
                                className="w-full"
                            />
                            <label htmlFor="saldo">Saldo</label>
                        </FloatLabel>
                    </div>

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

                    <div className="flex justify-content-end mt-4">
                        <Button label="Cancelar" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
                        <Button label="Guardar" icon="pi pi-check" type="submit" className="p-button-primary ml-2" />
                    </div>
                </form>
            </div>
        </Dialog>
    );
}
