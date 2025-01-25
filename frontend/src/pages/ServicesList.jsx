import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import apiService from '../services/apiService';

const ServicesList = () => {
    const [services, setServices] = useState([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [newService, setNewService] = useState({ name: '', price: '', duration: '', description: '' });

    useEffect(() => {
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
        fetchServices();
    }, []);


    const handleDelete = async (id) => {
        if (window.confirm("Czy na pewno chcesz usunąć tę usługę?")) {
            await apiService.deleteService(id);
            setServices(services.filter(service => service.id !== id));
        }
    };

    const handleAddService = async () => {
        if (!newService.name || !newService.price || !newService.duration || !newService.description) {
            alert("Wszystkie pola są wymagane!");
            return;
        }
        const response = await apiService.createService(newService);
        setServices([...services, response]);
        setOpen(false);
        setNewService({ name: '', price: '', duration: '', description: '' });
    };

    const handleEditService = async () => {
        await apiService.updateService(currentService.id, currentService);
        setServices(services.map(service => (service.id === currentService.id ? currentService : service)));
        setEditOpen(false);
    };

    return (
        <Container maxWidth="md">
            <Box textAlign="center" my={5}>
                <Typography variant="h4" color="primary">Zarządzanie Usługami</Typography>
                <Typography variant="body1" mb={4}>Przeglądaj, dodawaj i edytuj usługi salonu.</Typography>
                <Button variant="contained" color="primary" onClick={() => setOpen(true)}>Dodaj Usługę</Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nazwa</TableCell>
                            <TableCell>Cena</TableCell>
                            <TableCell>Czas</TableCell>
                            <TableCell>Opis</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(services) && services.map(service => (
                            <TableRow key={service.id}>
                                <TableCell>{service.id}</TableCell>
                                <TableCell>{service.name}</TableCell>
                                <TableCell>{service.price}</TableCell>
                                <TableCell>{service.duration} min</TableCell>
                                <TableCell>{service.description}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => { setCurrentService(service); setEditOpen(true); }}>Edytuj</Button>
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" color="secondary" style={{ marginLeft: '10px' }} onClick={() => handleDelete(service.id)}>Usuń</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Dodaj Nową Usługę</DialogTitle>
                <DialogContent>
                    <TextField label="Nazwa" fullWidth margin="dense" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} />
                    <TextField label="Cena" type="number" fullWidth margin="dense" value={newService.price} onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })} />
                    <TextField label="Czas (minuty)" type="number" fullWidth margin="dense" value={newService.duration} onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })} />
                    <TextField label="Opis" fullWidth multiline margin="dense" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="secondary">Anuluj</Button>
                    <Button onClick={handleAddService} color="primary">Dodaj</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle>Edytuj Usługę</DialogTitle>
                <DialogContent>
                    <TextField label="Nazwa" fullWidth margin="dense" value={currentService?.name || ''} onChange={(e) => setCurrentService({ ...currentService, name: e.target.value })} />
                    <TextField label="Cena" type="number" fullWidth margin="dense" value={currentService?.price || ''} onChange={(e) => setCurrentService({ ...currentService, price: Number(e.target.value) })} />
                    <TextField label="Czas (minuty)" type="number" fullWidth margin="dense" value={currentService?.duration || ''} onChange={(e) => setCurrentService({ ...currentService, duration: Number(e.target.value) })} />
                    <TextField label="Opis" fullWidth multiline margin="dense" value={currentService?.description || ''} onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} color="secondary">Anuluj</Button>
                    <Button onClick={handleEditService} color="primary">Zapisz</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ServicesList;
