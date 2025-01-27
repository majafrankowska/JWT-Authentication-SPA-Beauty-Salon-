const express = require("express");
const UserController = require("../controllers/UserController");
const authenticateToken = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.post("/", authenticateToken, UserController.create); 
router.get("/", authenticateToken, UserController.index); 
router.get("/:id", authenticateToken, UserController.show);
router.put("/:id", authenticateToken, UserController.update);
router.delete("/:id", authenticateToken, UserController.delete);

module.exports = router;
