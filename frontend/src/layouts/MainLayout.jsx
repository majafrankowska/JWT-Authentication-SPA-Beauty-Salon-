// import PropTypes from "prop-types";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import { Container } from "@mui/material";

// const MainLayout = ({ children }) => {
//     return (
//         <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
//             <Navbar />
//             <Container component="main" style={{ flex: 1, padding: "20px" }}>
//                 {children}
//             </Container>
//             <Footer />
//         </div>
//     );
// };

// MainLayout.propTypes = {
//     children: PropTypes.node.isRequired,
// };

// export default MainLayout;


import PropTypes from "prop-types";
import Navbar from "../components/Navbar";
import NavbarLogged from "../components/NavbarLogged";
import Footer from "../components/Footer";
import { Container } from "@mui/material";
import { useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const location = useLocation();

    const getDashboardLink = () => {
        switch (userRole) {
            case "admin": return "/adminpanel";
            case "employee": return "/employeepanel";
            case "client": return "/clientpanel";
            default: return "/";
        }
    };

    const showPublicNavbar = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register";

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {isAuthenticated && !showPublicNavbar ? (
                <NavbarLogged dashboardLink={getDashboardLink()} />
            ) : (
                <Navbar />
            )}

            <Container component="main" style={{ flex: 1, padding: "20px" }}>
                {children}
            </Container>

            <Footer />
        </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default MainLayout;

