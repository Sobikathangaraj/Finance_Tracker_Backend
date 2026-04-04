var express = require("express");
var router = express.Router();
var {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} = require("../controller/transactioncontroller");
var verifyToken = require("../middleware/auth");
var roleCheck = require("../middleware/rolecheck");

// admin only → create, update, delete
router.post("/postdata", verifyToken, roleCheck("admin"), createTransaction);
router.put("/updatedata/:id", verifyToken, roleCheck("admin"), updateTransaction);
router.delete("/deletedata/:id", verifyToken, roleCheck("admin"), deleteTransaction);

// admin + analyst + viewer → read
router.get("/getdata", verifyToken, roleCheck("admin", "analyst"), getAllTransactions);
router.get("/getdata/:id", verifyToken, roleCheck("admin", "analyst"), getTransactionById);

module.exports = router;

