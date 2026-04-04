const Transaction = require("../model/transactionmodel");

// CREATE transaction (admin only)
const createTransaction = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({ message: "Amount, type and category are required" });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      amount,
      type,
      category,
      date: date || Date.now(),
      notes
    });

    res.status(201).json({ result: transaction, message: "Transaction created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all transactions with filter + search + pagination
const getAllTransactions = async (req, res) => {
  try {
    const { type, category, search, page = 1, limit = 10 } = req.query;

    const filter = { isDeleted: false };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (search) filter.notes = { $regex: search, $options: "i" };

    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .populate("user", "name email")
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      result: transactions,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      message: "Transactions fetched successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single transaction
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      isDeleted: false
    }).populate("user", "name email");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ result: transaction, message: "Transaction fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE transaction (admin only)
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ result: transaction, message: "Transaction updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SOFT DELETE transaction (admin only)
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
};