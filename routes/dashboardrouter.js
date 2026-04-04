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

//  all roles can view dashboard
router.get("/summary", verifyToken, roleCheck("admin", "analyst","viewer"), getSummary);
router.get("/category-totals", verifyToken, roleCheck("admin", "analyst", "viewer"), getCategoryTotals);
router.get("/monthly-trends", verifyToken, roleCheck("admin", "analyst", "viewer"), getMonthlyTrends);
router.get("/recent-activity", verifyToken, roleCheck("admin", "analyst", "viewer"), getRecentActivity);

module.exports = router;


