const express = require("express");
const AppointmentController = require("../controllers/AppointmentController");
const authenticateToken = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.get("/", authenticateToken, AppointmentController.getAll); 
router.get("/:id", authenticateToken, AppointmentController.getById); 
router.get("/client/:clientId", authenticateToken, AppointmentController.getByClient);
router.get("/employee/:employeeId", authenticateToken, AppointmentController.getByEmployee);

router.post("/", authenticateToken, AppointmentController.create); 
router.put("/:id", authenticateToken, AppointmentController.update); 
router.delete("/:id", authenticateToken, AppointmentController.delete); 


module.exports = router;