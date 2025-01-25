// import { Container, Typography, Box } from '@mui/material';

// const EmployeePanel = () => {
//     return (
//         <Container maxWidth="md">
//             <Box textAlign="center" my={5}>
//                 <Typography variant="h4" color="primary">
//                     Panel pracownika
//                 </Typography>
//                 <Typography variant="body1">
//                     Przeglądaj swoje wizyty i zarządzaj dostępnością.
//                 </Typography>
//             </Box>
//         </Container>
//     );
// };

// export default EmployeePanel;

import { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Dialog, DialogContent, DialogActions, TextField } from '@mui/material';
import apiService from '../services/apiService';

const EmployeePanel = () => {
    const [employeeData, setEmployeeData] = useState({ name: '', phone: '', specialisation: '' });
    const [assignments, setAssignments] = useState([]);
    const [editOpen, setEditOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const employeeResponse = await apiService.getEmployeeById(1); // Replace with dynamic ID
                setEmployeeData(employeeResponse);

                const assignmentResponse = await apiService.getAllEmployeeServices();
                setAssignments(assignmentResponse.filter(ass => ass.employee_id === 1)); // Replace with dynamic ID
            } catch (error) {
                console.error('Error fetching employee data or assignments:', error);
            }
        };
        fetchData();
    }, []);

    const handleEditEmployee = async () => {
        try {
            await apiService.updateEmployee(1, employeeData); // Replace with dynamic ID
            setEditOpen(false);
        } catch (error) {
            console.error('Error updating employee data:', error);
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        try {
            await apiService.deleteEmployeeService(assignmentId);
            setAssignments(assignments.filter(ass => ass.id !== assignmentId));
        } catch (error) {
            console.error('Error deleting assignment:', error);
        }
    };

    return (
        <Container maxWidth="md">
            <Box textAlign="center" my={5}>
                <Typography variant="h4" color="primary">Panel Pracownika</Typography>
                <Typography variant="body1" mb={4}>Zarządzaj swoimi danymi i przypisaniami usług.</Typography>
                <Button variant="contained" color="primary" onClick={() => setEditOpen(true)}>Edytuj Dane</Button>
            </Box>

            <Box my={4}>
                <Typography variant="h5" color="secondary">Przypisania Usług</Typography>
                {assignments.map(ass => (
                    <Box key={ass.id} my={2} p={2} border={1} borderRadius={2}>
                        <Typography>ID Przypisania: {ass.id}</Typography>
                        <Typography>ID Usługi: {ass.service_id}</Typography>
                        <Button variant="contained" color="secondary" onClick={() => handleDeleteAssignment(ass.id)}>Usuń Przypisanie</Button>
                    </Box>
                ))}
            </Box>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogContent>
                    <TextField label="Imię i Nazwisko" fullWidth margin="dense" value={employeeData.name} onChange={(e) => setEmployeeData({ ...employeeData, name: e.target.value })} />
                    <TextField label="Telefon" fullWidth margin="dense" value={employeeData.phone} onChange={(e) => setEmployeeData({ ...employeeData, phone: e.target.value })} />
                    <TextField label="Specjalizacja" fullWidth margin="dense" value={employeeData.specialisation} onChange={(e) => setEmployeeData({ ...employeeData, specialisation: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} color="secondary">Anuluj</Button>
                    <Button onClick={handleEditEmployee} color="primary">Zapisz</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default EmployeePanel;

