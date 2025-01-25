import { Typography, Container } from "@mui/material";

const Footer = () => {
    return (
        <Container component="footer" style={{ padding: "20px 0", textAlign: "center" }}>
            <Typography variant="body2" color="textSecondary">
                © {new Date().getFullYear()} Salon Urody. Wszelkie prawa zastrzeżone.
            </Typography>
        </Container>
    );
};

export default Footer;
