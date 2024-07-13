/*
    apiFunctions.js makes the connection between React and Django REST with Authentification
*/

import axios from 'axios'
import { sweetAlert, sweetToast } from '../components/Main/Alert'

const createAPIInstance = (baseURL) => {
    const apiInstance = axios.create({
        baseURL: baseURL,
    });

    apiInstance.interceptors.request.use(async (config) => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    apiInstance.interceptors.response.use((response) => {
        return response;
    }, async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            try {
                const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                    refresh: refreshToken,
                });
                localStorage.setItem('access_token', response.data.access);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                return apiInstance(originalRequest);
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                // Go to Login page
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    });
    return apiInstance;
};

const userAPI = createAPIInstance('http://localhost:8000/user/');
const customerAPI = createAPIInstance('http://localhost:8000/customer/');
const personalAPI = createAPIInstance('http://localhost:8000/personal/');
const notesAPI = createAPIInstance('http://localhost:8000/notes/');
const plotAPI = createAPIInstance('http://localhost:8000/plot/');
const salesAPI = createAPIInstance('http://localhost:8000/sale/');
const installmentAPI = createAPIInstance('http://localhost:8000/installment/');
const commissionAPI = createAPIInstance('http://localhost:8000/commission/');
const penaltyAPI = createAPIInstance('http://localhost:8000/penalty/');
const penaltyHistoryAPI = createAPIInstance('http://localhost:8000/penalty_history/');
const penaltyPaymentAPI = createAPIInstance('http://localhost:8000/penalty_payments/');
const pdfInfoAPI = createAPIInstance('http://localhost:8000/pdfinfo/');

// User
export const getUser = (email) => {
    return userAPI.get(`?email=${email}`);
}

export const patchUser = (id, data) => {
    return userAPI.patch(`/${id}/`, data);
}

// Customer
export const getAllCustomers = () => {
    return customerAPI.get('/');
}

export const getSpecificCustomer = (id) => {
    return customerAPI.get(`/${id}`);
}

export const patchCustomer = (id, data) => {
    return customerAPI.patch(`/${id}/`, data);
}

export const postCustomer = (data) => {
    return customerAPI.post('/', data);
}

// Personal
export const getAllPersonal = () => {
    return personalAPI.get('/');
}

export const getSpecificPersonal = (id) => {
    return personalAPI.get(`/${id}`);
}

export const patchPersonal = (id, data) => {
    return personalAPI.patch(`/${id}/`, data);
}

export const postPersonal = (data) => {
    return personalAPI.post('/', data);
}

// Notes
export const postNote = (data) => {
    return notesAPI.post('/', data);
}

export const putNote = (id, data) => {
    return notesAPI.put(`/${id}/`, data);
}

export const getNotes = (model, id) => {
    return notesAPI.get(`?content_type__app_label=api&content_type__model=${model}&object_id=${id}`);
}

export const getNote = (model, id, noteID) => {
    return notesAPI.get(`?content_type__app_label=api&content_type__model=${model}&object_id=${id}&id=${noteID}`);
}

export const deleteNote = (id) => {
    return notesAPI.delete(`/${id}/`);
}

// Plot
export const getAllPlots = () => {
    return plotAPI.get('/');
}

export const getSpecificPlot = (id) => {
    return plotAPI.get(`/${id}`);
}

export const patchPlot = (id, data) => {
    return plotAPI.patch(`/${id}/`, data);
}

export const postPlot = (data) => {
    return plotAPI.post('/', data);
}

// Sales
export const getAllSales = () => {
    return salesAPI.get('/');
}

export const getSpecificSale = (id) => {
    return salesAPI.get(`/${id}`);
}

export const getSaleByUser = (id_customer, id_personal) => {
    return salesAPI.get(`?id_customer=${id_customer}&id_personal=${id_personal}`);
}

export const patchSale = (id, data) => {
    return salesAPI.patch(`/${id}/`, data);
}

export const postSale = (data) => {
    return salesAPI.post('/', data);
}

// Installment
export const getAllInstallmentByCustomer = (id_customer, id_sale) => {
    return installmentAPI.get(`?id_sale__id_customer=${id_customer}&id_sale=${id_sale}`);
}

export const postInstallment = (data) => {
    return installmentAPI.post('/', data);
}

// Commission
export const postCommission = (data) => {
    return commissionAPI.post('/', data);
}

export const getCommissionByUser = (id_personal) => {
    return commissionAPI.get(`?id_personal=${id_personal}`);
}

// Penalty
export const getPenalty = (id) => {
    return penaltyAPI.get(`?id_sale=${id}`);
}

export const postPenalty = (data) => {
    return penaltyAPI.post('/', data);
}

export const patchPenalty = (id, data) => {
    return penaltyAPI.patch(`/${id}/`, data);
}

// Penalty History
export const postPenaltyHistory = (data) => {
    return penaltyHistoryAPI.post('/', data);
}

export const getPenaltyHistory = (id) => {
    return penaltyHistoryAPI.get(`?id_penalty=${id}`);
}

export const deletePenaltyHistory = (id) => {
    return penaltyHistoryAPI.delete(`/${id}/`);
}

// Penalty Payments
export const postPenaltyPayment = (data) => {
    return penaltyPaymentAPI.post('/', data);
}

export const getPenaltyPayment = (id) => {
    return penaltyPaymentAPI.get(`?id_penalty=${id}`);
}

// PDF Information
export const getPDFInformation = (id) => {
    return pdfInfoAPI.get(`/${id}/`);
}

export const patchPDFInformation = (id, data) => {
    return pdfInfoAPI.patch(`/${id}/`, data);
}

// Export Database
export const downloadDatabase = async () => {
    try {
        await sweetAlert('¿Desea exportar la base de datos?', '', 'question', 'success', '', '');
        const response = await axios.get('http://localhost:8000/export-database/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'db.sqlite3';
        document.body.appendChild(a);
        a.click();
        a.remove();
        const toast = response.status === 200;
        sweetToast(toast ? 'success' : 'error', toast ? 'La base de datos ha sido descargada' : 'Error al exportar la base de datos');
    } catch (error) {
        console.error('Hubo un problema con la operación:', error);
    }
};

// Import Database
export const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('database', file);
    try {
        const response = await axios.post('http://localhost:8000/import-database/', formData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        const result = response.data;
        sweetToast(result.status, result.message);
    } catch (error) {
        console.error('There was a problem with the axios operation:', error);
    }
};