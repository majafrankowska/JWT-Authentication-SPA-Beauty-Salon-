const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

require("dotenv").config();

console.log("JWT_SECRET:", process.env.JWT_SECRET);

const routes = require("./routes/routes"); 
const authRoutes = require("./routes/authRoutes"); 
const userRoutes = require("./routes/userRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const clientRoutes = require("./routes/clientRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const errorHandler = require("./middlewares/ErrorHandler"); 
const employeeServiceRoutes = require('./routes/employeeServiceRoutes');

dotenv.config(); 

const app = express();

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,OPTIONS,POST,PUT,DELETE",
  allowedHeaders:
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
};

app.use(cors(corsOptions)); 
app.use(express.json()); 
app.use(morgan("dev")); 

app.use(routes); 
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/employees", employeeRoutes);
app.use('/api/employee-services', employeeServiceRoutes);
app.use(errorHandler);

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);

