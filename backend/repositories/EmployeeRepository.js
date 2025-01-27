const db = require("../config/db");

class EmployeeRepository {

    static async getAllEmployees() {
        try {
            const [rows] = await db.query("SELECT * FROM employees");
            return rows;
        } catch (error) {
            console.error("Error fetching employees:", error.message);
            throw new Error("Database error: Unable to fetch employees.");
        }
    }

    static async getEmployeeById(id) {
        try {
            const [rows] = await db.query("SELECT * FROM employees WHERE id = ?", [id]);
            return rows.length ? rows[0] : null;
        } catch (error) {
            throw new Error("Database error: Unable to fetch employee.");
        }
    }

    static async getEmployeeByUserId(userId) {
            const query = `SELECT * FROM employees WHERE user_id = ?`;
            const [rows] = await db.execute(query, [userId]);
    
            if (rows.length === 0) {
                return null;
            }
            return rows[0];
        }

    static async createEmployee({ name, phone, specialisation, userId }) {
        try {
            const [result] = await db.query(
                "INSERT INTO employees (name, phone, specialisation, user_id) VALUES (?, ?, ?, ?)",
                [name, phone, specialisation, userId]
            );
            return { id: result.insertId, name, phone, specialisation, userId };
        } catch (error) {
            throw new Error("Database error: Unable to create employee.");
        }
    }

    static async updateEmployee(id, { name, phone, specialisation }) {
        try {
            const [result] = await db.query(
                "UPDATE employees SET name = ?,   phone = ?, specialisation = ? WHERE id = ?",
                [name,  phone, specialisation, id]
            );

            if (result.affectedRows === 0) {
                return null;
            }

            const [updatedEmployee] = await db.query("SELECT * FROM employees WHERE id = ?", [id]);

            return updatedEmployee.length ? updatedEmployee[0] : null;
        } catch (error) {
            console.error(`Error updating employee with ID ${id}:`, error.message);
            throw new Error("Database error: Unable to update employee.");
        }
    }

    static async deleteEmployee(employeeId) {
        try {
            await db.query("DELETE FROM employees WHERE id = ?", [employeeId]);
            return true;
        } catch (error) {
            throw new Error("Database error: Unable to delete employee.");
        }
    }
}

module.exports = EmployeeRepository;

































//     static async getEmployeeById(id) {
//         try {
//             const [rows] = await db.query("SELECT * FROM employees WHERE id = ?", [id]);
//             if (rows.length === 0) {
//                 return null;
//             }
//             return rows[0];
//         } catch (error) {
//             console.error(`Error fetching employee with ID ${id}:`, error.message);
//             throw new Error("Database error: Unable to fetch employee.");
//         }
//     }

//     static async createEmployee({ name, email, phone, role, userId }) {
//         try {
//             const [result] = await db.query(
//                 "INSERT INTO employees (name, email, phone, role, user_id) VALUES (?, ?, ?, ?, ?)",
//                 [name, email, phone, role, userId]
//             );
//             return { id: result.insertId, name, email, phone, role, userId };
//         } catch (error) {
//             console.error("Error creating employee:", error.message);
//             throw new Error("Database error: Unable to create employee.");
//         }
//     }

//     static async updateEmployee(id, { name, email, phone, role }) {
//         try {
//             const [result] = await db.query(
//                 "UPDATE employees SET name = ?, email = ?, phone = ?, role = ? WHERE id = ?",
//                 [name, email, phone, role, id]
//             );
//             return result.affectedRows > 0;
//         } catch (error) {
//             console.error(`Error updating employee with ID ${id}:`, error.message);
//             throw new Error("Database error: Unable to update employee.");
//         }
//     }

//     static async deleteEmployee(employeeId) {
//         const connection = await db.getConnection();
//         try {
//             await connection.beginTransaction();

//             const [employee] = await connection.query(
//                 "SELECT user_id FROM employees WHERE id = ?",
//                 [employeeId]
//             );

//             if (employee.length === 0) {
//                 throw new Error("Employee not found.");
//             }

//             const userId = employee[0].user_id;

//             await connection.query("DELETE FROM employee_services WHERE employee_id = ?", [employeeId]);

//             const [result] = await connection.query("DELETE FROM employees WHERE id = ?", [employeeId]);

//             if (result.affectedRows > 0) {
//                 await connection.query("UPDATE users SET role = 'undefined' WHERE id = ?", [userId]);
//             }

//             await connection.commit();
//             return result.affectedRows > 0;
//         } catch (error) {
//             await connection.rollback();
//             console.error(`Error deleting employee with ID ${employeeId}:`, error.message);
//             throw new Error("Database error: Unable to delete employee.");
//         } finally {
//             connection.release();
//         }
//     }
// }

// module.exports = EmployeeRepository;