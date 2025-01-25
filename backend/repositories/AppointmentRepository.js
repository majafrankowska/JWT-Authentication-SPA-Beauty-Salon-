const db = require("../config/db");

class AppointmentRepository {
    static async getAllAppointments() {
        try {
            const [rows] = await db.query(`
                SELECT 
                    a.id, 
                    a.date, 
                    a.notes, 
                    c.name AS client_name, 
                    e.name AS employee_name, 
                    s.name AS service_name, 
                    s.price AS service_price
                FROM appointments a
                JOIN clients c ON a.client_id = c.id
                JOIN employees e ON a.employee_id = e.id
                JOIN services s ON a.service_id = s.id
            `);
            return rows;
        } catch (error) {
            console.error("Error fetching all appointments:", error.message);
            throw new Error("Database error: Unable to fetch appointments.");
        }
    }

    static async getAppointmentById(id) {
        try {
            const [rows] = await db.query(`
                SELECT 
    a.id, 
    a.date, 
    a.notes, 
    a.client_id AS clientId, 
    a.employee_id AS employeeId, 
    a.service_id AS serviceId, 
    c.name AS client_name, 
    e.name AS employee_name, 
    s.name AS service_name, 
    s.price AS service_price
FROM appointments a
JOIN clients c ON a.client_id = c.id
JOIN employees e ON a.employee_id = e.id
JOIN services s ON a.service_id = s.id
WHERE a.id = ?;
            `, [id]);

            if (rows.length === 0) {
                return null;
            }

            return rows[0];
        } catch (error) {
            console.error(`Error fetching appointment with ID ${id}:`, error.message);
            throw new Error("Database error: Unable to fetch appointment.");
        }
    }

    static async getAppointmentsByUserId(userId) {
        try {
            const [rows] = await db.query(
                `SELECT 
                    a.id, 
                    a.date, 
                    a.notes, 
                    e.name AS employee_name, 
                    s.name AS service_name
                FROM appointments a
                JOIN employees e ON a.employee_id = e.id
                JOIN services s ON a.service_id = s.id
                WHERE a.client_id = ?`,
                [userId]
            );
            return rows;
        } catch (error) {
            console.error(`Error fetching appointments for user ${userId}:`, error.message);
            throw new Error("Database error: Unable to fetch user appointments.");
        }
    }

    static async getAppointmentsByClientId(clientId) {
        const query = `
            SELECT id, client_id AS clientId, employee_id AS employeeId, service_id AS serviceId, date, notes 
            FROM appointments WHERE client_id = ?`;
        const [rows] = await db.execute(query, [clientId]);
        return rows;
    }

    static async getAppointmentsByEmployeeId(employeeId) {
        const query = `
            SELECT id, client_id AS clientId, employee_id AS employeeId, service_id AS serviceId, date, notes 
            FROM appointments WHERE employee_id = ?`;
        const [rows] = await db.execute(query, [employeeId]);
        return rows;
    }


    static async createAppointment({ clientId, employeeId, serviceId, date, notes }) {
        try {
            const [result] = await db.query(
                "INSERT INTO appointments (client_id, employee_id, service_id, date, notes) VALUES (?, ?, ?, ?, ?)",
                [clientId, employeeId, serviceId, date, notes]
            );
            return { id: result.insertId, clientId, employeeId, serviceId, date, notes };
        } catch (error) {
            console.error("Error creating appointment:", error.message);
            throw new Error("Database error: Unable to create appointment.");
        }
    }

    static async updateAppointment(id, { clientId, employeeId, serviceId, date, notes }) {
        try {
            const [result] = await db.query(
                "UPDATE appointments SET client_id = ?, employee_id = ?, service_id = ?, date = ?, notes = ? WHERE id = ?",
                [clientId, employeeId, serviceId, date, notes, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error updating appointment with ID ${id}:`, error.message);
            throw new Error("Database error: Unable to update appointment.");
        }
    }

    static async deleteAppointment(appointmentId) {
        try {
            const [result] = await db.query("DELETE FROM appointments WHERE id = ?", [appointmentId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error deleting appointment with ID ${appointmentId}:`, error.message);
            throw new Error("Database error: Unable to delete appointment.");
        }
    }
}

module.exports = AppointmentRepository;