/*
    apiFunctions.js makes the connection between React and Django REST
*/

import axios from 'axios'

const customerAPI = axios.create({
    baseURL: 'http://localhost:8000/customer/'
})

const personalAPI = axios.create({
    baseURL: 'http://localhost:8000/personal/'
})

const notesAPI = axios.create({
    baseURL: 'http://localhost:8000/notes/'
})

const plotAPI = axios.create({
    baseURL: 'http://localhost:8000/plot/'
})

const salesAPI = axios.create({
    baseURL: 'http://localhost:8000/sale/'
})

const installmentAPI = axios.create({
    baseURL: 'http://localhost:8000/installment/'
})

// Customer
export const getAllCustomers = () => {
    return customerAPI.get('/');
}

export const getSpecificCustomer = (id) => {
    return customerAPI.get(`/${id}`);
}

export const putCustomer = (id, data) => {
    return customerAPI.put(`/${id}/`, data);
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

export const putPersonal = (id, data) => {
    return personalAPI.put(`/${id}/`, data);
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

export const putPlot = (id, data) => {
    return plotAPI.put(`/${id}/`, data);
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