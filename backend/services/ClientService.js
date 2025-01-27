const ClientRepository = require("../repositories/ClientRepository");
const db = require("../config/db");
const { UnauthorizedError, NotFoundError } = require("../errors/CustomError");

class ClientService {
    static _checkAccess(user, allowedRoles) {
        if (!allowedRoles.includes(user.role)) {
            throw new UnauthorizedError("Access denied.");
        }
    }

    static async createClient(user, data) {
        this._checkAccess(user, ["admin"]);
        return await ClientRepository.createClient(data);
    }

    static async getAllClients(user, page, limit) {
        if (!user || !user.role) {
            throw new UnauthorizedError("User authentication required.");
        }

        if (!["admin", "employee"].includes(user.role)) {
            throw new UnauthorizedError("Access denied. Only admins and employees are allowed.");
        }

        const offset = (page - 1) * limit;
        const query = `SELECT * FROM clients LIMIT ? OFFSET ?`;
        const countQuery = `SELECT COUNT(*) AS total FROM clients`;

        const [rows] = await db.execute(query, [parseInt(limit), parseInt(offset)]);
        const [countResult] = await db.execute(countQuery);

        if (rows.length === 0) {
            throw new NotFoundError("No clients found.");
        }

        return { clients: rows, totalPages: Math.ceil(countResult[0].total / limit) };
    }

    static async getClientById(user, id) {
        if (user.role !== "admin" && user.userId !== id) {
            throw new UnauthorizedError("You can only view your own data.");
        }

        const client = await ClientRepository.getClientById(id);
        if (!client) {
            throw new NotFoundError("Client not found.");
        }

        return client;
    }



    static async getClientByUserId(user, userId) {
        if (user.role !== "admin" && user.userId !== parseInt(userId, 10)) {
            throw new UnauthorizedError("You can only view your own data.");
        }

        const client = await ClientRepository.getClientByUserId(userId);
        if (!client) {
            throw new NotFoundError("Client not found.");
        }

        return client;
    }

    static async updateClient(user, userId, data) {
        console.log("Updating client with:", { user, userId, data });

        if (!user) {
            console.error("Unauthorized: No user found in request");
            throw new UnauthorizedError("Unauthorized: No user found in request");
        }

        console.log("User details:", { userIdFromToken: user.userId, role: user.role });

        const targetUserId = data.user_id;

        if (user.role !== "admin" && user.userId !== parseInt(targetUserId, 10)) {
            console.error(`Authorization failed. User ID: ${user.userId}, Role: ${user.role}, Target ID: ${targetUserId}`);
            throw new UnauthorizedError("You can only update your own data.");
        }

        console.log("Authorization successful, proceeding to update...");

        try {
            const updated = await ClientRepository.updateClient(targetUserId, data);
            if (!updated) {
                console.error(`Client with ID ${targetUserId} not found.`);
                throw new NotFoundError("Client not found.");
            }
            console.log(`Client with ID ${targetUserId} updated successfully.`);
            return updated;
        } catch (error) {
            console.error("Error updating client:", error);
            throw new Error("Internal server error occurred while updating client.");
        }
    }


    static async deleteClient(user, id) {
        if (user.role !== "admin" && user.userId !== id) {
            throw new UnauthorizedError("You can only delete your own account.");
        }

        const deleted = await ClientRepository.deleteClient(id);
        if (!deleted) {
            throw new NotFoundError("Client not found.");
        }

        return { message: "Client deleted successfully" };
    }
}

module.exports = ClientService;