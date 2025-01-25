const express = require("express");
const ServiceController = require("../controllers/ServiceController");
const authenticateToken = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.get("/", ServiceController.getAll);
router.post("/", authenticateToken, ServiceController.create);
router.get("/:id", authenticateToken, ServiceController.getById); 
router.put("/:id", authenticateToken, ServiceController.update);
router.delete("/:id", authenticateToken, ServiceController.delete);

module.exports = router;