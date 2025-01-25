import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import publicRoutes from './publicRoutes';
import privateRoutes from './privateRoutes';
import { useAuth } from '../context/AuthContext';

const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            <Routes>
                {publicRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}
                {isAuthenticated && privateRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}
            </Routes>
        </Router>
    );
};

export default AppRoutes;