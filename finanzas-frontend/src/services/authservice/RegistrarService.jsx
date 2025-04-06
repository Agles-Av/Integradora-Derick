import AxiosClient from "../../config/axiosconfig/http-config";
import { AlertHelper } from "../../components/alertas/AlertHelper";

export const registrar = async (name, lastName,age ,email, password) => {
    const data = {
        name: name,
        surname: lastName,
        age: age,
        email: email,
        password: password
    }
    try {
        const response = await AxiosClient(
            {
                method: "POST",
                url: "/finanzas/usuarios/",
                data: data
            }
        );

        if (response != null) {
            AlertHelper.showAlert("Registro exitoso", 'success');
        }

        return {
            token: response.access,
            user: response.user
        }
    } catch (error) {
        AlertHelper.showAlert(
            error.response?.data?.detail || "Error al registrar",
            'error'
        );
        throw error;  // Propaga el error para manejo adicional
    }
}