import axios from "axios";
import {API_BASE_URL} from "../config/apiConfig";

export const sendNotification = async (email, message) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/notifications/enviar`, null, {
            params: { email, message },
        });
        return response.data;
    } catch (error) {
        console.error("Error al enviar la notificación:", error);
        throw error.response ? error.response.data : "Error desconocido";
    }
};