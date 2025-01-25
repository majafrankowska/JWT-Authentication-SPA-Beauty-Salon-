const express = require('express');
const EmployeeServiceController = require('../controllers/EmployeeServiceController');

const router = express.Router();

router.post("/", EmployeeServiceController.create);
router.get("/", EmployeeServiceController.getAll);
router.get("/:id", EmployeeServiceController.getById);
router.delete("/:id", EmployeeServiceController.delete);

module.exports = router;