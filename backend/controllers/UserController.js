const UserService = require("../services/UserService");
const { NotFoundError, ValidationError } = require("../errors/CustomError");


class UserController {
static async index(req, res, next) {
    const { page = 1, limit = 20 } = req.query;

    try {
      const { users, totalPages } = await UserService.getAllUsers(page, limit);
      res.status(200).json({ users, totalPages });
    } catch (err) {
      next(err);
    }
  }


  static async create(req, res, next) {
    const { username, email, password, role } = req.body;

    try {
      const newUser = await UserService.createUser(username, email, password, role);
      res.status(201).json({ message: "User created successfully", newUser });
    } catch (err) {
      next(err);
    }
  }

  static async show(req, res, next) {
    const { id } = req.params;

    try {
      const user = await UserService.getUserById(id);
      if (!user) {
        throw new NotFoundError("User not found");
      }
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;
    const updates = req.body;

    try {
      const updatedUser = await UserService.updateUser(id, updates);
      if (!updatedUser) {
        throw new NotFoundError("User not found");
      }
      res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    const { id } = req.params;

    try {
      const deleted = await UserService.deleteUser(id);
      if (!deleted) {
        throw new NotFoundError("User not found");
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
