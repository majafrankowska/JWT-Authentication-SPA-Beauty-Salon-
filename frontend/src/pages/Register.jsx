import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { useTranslation } from "react-i18next";

const Register = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        username: Yup.string().required(t('usernameRequired')),
        email: Yup.string().email(t('invalidEmail')).required(t('emailRequired')),
        preconfirmedPassword: Yup.string()
            .min(6, t('passwordMinLength'))
            .required(t('passwordRequired')),
        password: Yup.string()
            .oneOf([Yup.ref('preconfirmedPassword'), null], t('passwordMismatch'))
            .required(t('confirmPasswordRequired')),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const payload = {
                username: values.username,
                email: values.email,
                password: values.password,
            };
            await registerUser(payload);
            alert(t('registrationSuccess'));
            navigate('/login');
        } catch (error) {
            alert(t('registrationError') + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 5 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    {t('register')}
                </Typography>
                <Formik
                    initialValues={{
                        username: '',
                        email: '',
                        preconfirmedPassword: '',
                        password: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form>
                            <Field
                                as={TextField}
                                fullWidth
                                label={t('username')}
                                name="username"
                                margin="normal"
                                error={touched.username && Boolean(errors.username)}
                                helperText={touched.username && errors.username}
                            />
                            <Field
                                as={TextField}
                                fullWidth
                                label={t('email')}
                                name="email"
                                type="email"
                                margin="normal"
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                            />
                            <Field
                                as={TextField}
                                fullWidth
                                label={t('password')}
                                name="preconfirmedPassword"
                                type="password"
                                margin="normal"
                                error={touched.preconfirmedPassword && Boolean(errors.preconfirmedPassword)}
                                helperText={touched.preconfirmedPassword && errors.preconfirmedPassword}
                            />
                            <Field
                                as={TextField}
                                fullWidth
                                label={t('confirmPassword')}
                                name="password"
                                type="password"
                                margin="normal"
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                                sx={{ mt: 2 }}
                            >
                                {t('register')}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Container>
    );
};

export default Register;