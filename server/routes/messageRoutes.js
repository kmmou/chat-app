const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const messageController = require("../controllers/messageController");

const router = express.Router();

router.route("/").post(protect, messageController.sendMessage);
router.route("/:chatId").get(protect, messageController.allMessages)

module.exports = router;