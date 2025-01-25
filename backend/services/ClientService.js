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
        this._checkAccess(user, ["admin"]);

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

    // static async getClientByUserId(user, userId) {
    //     if (user.role !== "admin" && user.userId !== parseInt(userId, 10)) {
    //         throw new UnauthorizedError("You can only view your own data.");
    //     }

    //     const client = await ClientRepository.getClientByUserId(userId);
    //     if (!client) {
    //         throw new NotFoundError("Client not found.");
    //     }

    //     return client;
    // }

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


    static async updateClient(user, id, data) {
        this._checkAccess(user, ["admin"]);

        if (user.role !== "admin" && user.userId !== id) {
            throw new UnauthorizedError("You can only update your own data.");
        }

        const updated = await ClientRepository.updateClient(id, data);
        if (!updated) {
            throw new NotFoundError("Client not found.");
        }
        return updated;
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