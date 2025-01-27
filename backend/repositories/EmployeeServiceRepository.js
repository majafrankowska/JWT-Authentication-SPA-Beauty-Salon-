const db = require("../config/db");

class EmployeeServiceRepository {
    static async getAll() {
        const [rows] = await db.query("SELECT * FROM employee_services");
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query(
            "SELECT * FROM employee_services WHERE id = ?",
            [id]
        );
        return rows[0];
    }

    static async assignServiceToEmployee(employeeId, serviceId) {

        const [existing] = await db.query(
            "SELECT * FROM employee_services WHERE employee_id = ? AND service_id = ?",
            [employeeId, serviceId]
        );
        if (existing.length > 0) {
            throw new Error("This service is already assigned to the employee.");
        }
        const [result] = await db.query(
            "INSERT INTO employee_services (employee_id, service_id) VALUES (?, ?)",
            [employeeId, serviceId]
        );
        
        return { id: result.insertId, employeeId, serviceId };
    }

    static async removeService(employeeServiceId) {
        const [result] = await db.query(
            "DELETE FROM employee_services WHERE id = ?",
            [employeeServiceId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = EmployeeServiceRepository;