const pool = require('../config/db');

const createUser = async (email, password, firstName, lastName) => {
  const result = await pool.query(
    `INSERT INTO users (email, password, first_name, last_name, balance) VALUES ($1, $2, $3, $4, 50000) RETURNING *`,
    [email, password, firstName, lastName]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  return result.rows[0];
};

const getUserById = async (id) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result.rows[0];
};

const transferFunds = async (senderId, recipientEmail, amount) => {
  await pool.query('BEGIN');

  try {
    const senderResult = await pool.query('SELECT balance FROM users WHERE id = $1', [senderId]);
    if (senderResult.rows[0].balance < amount) {
      throw new Error('Insufficient funds');
    }

    const recipientResult = await pool.query('SELECT * FROM users WHERE email = $1', [recipientEmail]);
    if (recipientResult.rows.length === 0) {
      throw new Error('Recipient not found');
    }

    const recipientId = recipientResult.rows[0].id;

    await pool.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [amount, senderId]);
    await pool.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [amount, recipientId]);

    await pool.query('COMMIT');
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }
};

module.exports = { createUser, findUserByEmail, getUserById, transferFunds };
