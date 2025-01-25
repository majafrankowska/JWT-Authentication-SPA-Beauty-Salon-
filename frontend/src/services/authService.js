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

        if (userId && role && accessToken) {
            localStorage.setItem('userId', userId.toString());
            localStorage.setItem('role', role);
            localStorage.setItem('token', accessToken);
            console.log('Login successful', response.data);
        } else {
            throw new Error('Brak wymaganych danych w odpowiedzi');
        }

        return { role };
    } catch (error) {
        console.error("Błąd logowania:", error);
        throw error.response ? error.response.data : 'Błąd logowania';
    }
};




// export const loginUser = async (userData) => {
//     try {
//         console.log("Dane wysyłane do serwera:", userData);
//         const response = await axios.post('http://localhost:3000/api/auth/login', userData);

//         console.log("Odpowiedź z serwera:", response.data);

//         const { user, accessToken } = response.data;
//         const role = user?.role; 

//         if (!role) {
//             throw new Error('Brak roli użytkownika w odpowiedzi');
//         }

//         localStorage.setItem('token', accessToken);
//         localStorage.setItem('role', role);

//         return { role };  

//     } catch (error) {
//         console.error("Błąd logowania:", error);
//         throw error.response ? error.response.data : 'Błąd logowania';
//     }
// };

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
};

