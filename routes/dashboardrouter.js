var express = require("express");
var router = express.Router();
var {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentActivity
} = require("../controller/dashboardcontroller");
var verifyToken = require("../middleware/auth");
var roleCheck = require("../middleware/rolecheck");

// admin + analyst only
router.get("/summary", verifyToken, roleCheck("admin", "analyst"), getSummary);
router.get("/category-totals", verifyToken, roleCheck("admin", "analyst"), getCategoryTotals);
router.get("/monthly-trends", verifyToken, roleCheck("admin", "analyst"), getMonthlyTrends);
router.get("/recent-activity", verifyToken, roleCheck("admin", "analyst"), getRecentActivity);

module.exports = router;