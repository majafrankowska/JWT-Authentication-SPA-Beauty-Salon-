import { Container, Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";

const Home = () => {
    const { t } = useTranslation();

    const services = t('servicesList', { returnObjects: true });

    return (
        <Container>
            <Box textAlign="center" my={5}>
                <Typography variant="h3" color="primary">
                    {t('welcome')}
                </Typography>
                <Typography variant="body1" mt={2}>
                    {t('aboutUsDescription')}
                </Typography>
                <img
                    src="./src/salon.jpeg"
                    alt="Salon Urody"
                    style={{ width: "100%", maxWidth: "600px", borderRadius: "8px", margin: "20px auto" }}
                />
                <Typography variant="h4" mt={3}>
                    {t('servicesOffered')}
                </Typography>
                <Box display="flex" justifyContent="center">
                    <List>
                        {services.map((service, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={`${service.name} - ${service.price} PLN`}
                                    secondary={`${service.description} (${service.duration} ${t('minutes')})`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Typography variant="body1" mt={3} fontWeight="bold">
                    {t('appointmentInfo')}
                </Typography>

                <Box mt={4}>
                    <Typography variant="h6">{t('contact')}</Typography>
                    <Typography>{t('address')}: ul. Piękna 10, Warszawa</Typography>
                    <Typography>{t('phone')}: +48 123 456 789</Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Home;
