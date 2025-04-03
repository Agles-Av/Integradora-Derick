import { AlertHelper } from "../../components/alertas/AlertHelper";
import AxiosClient from "../../config/axiosconfig/http-config";

export const getCuentas = async () => {
    try {
        const response = await AxiosClient({
            method: "GET",
            url: "finanzas/cuentas/mis-cuentas/",
            headers: {
                "Content-Type": "application/json"
            },
        })    
        return response;
    } catch (error) {
        AlertHelper.showAlert("Error al obtener cuentas", "error");
    }
}