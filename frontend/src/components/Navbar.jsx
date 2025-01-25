import { AppBar, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


const Navbar = () => {

    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                        Salon Urody
                    </Link>
                </Typography>
                <nav>
                    <button onClick={() => changeLanguage('pl')}>PL</button>
                    <button onClick={() => changeLanguage('en')}>EN</button>
                </nav>
                <Link to="/login" style={{ textDecoration: "none", color: "inherit", marginLeft: "20px" }}>
                    {t('loginButton')}
                </Link>
                <Link to="/register" style={{ textDecoration: "none", color: "inherit", marginLeft: "20px" }}>
                    {t('registerButton')}
                </Link>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;