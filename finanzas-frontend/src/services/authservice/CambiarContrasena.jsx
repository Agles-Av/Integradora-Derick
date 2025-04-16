import AxiosClient from "../../config/axiosconfig/http-config";
import { AlertHelper } from "../../components/alertas/AlertHelper";


export const changePassword = async (token, password) => {
    const data = {
        token: token,
        password: password
    }
    try {
        const params = new URLSearchParams();
        params.append('token', token);
        params.append('password', password);

        //usando fetch
        const response = await fetch("http://localhost:8000/finanzas/reset-password/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        })
        if (response.status === 400) {
            AlertHelper.showAlert("Ha ocurrido un problema", 'error');
            return;
        }
        if (response.status === 200) {
            AlertHelper.showAlert("Contraseña cambiada exitosamente", 'success');
            return;
        }
        
        return response;
    } catch (error) {
        AlertHelper.showAlert(
            "Error al cambiar la contraseña",
            'error'
        );
        throw error;  // Propaga el error para manejo adicional
    }
}