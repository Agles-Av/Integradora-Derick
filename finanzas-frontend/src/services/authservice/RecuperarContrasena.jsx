import AxiosClient from "../../config/axiosconfig/http-config";
import { AlertHelper } from "../../components/alertas/AlertHelper";

export const sendEmail = async (email) => {
    
    try {
        const params = new URLSearchParams();
        params.append('email', email);

        //usando fetch
        const response = await fetch("http://localhost:8000/finanzas/send-reset-email/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        })
        
        
      if(response.status === 200)
        AlertHelper.showAlert("Email enviado exitosamente", "success");

      if (response.status === 404) 
        AlertHelper.showAlert(error.response?.data?.message || "Usuario no encontrado", "error");
        return response.data;
    } catch (error) {
        AlertHelper.showAlert(error.response?.data?.message || "Usuario no encontrado/Error al enviar", "error");
        throw error;
    }
};