const express = require("express");
const {
  getAllMessage,
  addMessage,
  updateMsgStatus,
  getAllUnreadMsgs,
} = require("../controllers/messageControllers");
const router = express.Router();

router.post("/getmsg", getAllMessage);
router.post("/addmsg", addMessage);
router.post("/msgStatus", updateMsgStatus);
router.post("/unreadmsg", getAllUnreadMsgs);
// router.post("/updateUnreadMsg", incomingMsgsUpdate);

module.exports = router;
