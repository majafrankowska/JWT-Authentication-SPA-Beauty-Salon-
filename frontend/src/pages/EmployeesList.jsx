import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import apiService from '../services/apiService';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await apiService.getAllEmployees();
                console.log('Fetched employees:', response);
                setEmployees(response.employees || []);
            } catch (error) {
                console.error('Error fetching employees:', error);
                setEmployees([]);
            }
        };
        fetchEmployees();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Czy na pewno chcesz usunąć tego pracownika?")) {
            await apiService.deleteEmployee(id);
            setEmployees(employees.filter(employee => employee.id !== id));
        }
    };

    const handleEditEmployee = async () => {
        await apiService.updateEmployee(currentEmployee.id, currentEmployee);
        setEmployees(employees.map(employee => (employee.id === currentEmployee.id ? currentEmployee : employee)));
        setEditOpen(false);
    };

    return (
        <Container maxWidth="md">
            <Box textAlign="center" my={5}>
                <Typography variant="h4" color="primary">Zarządzanie Pracownikami</Typography>
                <Typography variant="body1" mb={4}>Przeglądaj, edytuj i usuwaj pracowników salonu.</Typography>
                {/* <Button variant="contained" color="primary" onClick={() => setOpen(true)}>Dodaj Pracownika</Button> */}
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Imię i Nazwisko</TableCell>
                            <TableCell>Telefon</TableCell>
                            <TableCell>Specjalizacja</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map(employee => (
                            <TableRow key={employee.id}>
                                <TableCell>{employee.id}</TableCell>
                                <TableCell>{employee.name}</TableCell>
                                <TableCell>{employee.phone}</TableCell>
                                <TableCell>{employee.specialisation}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => { setCurrentEmployee(employee); setEditOpen(true); }}>Edytuj</Button>
                                    <Button variant="contained" color="secondary" onClick={() => handleDelete(employee.id)} style={{ marginLeft: '10px' }}>Usuń</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle>Edytuj Pracownika</DialogTitle>
                <DialogContent>
                    <TextField label="Imię i Nazwisko" fullWidth margin="dense" value={currentEmployee?.name || ''} onChange={(e) => setCurrentEmployee({ ...currentEmployee, name: e.target.value })} />
                    <TextField label="Telefon" fullWidth margin="dense" value={currentEmployee?.phone || ''} onChange={(e) => setCurrentEmployee({ ...currentEmployee, phone: e.target.value })} />
                    <TextField label="Specjalizacja" fullWidth margin="dense" value={currentEmployee?.specialisation || ''} onChange={(e) => setCurrentEmployee({ ...currentEmployee, specialisation: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} color="secondary">Anuluj</Button>
                    <Button onClick={handleEditEmployee} color="primary">Zapisz</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default EmployeeList;
