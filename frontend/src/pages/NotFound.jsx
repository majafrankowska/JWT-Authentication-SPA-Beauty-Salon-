
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '150px' }}>
            <h1>404 - Strona nie znaleziona</h1>
            <p style={{ fontSize: '1.5em', margin: '20px 0' }}>Przepraszamy, ale strona, której szukasz, nie istnieje.</p>
            <Button variant="contained" color="primary" component={Link} to="/" style={{ marginTop: '20px' }}>
                Powrót do strony głównej
            </Button>
        </div>
    );
}

export default NotFound;