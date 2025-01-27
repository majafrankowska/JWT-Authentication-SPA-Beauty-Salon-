import { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    Pagination,
    FormControl,
    Stack
} from '@mui/material';
import apiService from '../services/apiService';
import { useTranslation } from 'react-i18next';


const ClientPanel = () => {
    const [clientData, setClientData] = useState({ name: '', phone: '', address: '' });
    const [appointments, setAppointments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [services, setServices] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [addAppointmentOpen, setAddAppointmentOpen] = useState(false);
    const [newAppointment, setNewAppointment] = useState({ employeeId: '', serviceId: '', date: '', notes: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            setTimeout(async () => {
                try {
                    const storedUserId = localStorage.getItem('userId');
                    const userId = storedUserId && !isNaN(storedUserId) ? parseInt(storedUserId, 10) : null;

                    console.log('User ID from localStorage:', userId);

                    if (!userId || isNaN(userId)) {
                        throw new Error('User ID not found or invalid in localStorage');
                    }

                    const clientResponse = await apiService.getClientByUserId(userId);

                    localStorage.setItem('clientId', clientResponse.id);
                    console.log('Fetched clientId:', clientResponse.id);
                    
                    setClientData(clientResponse);

                    const appointmentResponse = await apiService.getAppointmentsByClient(clientResponse.id);
                    console.log('Fetched appointments:', appointmentResponse);

                    const sortedAppointments = appointmentResponse.appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
                    setAppointments(sortedAppointments);

                    const employeesResponse = await apiService.getAllEmployees();
                    setEmployees(employeesResponse.employees);

                    const servicesResponse = await apiService.getAllServices();
                    setServices(servicesResponse.services);


                    } catch (error) {
                    console.error('Error fetching client data or appointments:', error);
                }
            }, 500); 
        };
        fetchData();
    }, []);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const paginatedAppointments = appointments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    const handleEditClient = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const clientId = localStorage.getItem('clientId');
            const numericClientId = clientId ? parseInt(clientId, 10) : null;
            if (!numericClientId) {
                throw new Error('Client ID is missing');
            }

            const payload = {
                userId: parseInt(userId, 10),
                data: {
                    id: numericClientId,
                    name: clientData.name,
                    phone: clientData.phone,
                    address: clientData.address,
                },
            };

            console.log("Payload being sent:", payload);
            console.log("Updating client data:", clientData);
            console.log("Client ID being updated:", numericClientId);
            console.log("wow', userId, numericClientId, clientData", userId, numericClientId, clientData);


            await apiService.updateClient(numericClientId, clientData);
            setEditOpen(false);
        } catch (error) {
            console.error('Error updating client data:', error);
        }
    };

    const handleCancelAppointment = async (id) => {
        if (window.confirm("Czy na pewno chcesz usunąć tę wizytę?")) {
            try {
                const clientId = localStorage.getItem('clientId'); 
                const data = { clientId };

                await apiService.deleteAppointment(id, data);
                setAppointments(appointments.filter(appointment => appointment.id !== id));
            } catch (error) {
                console.error('Error canceling appointment:', error);
            }
        }
    };

    const handleAddAppointment = async () => {
        try {
            const newApp = {
                clientId: clientData.id,
                employeeId: newAppointment.employeeId,
                serviceId: newAppointment.serviceId,
                date: newAppointment.date,
                notes: newAppointment.notes
            };
            const response = await apiService.createAppointment(newApp);
            setAppointments([...appointments, response]);
            setAddAppointmentOpen(false);
            setNewAppointment({ employeeId: '', serviceId: '', date: '', notes: '' });
        } catch (error) {
            console.error('Error adding appointment:', error);
        }
    };

    return (
        <Container maxWidth="md">
            <Box textAlign="center" my={5}>
                <Typography variant="h4" color="primary">{t('clientPanel.title')}</Typography>
                <Typography variant="body1" mb={4}>{t('clientPanel.description')}</Typography>
                <Button variant="contained" color="primary" onClick={() => setEditOpen(true)}>{t('clientPanel.editData')}</Button>
                <Button variant="contained" color="secondary" style={{ marginLeft: '10px' }} onClick={() => setAddAppointmentOpen(true)}>{t('clientPanel.addAppointment')}</Button>
            </Box>

            <Box my={4}>
                <Typography variant="h5" color="secondary">{t('clientPanel.yourAppointments')}</Typography>
                {paginatedAppointments.length > 0 ? (
                    paginatedAppointments.map(app => (
                        <Box key={app.id} my={2} p={2} border={1} borderRadius={2}>
                            <Typography>{t('clientPanel.employee')}: {employees.find(emp => emp.id === app.employeeId)?.name || 'Nieznany'}</Typography>
                            <Typography>{t('clientPanel.service')}: {services.find(emp => emp.id === app.serviceId)?.name || 'Nieznany'}</Typography>
                            <Typography>{t('clientPanel.date')}: {new Date(app.date).toLocaleString()}</Typography>
                            <Typography>{t('clientPanel.notes')}: {app.notes || 'Brak'}</Typography>
                            <Button variant="contained" color="secondary" onClick={() => handleCancelAppointment(app.id)} style={{ marginLeft: '10px' }}>{t('clientPanel.cancel')}</Button>
                        </Box>
                    ))
                ) : (
                        <Typography>{t('clientPanel.noAppointments')}</Typography>
                )}
                
                <Stack spacing={2} mt={2} alignItems="center">
                    <Pagination
                        count={Math.ceil(appointments.length / itemsPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        color="primary"
                    />
                </Stack>
            </Box>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogContent>
                    <TextField label={t('name')} fullWidth margin="dense" value={clientData.name} onChange={(e) => setClientData({ ...clientData, name: e.target.value })} />
                    <TextField label={t('phone')} fullWidth margin="dense" value={clientData.phone} onChange={(e) => setClientData({ ...clientData, phone: e.target.value })} />
                    <TextField label={t('address')} fullWidth margin="dense" value={clientData.address} onChange={(e) => setClientData({ ...clientData, address: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} color="secondary">{t('clientPanel.cancelButton')}</Button>
                    <Button onClick={handleEditClient} color="primary">{t('clientPanel.save')}</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={addAppointmentOpen} onClose={() => setAddAppointmentOpen(false)}>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>{t('clientPanel.employee')}</InputLabel>
                        <Select
                            value={newAppointment.employeeId}
                            onChange={(e) => setNewAppointment({ ...newAppointment, employeeId: e.target.value })}
                        >
                            {employees.map(emp => (
                                <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                        <InputLabel>{t('clientPanel.service')}</InputLabel>
                        <Select
                            value={newAppointment.serviceId}
                            onChange={(e) => setNewAppointment({ ...newAppointment, serviceId: e.target.value })}
                        >
                            {services.map(service => (
                                <MenuItem key={service.id} value={service.id}>{service.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField label="" type="datetime-local" fullWidth margin="dense" value={newAppointment.date} onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })} />
                    <TextField label={t('clientPanel.notes')} fullWidth margin="dense" value={newAppointment.notes} onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddAppointmentOpen(false)} color="secondary">
                        {t('clientPanel.cancelButton')}
                    </Button>
                    <Button onClick={handleAddAppointment} color="primary">
                        {t('clientPanel.add')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ClientPanel;
