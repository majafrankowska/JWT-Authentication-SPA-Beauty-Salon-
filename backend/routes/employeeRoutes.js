const express = require("express");
const EmployeeController = require("../controllers/EmployeeController");
const authenticateToken = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.get("/", authenticateToken, EmployeeController.getAll); 
router.get("/:id", authenticateToken, EmployeeController.getById); 
router.get("/user/:userId", authenticateToken, EmployeeController.getByUserId);

router.post("/", authenticateToken, EmployeeController.create); 
router.put("/:id", authenticateToken, EmployeeController.update); 
router.delete("/:id", authenticateToken, EmployeeController.delete); 

module.exports = router;