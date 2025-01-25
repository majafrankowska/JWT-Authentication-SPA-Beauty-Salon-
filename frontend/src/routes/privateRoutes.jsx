import React from 'react';
import AdminPanel from '../pages/AdminPanel';
import EmployeePanel from '../pages/EmployeePanel';
import ClientPanel from '../pages/ClientPanel';
import NotFound from '../pages/NotFound';
import UsersList from '../pages/UsersList';
import ClientsList from '../pages/ClientsList';
import EmployeesList from '../pages/EmployeesList';
import ServicesList from '../pages/ServicesList';
import AppointmentsList from '../pages/AppointmentsList';
import ServiceAssignments from '../pages/ServiceAssignments';

const privateRoutes = [
    { path: "/adminpanel", element: React.createElement(AdminPanel) },
    { path: "/employeepanel", element: React.createElement(EmployeePanel) },
    { path: "/clientpanel", element: React.createElement(ClientPanel)},
    { path: "admin/userslist", element: React.createElement(UsersList) },
    { path: "admin/clientslist", element: React.createElement(ClientsList)},
    { path: "admin/employeeslist", element: React.createElement(EmployeesList) },
    { path: "admin/serviceslist", element: React.createElement(ServicesList) },
    { path: "admin/appointmentslist", element: React.createElement(AppointmentsList) },
    { path: "admin/serviceassignments", element: React.createElement(ServiceAssignments) },
    { path: "*", element: React.createElement(NotFound) }
];

export default privateRoutes;