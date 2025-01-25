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

const ClientPanel = () => {
    const [clientData, setClientData] = useState({ name: '', phone: '', address: '' });
    const [appointments, setAppointments] = useState([]);
    const [employees] = useState([]);
    const [services] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [addAppointmentOpen, setAddAppointmentOpen] = useState(false);
    const [newAppointment, setNewAppointment] = useState({ employeeId: '', serviceId: '', date: '', notes: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) throw new Error('User ID not found');

                const clientResponse = await apiService.getClientByUserId(userId);
                if (clientResponse && clientResponse.id) {
                    setClientData(clientResponse);
                }

                const appointmentResponse = await apiService.getAppointmentsByClient(clientResponse.id);
                setAppointments(appointmentResponse);
            } catch (error) {
                console.error('Error fetching client data or appointments:', error);
            }
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
            await apiService.updateClient(clientData.id, clientData);
            setEditOpen(false);
        } catch (error) {
            console.error('Error updating client data:', error);
        }
    };

    const handleCancelAppointment = async (appointmentId) => {
        try {
            await apiService.deleteAppointment(appointmentId);
            setAppointments(appointments.filter(app => app.id !== appointmentId));
        } catch (error) {
            console.error('Error canceling appointment:', error);
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
                <Typography variant="h4" color="primary">Panel Klienta</Typography>
                <Typography variant="body1" mb={4}>Zarządzaj swoimi danymi i wizytami.</Typography>

                
                <Button variant="contained" color="primary" onClick={() => setEditOpen(true)}>Edytuj Dane</Button>
                <Button variant="contained" color="secondary" style={{ marginLeft: '10px' }} onClick={() => setAddAppointmentOpen(true)}>Dodaj Wizytę</Button>
            </Box>

            {/* <Box my={4}>
                <Typography variant="h5" color="secondary">Twoje Wizyty</Typography>
                {appointments.length > 0 ? (
                    appointments.map(app => (
                        <Box key={app.id} my={2} p={2} border={1} borderRadius={2}>
                            <Typography>ID Wizyty: {app.id}</Typography>
                            <Typography>Data: {new Date(app.date).toLocaleString()}</Typography>
                            <Typography>Notatki: {app.notes || 'Brak'}</Typography>
                            <Button variant="contained" color="secondary" onClick={() => handleCancelAppointment(app.id)} style={{ marginLeft: '10px' }}>Anuluj</Button>
                        </Box>
                    ))
                ) : (
                    <Typography>Nie masz jeszcze żadnych wizyt.</Typography>
                )
                } */}

            <Box my={4}>
                <Typography variant="h5" color="secondary">Twoje Wizyty</Typography>
                {paginatedAppointments.length > 0 ? (
                    paginatedAppointments.map(app => (
                        <Box key={app.id} my={2} p={2} border={1} borderRadius={2}>
                            <Typography>ID Wizyty: {app.id}</Typography>
                            <Typography>Data: {new Date(app.date).toLocaleString()}</Typography>
                            <Typography>Notatki: {app.notes || 'Brak'}</Typography>
                            <Button variant="contained" color="secondary" onClick={() => handleCancelAppointment(app.id)} style={{ marginLeft: '10px' }}>Anuluj</Button>
                        </Box>
                    ))
                ) : (
                    <Typography>Nie masz jeszcze żadnych wizyt.</Typography>
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
                    <TextField label="Imię i Nazwisko" fullWidth margin="dense" value={clientData.name} onChange={(e) => setClientData({ ...clientData, name: e.target.value })} />
                    <TextField label="Telefon" fullWidth margin="dense" value={clientData.phone} onChange={(e) => setClientData({ ...clientData, phone: e.target.value })} />
                    <TextField label="Adres" fullWidth margin="dense" value={clientData.address} onChange={(e) => setClientData({ ...clientData, address: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} color="secondary">Anuluj</Button>
                    <Button onClick={handleEditClient} color="primary">Zapisz</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={addAppointmentOpen} onClose={() => setAddAppointmentOpen(false)}>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Pracownik</InputLabel>
                        <Select value={newAppointment.employeeId} onChange={(e) => setNewAppointment({ ...newAppointment, employeeId: e.target.value })}>
                            {employees.map(emp => <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                        <InputLabel>Usługa</InputLabel>
                        <Select value={newAppointment.serviceId} onChange={(e) => setNewAppointment({ ...newAppointment, serviceId: e.target.value })}>
                            {services.map(service => <MenuItem key={service.id} value={service.id}>{service.name}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <TextField label="" type="datetime-local" fullWidth margin="dense" value={newAppointment.date} onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })} />
                    <TextField label="Notatki" fullWidth margin="dense" value={newAppointment.notes} onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddAppointmentOpen(false)} color="secondary">Anuluj</Button>
                    <Button onClick={handleAddAppointment} color="primary">Dodaj</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ClientPanel;
