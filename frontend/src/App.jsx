import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from './pages/NotFound';
import AdminPanel from './pages/AdminPanel';
import EmployeePanel from './pages/EmployeePanel';
import ClientPanel from './pages/ClientPanel';
import UsersList from './pages/UsersList';
import ClientsList from './pages/ClientsList';
import EmployeesList from './pages/EmployeesList';
import ServicesList from './pages/ServicesList';
import AppointmentsList from './pages/AppointmentsList';
import ServiceAssignments from './pages/ServiceAssignments';


function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/adminpanel" element={<AdminPanel />} />
          <Route path="/employeepanel" element={<EmployeePanel />} />
          <Route path="/clientpanel" element={<ClientPanel />} />
          <Route path="admin/userslist" element={<UsersList />} />
          <Route path="admin/clientslist" element={<ClientsList />} />
          <Route path="admin/employeeslist" element={<EmployeesList />} />
          <Route path="admin/serviceslist" element={<ServicesList />} />
          <Route path="admin/appointmentslist" element={<AppointmentsList />} />
          <Route path="admin/serviceassignments" element={<ServiceAssignments />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;

