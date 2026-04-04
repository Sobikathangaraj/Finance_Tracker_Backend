const Transaction = require("../model/transactionmodel");

// GET dashboard summary
const getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ isDeleted: false });

    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpense;

    res.status(200).json({
      result: { totalIncome, totalExpense, netBalance },
      message: "Summary fetched successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET category wise totals
const getCategoryTotals = async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } }
    ]);

    res.status(200).json({ result: data, message: "Category totals fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET monthly trends
const getMonthlyTrends = async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type"
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    res.status(200).json({ result: data, message: "Monthly trends fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET recent transactions
const getRecentActivity = async (req, res) => {
  try {
    const data = await Transaction.find({ isDeleted: false })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({ result: data, message: "Recent activity fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSummary, getCategoryTotals, getMonthlyTrends, getRecentActivity };
