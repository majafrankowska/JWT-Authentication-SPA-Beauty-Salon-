const express = require("express");
const ClientController = require("../controllers/ClientController");
const authenticateToken = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.post("/", authenticateToken, ClientController.create);
router.get("/", authenticateToken, ClientController.getAll);
router.get("/:id", authenticateToken, ClientController.getById);
router.put("/:id", authenticateToken, ClientController.update);
router.delete("/:id", authenticateToken, ClientController.delete);
router.get("/user/:userId", authenticateToken, ClientController.getByUserId);


module.exports = router;