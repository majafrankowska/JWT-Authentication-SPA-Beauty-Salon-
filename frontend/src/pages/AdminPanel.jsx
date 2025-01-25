import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md">
            <Box textAlign="center" my={5}>
                <Typography variant="h4" color="primary">
                    Panel Administratora
                </Typography>
                <Typography variant="body1" mb={4}>
                    Zarządzaj użytkownikami, rezerwacjami i usługami.
                </Typography>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2} width="50%" margin="0 auto">
                <Button variant="contained" fullWidth onClick={() => navigate('/admin/userslist')}>Zarządzaj Uzytkownikami</Button>
                <Button variant="contained" fullWidth onClick={() => navigate('/admin/clientslist')}>Zarządzaj Klientami</Button>
                <Button variant="contained" fullWidth onClick={() => navigate('/admin/employeeslist')}>Zarządzaj Pracownikami</Button>
                <Button variant="contained" fullWidth onClick={() => navigate('/admin/serviceslist')}>Zarządzaj Usługami</Button>
                <Button variant="contained" fullWidth onClick={() => navigate('/admin/appointmentslist')}>Zarządzaj Wizytami</Button>
                <Button variant="contained" fullWidth onClick={() => navigate('/admin/serviceassignments')}>Zarządzaj Przypisaniem Usług</Button>
            </Box>
        </Container>
    );
};

export default AdminPanel;