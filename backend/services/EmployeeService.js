const EmployeeRepository = require("../repositories/EmployeeRepository");
const db = require("../config/db");
const { UnauthorizedError, NotFoundError } = require("../errors/CustomError");


class EmployeeService {

    static _checkAccess(user, allowedRoles) {
        if (!allowedRoles.includes(user.role)) {
            throw new UnauthorizedError("Access denied.");
        }
    }

    static async getAllEmployees(user, page, limit) {
        this._checkAccess(user, ["admin", "employee", "client"]);

        const offset = (page - 1) * limit;
        const query = `SELECT * FROM employees LIMIT ? OFFSET ?`;
        const countQuery = `SELECT COUNT(*) AS total FROM employees`;

        const [rows] = await db.execute(query, [parseInt(limit), parseInt(offset)]);
        const [countResult] = await db.execute(countQuery);
        const totalPages = Math.ceil(countResult[0].total / limit);

        if (rows.length === 0) {
            throw new NotFoundError("No employees found.");
        }

        return { employees: rows, totalPages };
    }

    static async getEmployeeById(user, id) {
        this._checkAccess(user, ["admin", "employee"]);

        const employee = await EmployeeRepository.getEmployeeById(id);
        if (!employee) {
            throw new NotFoundError("Employee not found");
        }
        return employee;
    }

    static async getEmployeeByUserId(user, userId) {
        if (user.role !== "admin" && user.userId !== parseInt(userId, 10)) {
            throw new UnauthorizedError("You can only view your own data.");
        }

        const employee = await EmployeeRepository.getEmployeeByUserId(userId);
        if (!employee) {
            throw new NotFoundError("Employee not found.");
        }

        return employee;
    }


    static async createEmployee(user, data) {
        this._checkAccess(user, ["admin"]);
        return await EmployeeRepository.createEmployee(data);
    }

    static async updateEmployee(user, id, data) {
        this._checkAccess(user, ["admin", "employee"]);

        const updated = await EmployeeRepository.updateEmployee(id, data);
        if (!updated) {
            throw new NotFoundError("Employee not found or not updated");
        }
        return updated;
    }

    static async deleteEmployee(user, id) {
        this._checkAccess(user, ["admin"]);

        const deleted = await EmployeeRepository.deleteEmployee(id);
        if (!deleted) {
            throw new NotFoundError("Employee not found");
        }
        return { message: "Employee deleted successfully" };
    }
}

module.exports = EmployeeService;


