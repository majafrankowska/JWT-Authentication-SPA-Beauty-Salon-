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
    Pagination,
    Stack
} from '@mui/material';
import apiService from '../services/apiService';
import { useTranslation } from 'react-i18next';

const EmployeePanel = () => {
    const [employeeData, setEmployeeData] = useState({ name: '', phone: '', specialisation: '' });
    const [assignments, setAssignments] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [clients, setClients] = useState([]);
    const [services, setServices] = useState([]);

    const [editOpen, setEditOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const { t } = useTranslation();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUserId = localStorage.getItem('userId');
                const userId = storedUserId && !isNaN(storedUserId) ? parseInt(storedUserId, 10) : null;

                console.log('Employee ID from localStorage:', userId);

                if (!userId || isNaN(userId)) {
                    throw new Error('Employee ID not found or invalid in localStorage');
                }

                const employeeResponse = await apiService.getEmployeeByUserId(userId);
                setEmployeeData(employeeResponse);

                const appointmentResponse = await apiService.getAppointmentsByEmployee(employeeResponse.id);
                console.log('Fetched appointments:', appointmentResponse);

                const sortedAppointments = appointmentResponse.appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
                setAppointments(sortedAppointments);

                // const assignmentResponse = await apiService.getAllEmployeeServices();
                // setAssignments(assignmentResponse.filter(ass => ass.employee_id === userId));

                const assignmentResponse = await apiService.getAllEmployeeServices();
                const filteredAssignments = assignmentResponse.filter(ass => ass.employee_id === employeeResponse.id);
                setAssignments(filteredAssignments);

                const clientsResponse = await apiService.getAllClients();
                setClients(clientsResponse.clients);

                const servicesResponse = await apiService.getAllServices();
                setServices(servicesResponse.services);

            } catch (error) {
                console.error('Error fetching employee data or assignments:', error);
            }
        };
        fetchData();
    }, []);

    const handleEditEmployee = async () => {
        try {
            await apiService.updateEmployee(1, employeeData);
            setEditOpen(false);
        } catch (error) {
            console.error('Error updating employee data:', error);
        }
    };

    // const handleDeleteAssignment = async (assignmentId) => {
    //         try {
    //             await apiService.deleteEmployeeService(assignmentId);
    //             setAssignments(assignments.filter(ass => ass.id !== assignmentId));
    //         } catch (error) {
    //             console.error('Error deleting assignment:', error);
    //         }
    //     };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const paginatedAppointments = appointments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <Container maxWidth="md">
            <Box textAlign="center" my={5}>
                <Typography variant="h4" color="primary">{t('employeePanel.title')}</Typography>
                <Typography variant="body1" mb={4}>{t('employeePanel.description')}</Typography>
                <Button variant="contained" color="primary" onClick={() => setEditOpen(true)}>
                    {t('employeePanel.editData')}
                </Button>
            </Box>

            <Box my={4}>
                <Typography variant="h5" color="secondary">{t('employeePanel.yourAppointments')}</Typography>
                {paginatedAppointments.length > 0 ? (
                    paginatedAppointments.map(app => (
                        <Box key={app.id} my={2} p={2} border={1} borderRadius={2}>
                            <Typography>{t('employeePanel.client')}: {clients.find(client => client.id === app.clientId)?.name || 'Nieznany'}</Typography>
                            <Typography>{t('employeePanel.service')}: {services.find(emp => emp.id === app.serviceId)?.name || 'Nieznany'}</Typography>
                            <Typography>{t('employeePanel.date')}: {new Date(app.date).toLocaleString()}</Typography>
                            <Typography>{t('employeePanel.notes')}: {app.notes || 'Brak'}</Typography>
                        </Box>
                    ))
                ) : (
                        <Typography>{t('employeePanel.noAppointments')}</Typography>
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


            <Box my={4}>
                <Typography variant="h5" color="secondary">{t('employeePanel.assignments')}</Typography>
                {assignments.map(ass => (
                    <Box key={ass.id} my={2} p={2} border={1} borderRadius={2}>
                        {services.find(service => service.id === ass.service_id)?.name || 'Nieznana'}
                        {/*<Typography my={2}>{services.find(service => service.id === ass.service_id)?.name || 'Nieznana'}</Typography>*/}
                        {/*<Button variant="contained" color="secondary" onClick={() => handleDeleteAssignment(ass.id)}>Usuń Przypisanie</Button>*/}
                    </Box>
                ))}
            </Box>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogContent>
                    <TextField label={t('employeePanel.name')} fullWidth margin="dense" value={employeeData.name} onChange={(e) => setEmployeeData({ ...employeeData, name: e.target.value })} />
                    <TextField label={t('employeePanel.phone')} fullWidth margin="dense" value={employeeData.phone} onChange={(e) => setEmployeeData({ ...employeeData, phone: e.target.value })} />
                    <TextField label={t('employeePanel.specialisation')} fullWidth margin="dense" value={employeeData.specialisation} onChange={(e) => setEmployeeData({ ...employeeData, specialisation: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} color="secondary">{t('employeePanel.cancel')}</Button>
                    <Button onClick={handleEditEmployee} color="primary">{t('employeePanel.save')}</Button>
                </DialogActions>
            </Dialog>
        </Container>
        


    );
};

export default EmployeePanel;

