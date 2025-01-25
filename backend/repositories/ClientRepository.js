const db = require("../config/db");

class ClientRepository {
    static async createClient({ name, phone, address, userId }) {
        try {
            const [result] = await db.query(
                "INSERT INTO clients (name, phone, address, user_id) VALUES (?, ?, ?, ?)",
                [name, phone, address, userId]
            );
            return { id: result.insertId, name, phone, address, userId };
        } catch (error) {
            console.error("Error creating client:", error.message);
            throw new Error("Database error: Unable to create client.");
        }
    }

    static async getAllClients() {
        try {
            const [rows] = await db.query("SELECT * FROM clients");
            return rows;
        } catch (error) {
            console.error("Error fetching clients:", error.message);
            throw new Error("Database error: Unable to fetch clients.");
        }
    }

    static async getClientByUserId(userId) {
        const query = `SELECT * FROM clients WHERE user_id = ?`;
        const [rows] = await db.execute(query, [userId]);

        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    }

    static async getClientById(id) {
        try {
            const [rows] = await db.query("SELECT * FROM clients WHERE id = ?", [id]);
            if (rows.length === 0) {
                return null;
            }
            return rows[0];
        } catch (error) {
            console.error(`Error fetching client with ID ${id}:`, error.message);
            throw new Error("Database error: Unable to fetch client.");
        }
    }

    static async updateClient(id, { name, phone, address }) {
        try {
            const [result] = await db.query(
                "UPDATE clients SET name = ?, phone = ?, address = ? WHERE id = ?",
                [name, phone, address, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error updating client with ID ${id}:`, error.message);
            throw new Error("Database error: Unable to update client.");
        }
    }

    static async deleteClient(clientId) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [client] = await connection.query("SELECT user_id FROM clients WHERE id = ?", [clientId]);

            if (client.length === 0) {
                throw new Error("Client not found");
            }

            const userId = client[0].user_id;

            await connection.query("DELETE FROM appointments WHERE client_id = ?", [clientId]);

            const [result] = await connection.query("DELETE FROM clients WHERE id = ?", [clientId]);

            if (result.affectedRows > 0) {
                await connection.query("UPDATE users SET role = 'undefined' WHERE id = ?", [userId]);
            }

            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            console.error(`Error deleting client with ID ${clientId}:`, error.message);
            throw new Error("Database error: Unable to delete client.");
        } finally {
            connection.release();
        }
    }
}

module.exports = ClientRepository;