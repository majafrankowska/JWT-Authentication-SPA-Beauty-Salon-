import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import apiService from '../services/apiService';

const AppointmentsList = () => {
    const [appointments, setAppointments] = useState([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [currentAppointment, setCurrentAppointment] = useState(null);
    const [newAppointment, setNewAppointment] = useState({ clientId: '', employeeId: '', serviceId: '', date: '', notes: '' });

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await apiService.getAllAppointments();
                console.log('Fetched appointments:', response);
                setAppointments(response.appointments || []);
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setAppointments([]);
            }
        };
        fetchAppointments();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Czy na pewno chcesz usunąć tę wizytę?")) {
            await apiService.deleteAppointment(id);
            setAppointments(appointments.filter(appointment => appointment.id !== id));
        }
    };

    const handleAddAppointment = async () => {
        const response = await apiService.createAppointment(newAppointment);
        setAppointments([...appointments, response]);
        setOpen(false);
        setNewAppointment({ clientId: '', employeeId: '', serviceId: '', date: '', notes: '' });
    };

    const handleEditAppointment = async () => {
        await apiService.updateAppointment(currentAppointment.id, currentAppointment);
        setAppointments(appointments.map(appointment => (appointment.id === currentAppointment.id ? currentAppointment : appointment)));
        setEditOpen(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };


    return (
        <Container maxWidth="md">
            <Box textAlign="center" my={5}>
                <Typography variant="h4" color="primary">Zarządzanie Wizytami</Typography>
                <Typography variant="body1" mb={4}>Przeglądaj, dodawaj i edytuj wizyty klientów.</Typography>
                <Button variant="contained" color="primary" onClick={() => setOpen(true)}>Dodaj Wizytę</Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>ID Klienta</TableCell>
                            <TableCell>ID Pracownika</TableCell>
                            <TableCell>ID Usługi</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell>Notatki</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appointments.map(appointment => (
                            <TableRow key={appointment.id}>
                                <TableCell>{appointment.id}</TableCell>
                                <TableCell>{appointment.clientId}</TableCell>
                                <TableCell>{appointment.employeeId}</TableCell>
                                <TableCell>{appointment.serviceId}</TableCell>
                                <TableCell>{formatDate(appointment.date)}</TableCell>
                                <TableCell>{appointment.notes}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => { setCurrentAppointment(appointment); setEditOpen(true); }}>Edytuj</Button>
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" color="secondary" onClick={() => handleDelete(appointment.id)} >Usuń</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Dodaj Nową Wizytę</DialogTitle>
                <DialogContent>
                    <TextField label="ID Klienta" fullWidth margin="dense" value={newAppointment.clientId} onChange={(e) => setNewAppointment({ ...newAppointment, clientId: e.target.value })} />
                    <TextField label="ID Pracownika" fullWidth margin="dense" value={newAppointment.employeeId} onChange={(e) => setNewAppointment({ ...newAppointment, employeeId: e.target.value })} />
                    <TextField label="ID Usługi" fullWidth margin="dense" value={newAppointment.serviceId} onChange={(e) => setNewAppointment({ ...newAppointment, serviceId: e.target.value })} />
                    <TextField label="Data (YYYY-MM-DD HH:MM:SS)" fullWidth margin="dense" value={newAppointment.date} onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })} />
                    <TextField label="Notatki" fullWidth multiline margin="dense" value={newAppointment.notes} onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="secondary">Anuluj</Button>
                    <Button onClick={handleAddAppointment} color="primary">Dodaj</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle>Edytuj Wizytę</DialogTitle>
                <DialogContent>
                    <TextField label="ID Klienta" fullWidth margin="dense" value={currentAppointment?.clientId || ''} onChange={(e) => setCurrentAppointment({ ...currentAppointment, clientId: e.target.value })} />
                    <TextField label="ID Pracownika" fullWidth margin="dense" value={currentAppointment?.employeeId || ''} onChange={(e) => setCurrentAppointment({ ...currentAppointment, employeeId: e.target.value })} />
                    <TextField label="ID Usługi" fullWidth margin="dense" value={currentAppointment?.serviceId || ''} onChange={(e) => setCurrentAppointment({ ...currentAppointment, serviceId: e.target.value })} />
                    <TextField label="Data (YYYY-MM-DD HH:MM:SS)" fullWidth margin="dense" value={currentAppointment?.date || ''} onChange={(e) => setCurrentAppointment({ ...currentAppointment, date: e.target.value })} />
                    <TextField label="Notatki" fullWidth multiline margin="dense" value={currentAppointment?.notes || ''} onChange={(e) => setCurrentAppointment({ ...currentAppointment, notes: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} color="secondary">Anuluj</Button>
                    <Button onClick={handleEditAppointment} color="primary">Zapisz</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AppointmentsList;














