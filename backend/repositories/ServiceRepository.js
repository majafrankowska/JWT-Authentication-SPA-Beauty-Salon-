const db = require("../config/db");

class ServiceRepository {
    static async getAllServices() {
        try {
            const [rows] = await db.query("SELECT * FROM services");
            return rows;
        } catch (error) {
            console.error("Error fetching services:", error.message);
            throw new Error("Database error: Unable to fetch services.");
        }
    }

    static async getServiceById(id) {
        try {
            const [rows] = await db.query("SELECT * FROM services WHERE id = ?", [id]);
            if (rows.length === 0) {
                return null;
            }
            return rows[0];
        } catch (error) {
            console.error(`Error fetching service with ID ${id}:`, error.message);
            throw new Error("Database error: Unable to fetch service.");
        }
    }

    static async createService({ name, price, duration, description }) {
        try {
            const [result] = await db.query(
                "INSERT INTO services (name, price, duration, description) VALUES (?, ?, ?, ?)",
                [name, price, duration, description]
            );
            return { id: result.insertId, name, price, duration, description };
        } catch (error) {
            console.error("Error creating service:", error.message);
            throw new Error("Database error: Unable to create service.");
        }
    }

    static async updateService(id, { name, price, duration, description }) {
        try {
            const [result] = await db.query(
                "UPDATE services SET name = ?, price = ?, duration = ?, description = ? WHERE id = ?",
                [name, price, duration, description, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error updating service with ID ${id}:`, error.message);
            throw new Error("Database error: Unable to update service.");
        }
    }

    static async deleteService(id) {
        try {
            const [result] = await db.query("DELETE FROM services WHERE id = ?", [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error deleting service with ID ${id}:`, error.message);
            throw new Error("Database error: Unable to delete service.");
        }
    }
}

module.exports = ServiceRepository;