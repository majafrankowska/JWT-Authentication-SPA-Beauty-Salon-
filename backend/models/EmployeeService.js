const db = require("../config/db");

class EmployeeService {
    static async create(employeeId, serviceId) {
        const query = `INSERT INTO employee_services (employee_id, service_id) VALUES (?, ?)`;
        const [result] = await db.execute(query, [employeeId, serviceId]);
        return result;
    }

    static async getAll() {
        const query = `SELECT * FROM employee_services`;
        const [rows] = await db.execute(query);
        return rows;
    }

    static async getById(id) {
        const query = `SELECT * FROM employee_services WHERE id = ?`;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async delete(id) {
        const query = `DELETE FROM employee_services WHERE id = ?`;
        const [result] = await db.execute(query, [id]);
        return result;
    }
}

module.exports = EmployeeService;

