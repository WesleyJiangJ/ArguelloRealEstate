/*
    apiFunctions.js makes the connection between React and Django REST
*/

import axios from 'axios'

const customerAPI = axios.create({
    baseURL: 'http://localhost:8000/customer/'
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