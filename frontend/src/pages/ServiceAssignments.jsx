import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import apiService from '../services/apiService';

const ServiceAssignments = () => {
    const [employeeServices, setEmployeeServices] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [filteredAssignments, setFilteredAssignments] = useState([]);
    const [addOpen, setAddOpen] = useState(false);
    const [newAssignment, setNewAssignment] = useState({ employeeId: '', serviceId: '' });

    useEffect(() => {
        const fetchEmployeeServices = async () => {
            try {
                const response = await apiService.getAllEmployeeServices();
                console.log('Fetched employee services:', response);
                setEmployeeServices(response || []);
            } catch (error) {
                console.error('Error fetching employee services:', error);
                setEmployeeServices([]);
            }
        };

        const fetchServices = async () => {
            try {
                const response = await apiService.getAllServices();
                console.log('Fetched services:', response);
                setServices(response.services || []);
            } catch (error) {
                console.error('Error fetching services:', error);
                setServices([]);
            }
        };

        fetchEmployeeServices();
        fetchServices();
    }, []);

    const handleServiceSelection = (serviceId) => {
        setSelectedService(serviceId);
        const assignments = employeeServices.filter(assign => assign.service_id === serviceId);
        setFilteredAssignments(assignments);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Czy na pewno chcesz usunąć to przypisanie?")) {
            await apiService.deleteEmployeeService(id);
            setFilteredAssignments(filteredAssignments.filter(assign => assign.id !== id));
        }
    };

    const handleAddAssignment = async () => {
        try {
            const response = await apiService.createEmployeeService(newAssignment);
            setEmployeeServices([...employeeServices, response]);
            if (response.serviceId === selectedService) {
                setFilteredAssignments([...filteredAssignments, response]);
            }
            setAddOpen(false);
            setNewAssignment({ employeeId: '', serviceId: '' });
        } catch (error) {
            console.error('Error adding assignment:', error);
        }
    };

    return (
        <Container maxWidth="md">
            <Box textAlign="center" my={5}>
                <Typography variant="h4" color="primary">Zarządzanie Przypisaniami Usług</Typography>
                <Typography variant="body1" mb={4}>Wybierz usługę, aby zobaczyć przypisanych pracowników.</Typography>
                <Button variant="contained" color="primary" onClick={() => setAddOpen(true)}>Dodaj Przypisanie</Button>
                <Typography variant="body1" mb={4}></Typography>
                
                <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
                    {services.map(service => (
                        <Button
                            key={service.id}
                            variant="contained"
                            color="secondary"
                            onClick={() => handleServiceSelection(service.id)}
                        >
                            {service.name}
                        </Button>
                    ))}
                </Box>
            </Box>

            {selectedService && (
                <Box mt={5}>
                    <Typography variant="h5" color="secondary">
                        Przypisani pracownicy do usługi ID: {selectedService}
                    </Typography>
                    <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID Przypisania</TableCell>
                                    <TableCell>ID Pracownika</TableCell>
                                    <TableCell>ID Usługi</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredAssignments.map((assignment) => (
                                    <TableRow key={assignment.id}>
                                        <TableCell>{assignment.id}</TableCell>
                                        <TableCell>{assignment.employee_id}</TableCell>
                                        <TableCell>{assignment.service_id}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" color="secondary" onClick={() => handleDelete(assignment.id)}>Usuń</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
                <DialogTitle>Dodaj Nowe Przypisanie</DialogTitle>
                <DialogContent>
                    <TextField
                        label="ID Pracownika"
                        fullWidth
                        margin="dense"
                        value={newAssignment.employeeId}
                        onChange={(e) => setNewAssignment({ ...newAssignment, employeeId: e.target.value })}
                    />
                    <TextField
                        label="ID Usługi"
                        fullWidth
                        margin="dense"
                        value={newAssignment.serviceId}
                        onChange={(e) => setNewAssignment({ ...newAssignment, serviceId: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddOpen(false)} color="secondary">Anuluj</Button>
                    <Button onClick={handleAddAssignment} color="primary">Dodaj</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ServiceAssignments;
