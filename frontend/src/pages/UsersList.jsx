import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import { registerUser } from '../services/authService';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: '' });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apiService.getAllUsers();
                console.log('Fetched users:', response);
                setUsers(response.users || []);
            } catch (error) {
                console.error('Error fetching users:', error);
                setUsers([]);
            }
        };
        fetchUsers();
    }, []);


    const handleDelete = async (id) => {
        if (window.confirm("Czy na pewno chcesz usunąć tego użytkownika?")) {
            try {
                await apiService.deleteUser(id);
                setUsers(users.filter(user => user.id !== id));
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleAddUser = async () => {
        try {
            const response = await registerUser(newUser);
            setUsers([...users, response]);
            setOpen(false);
            setNewUser({ username: '', email: '', password: '', role: '' });
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleEditUser = async () => {
        try {
            await apiService.updateUser(currentUser.id, currentUser);
            setUsers(users.map(user => (user.id === currentUser.id ? currentUser : user)));
            setEditOpen(false);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <Container maxWidth="md">
            <Box textAlign="center" my={5}>
                <Typography variant="h4" color="primary">Zarządzanie Użytkownikami</Typography>
                <Typography variant="body1" mb={4}>Przeglądaj, dodawaj i edytuj użytkowników systemu.</Typography>
                <Button variant="contained" color="primary" onClick={() => setOpen(true)}>Dodaj Użytkownika</Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nazwa użytkownika</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rola</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => { setCurrentUser(user); setEditOpen(true); }}>Edytuj</Button>
                                    <Button variant="contained" color="secondary" onClick={() => handleDelete(user.id)} style={{ marginLeft: '10px' }}>Usuń</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Dodaj Nowego Użytkownika</DialogTitle>
                <DialogContent>
                    <TextField label="Nazwa użytkownika" fullWidth margin="dense" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
                    <TextField label="Email" fullWidth margin="dense" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                    <TextField label="Hasło" type="password" fullWidth margin="dense" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                    <TextField label="Rola" fullWidth margin="dense" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="secondary">Anuluj</Button>
                    <Button onClick={handleAddUser} color="primary">Dodaj</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle>Edytuj Użytkownika</DialogTitle>
                <DialogContent>
                    <TextField label="Nazwa użytkownika" fullWidth margin="dense" value={currentUser?.username || ''} onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })} />
                    <TextField label="Email" fullWidth margin="dense" value={currentUser?.email || ''} onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })} />
                    <TextField label="Rola" fullWidth margin="dense" value={currentUser?.role || ''} onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} color="secondary">Anuluj</Button>
                    <Button onClick={handleEditUser} color="primary">Zapisz</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UsersList;

