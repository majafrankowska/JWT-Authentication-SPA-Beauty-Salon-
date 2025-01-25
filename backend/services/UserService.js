const userRepository = require("../repositories/UserRepository");
const db = require("../config/db");
const bcrypt = require("bcryptjs");

const UserDto = require("../dtos/UserDto");
const { NotFoundError, UnauthorizedError, ValidationError } = require("../errors/CustomError");
const AppointmentService = require("./AppointmentService");
const SessionRepository = require("../repositories/SessionRepository");

class UserService {
  static async getAllUsers(page = 1, limit = 10) {
    const users = await userRepository.getAllUsers(page, limit);
    const totalUsers = await userRepository.getTotalUsersCount();

    const usersDtos = users.map((user) => new UserDto(user, user.role, []));

    return {
      users,
      usersDtos,
      totalPages: Math.ceil(totalUsers / limit),
    };
  }

  static async getUserByUsername(username) {
    const user = await userRepository.getUserByUsername(username);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return new UserDto(user, user.role, []);
  }


  static async getUserByEmailOrUsername(identifier) {
    return await UserRepository.getUserByUsernameOrEmail(identifier);
  }


  static async createUser(username, email, password, role) {
    const existingUser = await userRepository.getUserByUsernameOrEmail(username);
    if (existingUser) {
      throw new ValidationError("User with this username or email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.create(username, email, hashedPassword, role);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  static async getUserById(id) {
    if (!id) {
      throw new Error("User ID is required");
    }

    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  static async updateUser(username, updates) {
    const user = await userRepository.getUserById(username);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await userRepository.updateUser(user.id, updates);
    return updatedUser;
  }

  static async deleteUser(userId) {
    try {
      const [userRows] = await db.query(`SELECT * FROM users WHERE id = ?`, [userId]);
      if (userRows.length === 0) {
        throw new Error('User not found');
      }

      await db.query(`DELETE FROM users WHERE id = ?`, [userId]);

      return { success: true, message: "User deleted successfully" };
    } catch (error) {
      console.error("Error deleting user:", error.message);
      throw new Error("Failed to delete user");
    }
  }

  
}

module.exports = UserService;