import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        identifier: Yup.string().required(t('login.identifier') + ' ' + t('required')),
        password: Yup.string().required(t('login.password') + ' ' + t('required')),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await loginUser(values);
            console.log('login.response', response);

            // if (response.role) {
            //     console.log(t('login.role'), response.role);

            //     switch (response.role) {
            //         case "admin":
            //             navigate("/adminpanel");
            //             break;
            //         case "employee":
            //             navigate("/employeepanel");
            //             break;
            //         case "client":
            //             navigate("/clientpanel");
            //             break;
            //         default:
            //             alert(t('login.unknownRole'));
            //     }

            if (response.role) {
                localStorage.setItem('role', response.role);
                localStorage.setItem('userId', response.userId);

                switch (response.role) {
                    case "admin":
                        navigate("/adminpanel");
                        break;
                    case "employee":
                        navigate("/employeepanel");
                        break;
                    case "client":
                        navigate("/clientpanel");
                        break;
                    default:
                        alert('login.unknownRole');
                }
            } else {
                alert(t('login.noRole'));
            }
        } catch (error) {
            console.error(t('login.error'), error);
            alert(t('login.loginError', { message: error?.message || t('login.invalidData') }));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={5}>
                <Typography variant="h4" align="center" gutterBottom>
                    {t('login.title')}
                </Typography>
                <Formik
                    initialValues={{ identifier: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <Field
                                name="identifier"
                                as={TextField}
                                label={t('login.identifier')}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                            />
                            <Field
                                name="password"
                                as={TextField}
                                label={t('login.password')}
                                type="password"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={isSubmitting}
                                style={{ marginTop: '16px' }}
                            >
                                {t('login.submit')}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Container>
    );
};

export default Login;