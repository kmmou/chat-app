const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(userController.createUser).get(protect, userController.allUsers);
router.post("/login", userController.authUser);

module.exports = router;