var express = require("express");
var router = express.Router();
var { getAllUsers, getUserById, updateUser, deleteUser } = require("../controller/usercontroller");
var verifyToken = require("../middleware/auth");
var roleCheck = require("../middleware/rolecheck");

// only admin can manage users
router.get("/getdata", verifyToken, roleCheck("admin"), getAllUsers);
router.get("/getdata/:id", verifyToken, roleCheck("admin"), getUserById);
router.put("/updatedata/:id", verifyToken, roleCheck("admin"), updateUser);
router.delete("/deletedata/:id", verifyToken, roleCheck("admin"), deleteUser);

module.exports = router; 