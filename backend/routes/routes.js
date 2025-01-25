const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const serviceRoutes = require("./serviceRoutes");
const clientRoutes = require("./clientRoutes");
const appointmentRoutes = require("./appointmentRoutes");
const employeeServiceRoutes = require('./employeeServiceRoutes');
const employeeRoutes = require('./employeeRoutes');



const router = express.Router();

router.use("/api/auth", authRoutes);
router.use("/api/users", userRoutes);
router.use("/api/services", serviceRoutes);
router.use("/api/clients", clientRoutes);
router.use("/api/appointments", appointmentRoutes);
router.use("/api/employees", employeeRoutes);
router.use("/api/employee-services", employeeServiceRoutes);


module.exports = router;
