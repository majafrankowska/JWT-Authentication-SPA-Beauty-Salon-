import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const apiService = axios.create({
    baseURL: API_BASE_URL
});

apiService.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log("Using token:", token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

apiService.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 403 && error.response.data.message === "Token expired, please login again") {
            alert('Twoja sesja wygasła. Zaraz zostaniesz przekierowany do okna logowania.');
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            setTimeout(() => {
                window.location.href = '/login';
            }, 100);
        }
        return Promise.reject(error);
    }
);

export default {
    getAllUsers: async () => {
        try {
            const response = await apiService.get('/users');
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    getUserById: async (id) => {
        try {
            const response = await apiService.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching user with ID ${id}:`, error);
            throw error;
        }
    },

    updateUser: async (id, data) => {
        try {
            const response = await apiService.put(`/users/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating user with ID ${id}:`, error);
            throw error;
        }
    },

    deleteUser: async (id) => {
        try {
            await apiService.delete(`/users/${id}`);
        } catch (error) {
            console.error(`Error deleting user with ID ${id}:`, error);
            throw error;
        }
    },

    getAllClients: async () => {
        try {
            const response = await apiService.get('/clients');
            return response.data;
        } catch (error) {
            console.error('Error fetching clients:', error);
            throw error;
        }
    },

        // getClientByUserId: async (userId) => {
        //     try {
        //         const response = await apiService.get(`/clients/user/${userId}`);
        //         return response.data;
        //     } catch (error) {
        //         console.error(`Error fetching client by user ID ${userId}:`, error);
        //         throw error;
        //     }
        // },

    getClientByUserId: async (userId) => {
        try {
            const response = await apiService.get(`/clients/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching client by user ID ${userId}:`, error);
            throw error;
        }
    },
    


    getClientById: async (id) => {
        try {
            const response = await apiService.get(`/clients/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching client with ID ${id}:`, error);
            throw error;
        }
    },

    updateClient: async (id, data) => {
        try {
            const response = await apiService.put(`/clients/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating client with ID ${id}:`, error);
            throw error;
        }
    },

    deleteClient: async (id) => {
        try {
            await apiService.delete(`/clients/${id}`);
        } catch (error) {
            console.error(`Error deleting client with ID ${id}:`, error);
            throw error;
        }
    },

    getAllEmployees: async () => {
        try {
            const response = await apiService.get('/employees');
            return response.data;
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    },

    getEmployeeById: async (id) => {
        try {
            const response = await apiService.get(`/employees/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching employee with ID ${id}:`, error);
            throw error;
        }
    },

    updateEmployee: async (id, data) => {
        try {
            const response = await apiService.put(`/employees/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating employee with ID ${id}:`, error);
            throw error;
        }
    },

    deleteEmployee: async (id) => {
        try {
            await apiService.delete(`/employees/${id}`);
        } catch (error) {
            console.error(`Error deleting employee with ID ${id}:`, error);
            throw error;
        }
    },

    getAllServices: async () => {
        try {
            const response = await apiService.get('/services');
            return response.data;
        } catch (error) {
            console.error('Error fetching services:', error);
            throw error;
        }
    },

    getServiceById: async (id) => {
        try {
            const response = await apiService.get(`/services/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching service with ID ${id}:`, error);
            throw error;
        }
    },

    createService: async (data) => {
        try {
            const response = await apiService.post('/services', data);
            return response.data;
        } catch (error) {
            console.error('Error creating service:', error);
            throw error;
        }
    },

    updateService: async (id, data) => {
        try {
            const response = await apiService.put(`/services/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating service with ID ${id}:`, error);
            throw error;
        }
    },

    deleteService: async (id) => {
        try {
            await apiService.delete(`/services/${id}`);
        } catch (error) {
            console.error(`Error deleting service with ID ${id}:`, error);
            throw error;
        }
    },

    getAllAppointments: async () => {
        try {
            const response = await apiService.get('/appointments');
            return response.data;
        } catch (error) {
            console.error('Error fetching appointments:', error);
            throw error;
        }
    },

    getAppointmentById: async (id) => {
        try {
            const response = await apiService.get(`/appointments/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching appointment with ID ${id}:`, error);
            throw error;
        }
    },

    createAppointment: async (data) => {
        try {
            const response = await apiService.post('/appointments', data);
            return response.data;
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    },

    updateAppointment: async (id, data) => {
        try {
            const response = await apiService.put(`/appointments/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating appointment with ID ${id}:`, error);
            throw error;
        }
    },

    deleteAppointment: async (id) => {
        try {
            await apiService.delete(`/appointments/${id}`);
        } catch (error) {
            console.error(`Error deleting appointment with ID ${id}:`, error);
            throw error;
        }
    },
    getAppointmentsByClient: async (clientId) => {
        try {
            const response = await apiService.get(`/appointments/client/${clientId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching appointments for client ID ${clientId}:`, error);
            throw error;
        }
    },

    getAppointmentsByEmployee: async (employeeId) => {
        try {
            const response = await apiService.get(`/appointments/employee/${employeeId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching appointments for employee ID ${employeeId}:`, error);
            throw error;
        }
    },

    getAllEmployeeServices: async () => {
        try {
            const response = await apiService.get('/employee-services');
            return response.data;
        } catch (error) {
            console.error('Error fetching employee services:', error);
            throw error;
        }
    },

    getEmployeeServiceById: async (id) => {
        try {
            const response = await apiService.get(`/employee-services/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching employee service with ID ${id}:`, error);
            throw error;
        }
    },

    createEmployeeService: async (data) => {
        try {
            const response = await apiService.post('/employee-services', data);
            return response.data;
        } catch (error) {
            console.error('Error creating employee service:', error);
            throw error;
        }
    },

    deleteEmployeeService: async (id) => {
        try {
            await apiService.delete(`/employee-services/${id}`);
        } catch (error) {
            console.error(`Error deleting employee service with ID ${id}:`, error);
            throw error;
        }
    }
};
