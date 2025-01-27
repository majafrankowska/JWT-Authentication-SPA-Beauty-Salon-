# JWT-Authentication-SPA-Beauty-Salon

## Overview
JWT-Authentication-SPA-Beauty-Salon is a comprehensive web application for managing beauty salon operations. It provides functionality for user authentication, client and employee management, appointment scheduling, and service assignments using JSON Web Token (JWT) for secure authentication. Made as a final project for TIN subject at PJATK.

## Features
- **User Authentication:** Register and log in users with JWT-based authentication.
- **Role-Based Access:** Separate panels for admin, clients, and employees.
- **Appointment Management:** Clients can book and cancel appointments.
- **Employee Management:** Employees can manage their services and appointments.
- **Service Listings:** View and manage available beauty services.
- **Multi-language Support:** English and Polish using `react-i18next`.
- **Responsive Design:** Built with Material-UI.

## Technologies Used
- **Frontend:** React.js with React Router, Axios, Material-UI
- **Backend:** Node.js with Express.js
- **Database:** MySQL
- **Authentication:** JSON Web Token (JWT)

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/JWT-Authentication-SPA-Beauty-Salon.git
   cd JWT-Authentication-SPA-Beauty-Salon
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   node server.js
   ```

4. Setup the frontend:
   ```bash
   npx create-vite frontend --template react
   cd frontend
   npm install
   npm run dev
   ```

5. Install additional dependencies:
   ```bash
   npm install axios bootstrap react-router-dom react-i18next i18next @mui/material @mui/icons-material
   ```

## Environment Variables
Configure your database connection in a `.env` file:

Using separate credentials:
```
DB_USER=<your_db_user>
DB_PASSWORD=<your_db_password>
DB_NAME=salon_urody
DB_PORT=3306
DB_HOST=localhost
```

Using a connection URL:
```
DB_URL=mysql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>
```

For macOS, update `.zshrc` and apply changes:
```bash
nano ~/.zshrc
source ~/.zshrc
```

Verify changes with:
```bash
echo $DB_USER
```

## Working with MySQL
To connect to MySQL via terminal:
```bash
mysql -u root -p -P 8889 -h localhost
```

Useful SQL commands:
```sql
SHOW DATABASES;
USE salon_urody;
SHOW TABLES;
SELECT * FROM users;
UPDATE users SET role = 'admin' WHERE id = 1;
DELETE FROM users WHERE id = 1;
INSERT INTO users (username, email, password, role) VALUES ('iuser', '...', '...');
DELETE FROM sessions WHERE user_id = 6;
```

## API Endpoints

## Users
```
GET /api/users  (get all users)
GET /api/users/:id  (get user by ID)
POST /api/users  (create user - use register instead)
PUT /api/users/:id  (update user)
DELETE /api/users/:id  (delete user)
```

Example PUT request:
```json
{
    "username": "client9",
    "email": "client9@example.com",
    "password": "hashedpassword",
    "role": "client"
}
```

## Clients
```
GET /api/clients  (get all clients)
GET /api/clients/:id  (get client by ID)
PUT /api/clients/:id  (update client)
DELETE /api/clients/:id  (delete client)
```

## Appointments
```
GET /api/appointments  (get all appointments)
POST /api/appointments  (create an appointment)
```

Example request:
```json
{
  "clientId": 5,
  "employeeId": 2,
  "serviceId": 4,
  "date": "2025-06-20 10:00:00",
  "notes": "Notatki notatki notatki"
}
```

# Screenshots

#### internationalized with i18n - English & Polish

### Home Page 

| ![Homepage EN](https://github.com/user-attachments/assets/d7f0cc3d-fffd-4f73-9ce7-b5810d775721) | ![Homepage PL](https://github.com/user-attachments/assets/e30778e3-b381-4731-8eb4-f441603f261a) |
|:--:|:--:|

### Login & Register Pages 

| ![Login](https://github.com/user-attachments/assets/375879fd-9f72-4ed8-810d-e7d27ecb4fdf) | ![Register](https://github.com/user-attachments/assets/e283c635-37fe-4c85-975f-828ed234aa28) |
|:--:|:--:|

### Client Panel

| ![](https://github.com/user-attachments/assets/64167a75-e033-48e1-b903-55b42c3aa69d) | ![](https://github.com/user-attachments/assets/64167a75-e033-48e1-b903-55b42c3aa69d) |
|:--:|:--:|

### Employee Panel

| ![](https://github.com/user-attachments/assets/247be9cf-52d7-4fbd-9f41-98972ce9adb3) | ![](https://github.com/user-attachments/assets/149843d8-c682-4854-83ff-3f17e6cd9497) |
|:--:|:--:|

### Admin Panel
<img width="1440" alt="Screenshot 2025-01-25 at 19 22 55" src="https://github.com/user-attachments/assets/d5eda492-00a5-4688-9b6c-4715683b0e3c" />


