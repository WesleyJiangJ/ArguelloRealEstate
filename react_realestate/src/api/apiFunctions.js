/*
    apiFunctions.js makes the connection between React and Django REST
*/

import axios from 'axios'

const customerAPI = axios.create({
    baseURL: 'http://localhost:8000/customer/'
})

const notesAPI = axios.create({
    baseURL: 'http://localhost:8000/notes/'
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

// Notes
export const postNote = (data) => {
    return notesAPI.post('/', data);
}

export const getNotes = (id) => {
    return notesAPI.get(`?content_type__app_label=api&content_type__model=customer&object_id=${id}`);
}

export const getNote = (id, noteID) => {
    return notesAPI.get(`?content_type__app_label=api&content_type__model=customer&object_id=${id}&id=${noteID}`);
}

export const deleteNote = (id) => {
    return notesAPI.delete(`/${id}/`);
}