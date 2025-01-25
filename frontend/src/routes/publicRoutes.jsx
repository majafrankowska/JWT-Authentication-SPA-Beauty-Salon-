import React from 'react';
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import NotFound from '../pages/NotFound.jsx';

const publicRoutes = [
    { path: "/", element: React.createElement(Home) },
    { path: "/login", element: React.createElement(Login) },
    { path: "/register", element: React.createElement(Register) },
    { path: "*", element: React.createElement(NotFound) }

];

export default publicRoutes;