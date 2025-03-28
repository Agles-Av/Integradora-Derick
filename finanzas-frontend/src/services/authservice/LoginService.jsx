import { AlertHelper } from "../../components/alertas/AlertHelper";
import AxiosClient from "../../config/axiosconfig/http-config"

export const login = async (email, password) => {
    const data = {
        email: email,  // Cambiado a 'username' para compatibilidad con Django
        password: password
    }
    try {
        const response = await AxiosClient(
            {
                method: "POST",
                url: "/finanzas/token/",
                data: data
            }
        );

        localStorage.setItem("token", response.access);  // Guarda el token
        localStorage.setItem("refresh", response.refresh);  // Guarda el token de refresco
        localStorage.setItem("user", response.user);

        if (response != null) {
            AlertHelper.showAlert("Inicio de sesión exitoso", 'success');
        }

        return {
            token: response.access,
            user: response.user
        }
    } catch (error) {
        AlertHelper.showAlert(
            error.response?.data?.detail || "Credenciales incorrectas",
            'error'
        );
        throw error;  // Propaga el error para manejo adicional
    }
}