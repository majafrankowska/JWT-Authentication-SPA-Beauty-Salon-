import axios from 'axios';

export const registerUser = async (userData) => {
    try {
        const response = await axios.post('http://localhost:3000/api/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const loginUser = async (userData) => {
    try {
        console.log("Dane wysyłane do serwera:", userData);
        const response = await axios.post('http://localhost:3000/api/auth/login', userData);

        console.log("Odpowiedź z serwera:", response.data);

        const { userId, role, accessToken } = response.data;

        console.log("userId:", userId);
        console.log("role:", role);
        console.log("accessToken:", accessToken);

        if ( userId && role && accessToken) {
            localStorage.setItem('userId', String(userId));
            localStorage.setItem('role', role);
            localStorage.setItem('token', accessToken);
            console.log('Login successful', response.data);
        } else {
            throw new Error('Brak wymaganych danych w odpowiedzi');
        }

        return { userId, role, accessToken };
        } catch (error) {
        console.error("Błąd logowania:", error);
        throw error.response ? error.response.data : 'Błąd logowania';
    }
};


export const logoutUser = () => {
    localStorage.clear(); 
    window.location.href = '/';
};
