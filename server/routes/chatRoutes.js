const express = require("express");
const chatController = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, chatController.accessChat);
router.route("/").get(protect, chatController.fetchChats);
router.route("/group").post(protect, chatController.createGroup);
router.route("/rename").put(protect, chatController.renameGroup);
router.route("/groupadd").put(protect, chatController.addToGroup);
router.route("/groupremove").put(protect, chatController.removeFromGroup);

module.exports = router;