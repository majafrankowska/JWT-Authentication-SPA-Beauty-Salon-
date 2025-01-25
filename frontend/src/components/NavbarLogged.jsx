import { AppBar, Toolbar, Typography} from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { logoutUser } from "../services/authService";

const NavbarLogged = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const userRole = localStorage.getItem("role");

    const getDashboardLink = () => {
        switch (userRole) {
            case "admin": return "/adminpanel";
            case "employee": return "/employeepanel";
            case "client": return "/clientpanel";
            default: return "/";
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <Link to={getDashboardLink()} style={{ textDecoration: "none", color: "inherit" }}>
                        Salon Urody
                    </Link>
                </Typography>
                <nav>
                    <button onClick={() => changeLanguage('pl')}>PL</button>
                    <button onClick={() => changeLanguage('en')}>EN</button>
                </nav>
                <Link onClick={logoutUser} style={{ textDecoration: "none", color: "inherit", marginLeft: "20px" }}>
                    {t('logoutButton')}
                </Link>
            </Toolbar>
        </AppBar>
    );
};

export default NavbarLogged;