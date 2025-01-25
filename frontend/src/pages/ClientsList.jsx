import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import apiService from '../services/apiService';

const ClientsList = () => {
    const [clients, setClients] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [currentClient, setCurrentClient] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await apiService.getAllClients();
                console.log('Fetched clients:', response);
                setClients(response.clients || []);
            } catch (error) {
                console.error('Error fetching clients:', error);
                setClients([]);
            }
        };
        fetchClients();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Czy na pewno chcesz usunąć tego klienta?")) {
            await apiService.deleteClient(id);
            setClients(clients.filter(client => client.id !== id));
        }
    };

    const handleEditClient = async () => {
        await apiService.updateClient(currentClient.id, currentClient);
        setClients(clients.map(client => (client.id === currentClient.id ? currentClient : client)));
        setEditOpen(false);
    };

    return (
        <Container maxWidth="md">
            <Box textAlign="center" my={5}>
                <Typography variant="h4" color="primary">Zarządzanie Klientami</Typography>
                <Typography variant="body1" mb={4}>Przeglądaj, edytuj i usuwaj klientów salonu.</Typography>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Imię i Nazwisko</TableCell>
                            <TableCell>Telefon</TableCell>
                            <TableCell>Adres</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clients.map(client => (
                            <TableRow key={client.id}>
                                <TableCell>{client.id}</TableCell>
                                <TableCell>{client.name}</TableCell>
                                <TableCell>{client.phone}</TableCell>
                                <TableCell>{client.address}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => { setCurrentClient(client); setEditOpen(true); }}>Edytuj</Button>
                                    <Button variant="contained" color="secondary" onClick={() => handleDelete(client.id)} style={{ marginLeft: '10px' }}>Usuń</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle>Edytuj Klienta</DialogTitle>
                <DialogContent>
                    <TextField label="Imię i Nazwisko" fullWidth margin="dense" value={currentClient?.name || ''} onChange={(e) => setCurrentClient({ ...currentClient, name: e.target.value })} />
                    <TextField label="Telefon" fullWidth margin="dense" value={currentClient?.phone || ''} onChange={(e) => setCurrentClient({ ...currentClient, phone: e.target.value })} />
                    <TextField label="Adres" fullWidth margin="dense" value={currentClient?.address || ''} onChange={(e) => setCurrentClient({ ...currentClient, address: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} color="secondary">Anuluj</Button>
                    <Button onClick={handleEditClient} color="primary">Zapisz</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ClientsList;
