const db = require("../config/db");
const User = require("../models/User");

class UserRepository {
  static async create(username, email, password, role) {
    const [result] = await db.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, password, role]
    );

    const user = new User(
      result.insertId,
      username,
      email,
      password,
      role,
      new Date(),
      new Date()
    );
    return user;
  }

  static async createClient(userId) {
    await db.query(
      "INSERT INTO clients (user_id) VALUES (?)",
      [userId]
    );
  }

  static async createEmployee(userId) {
    await db.query(
      "INSERT INTO employees (user_id) VALUES (?)",
      [userId]
    );
  }

  static async getUserById(id) {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows.length ? rows[0] : null;
  }

  static async getUserByUsernameOrEmail(identifier) {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [identifier, identifier]
    );
    return rows.length ? rows[0] : null;
  }

  static async getUserByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return null;
    }

    return new User(
      rows[0].id,
      rows[0].username,
      rows[0].email,
      rows[0].password,
      rows[0].role,
      rows[0].created_at,
      rows[0].updated_at
    );
  }

  static async getUserByUsername(username) {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length === 0) {
      return null;
    }

    return new User(
      rows[0].id,
      rows[0].username,
      rows[0].email,
      rows[0].password,
      rows[0].role,
      rows[0].created_at,
      rows[0].updated_at
    );
  }

  static async getUserByUsernameOrEmail(identifier) {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [identifier, identifier]
    );

    if (rows.length === 0) {
      return null;
    }

    return new User(
      rows[0].id,
      rows[0].username,
      rows[0].email,
      rows[0].password,
      rows[0].role,
      rows[0].created_at,
      rows[0].updated_at
    );
  }

  static async getAllUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const [rows] = await db.query("SELECT * FROM users LIMIT ? OFFSET ?", [limit, offset]);

    return rows.map(row => new User(
      row.id,
      row.username,
      row.email,
      row.password,
      row.role,
      row.created_at,
      row.updated_at
    ));
  }

  static async getTotalUsersCount() {
    const [rows] = await db.query("SELECT COUNT(*) as count FROM users");
    return rows[0].count;
  }

  static async updateUser(userId, updates) {
    const fields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
      fields.push(`${key} = ?`);
      values.push(value);
    });

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    values.push(userId);

    const [result] = await db.query(sql, values);
    return result.affectedRows > 0;
  }

  static async deleteUser(userId) {
    try {
      const [userRows] = await db.query(`SELECT * FROM users WHERE id = ?`, [userId]);
      if (userRows.length === 0) {
        throw new Error('User not found');
      }

      await db.query(`DELETE FROM sessions WHERE user_id = ?`, [userId]);

      await db.query(`DELETE FROM appointments WHERE client_id = (SELECT id FROM clients WHERE user_id = ?)`, [userId]);
      await db.query(`DELETE FROM clients WHERE user_id = ?`, [userId]);

      await db.query(`DELETE FROM appointments WHERE employee_id = (SELECT id FROM employees WHERE user_id = ?)`, [userId]);
      await db.query(`DELETE FROM employee_services WHERE employee_id = (SELECT id FROM employees WHERE user_id = ?)`, [userId]);
      await db.query(`DELETE FROM employees WHERE user_id = ?`, [userId]);

      await db.query(`DELETE FROM users WHERE id = ?`, [userId]);

      return { success: true, message: "User deleted successfully" };
    } catch (error) {
      console.error("Error deleting user:", error.message);
      throw new Error("Failed to delete user");
    }
  }
}

module.exports = UserRepository;
