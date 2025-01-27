import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const AdminPanel = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <Container maxWidth="md">
            <Box textAlign="center" my={5}>
                <Typography variant="h4" color="primary">
                    {t('adminPanel.title')}
                </Typography>
                <Typography variant="body1" mb={4}>
                    {t('adminPanel.description')}
                </Typography>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2} width="50%" margin="0 auto">
                <Button variant="contained" fullWidth onClick={() => navigate('/admin/userslist')}>
                    {t('adminPanel.manageUsers')}
                </Button>
                <Button variant="contained" fullWidth onClick={() => navigate('/admin/clientslist')}>
                    {t('adminPanel.manageClients')}
                </Button>
                <Button variant="contained" fullWidth onClick={() => navigate('/admin/employeeslist')}>
                    {t('adminPanel.manageEmployees')}
                </Button>
                <Button variant="contained" fullWidth onClick={() => navigate('/admin/serviceslist')}>
                    {t('adminPanel.manageServices')}
                </Button>
                <Button variant="contained" fullWidth onClick={() => navigate('/admin/appointmentslist')}>
                    {t('adminPanel.manageAppointments')}
                </Button>
                <Button variant="contained" fullWidth onClick={() => navigate('/admin/serviceassignments')}>
                    {t('adminPanel.manageServiceAssignments')}
                </Button>
            </Box>
        </Container>
    );
};

export default AdminPanel;