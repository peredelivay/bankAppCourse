const { getUserById, transferFunds } = require('../models/userModel');

const getProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

const transfer = async (req, res) => {
  const { recipientEmail, amount } = req.body;

  try {
    await transferFunds(req.user.id, recipientEmail, amount);
    res.status(200).json({ message: 'Transfer successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, transfer };
