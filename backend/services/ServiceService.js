const ServiceRepository = require("../repositories/ServiceRepository");
const db = require("../config/db");
const { UnauthorizedError, NotFoundError } = require("../errors/CustomError");

class ServiceService {

    static _checkAccess(user, allowedRoles) {
        if (!user) {
            throw new UnauthorizedError("User not authenticated.");
        }
        if (!allowedRoles.includes(user.role)) {
            throw new UnauthorizedError("Access denied.");
        }
    }

    static async getAllServices() {
        const query = `SELECT * FROM services`;

        try {
            const [rows] = await db.execute(query);

            console.log("Fetched services:", rows);

            return { services: rows };
        } catch (error) {
            console.error("Error fetching services:", error);
            throw new Error("Failed to fetch services");
        }
    }

    static async getServiceById(id) {
        const service = await ServiceRepository.getServiceById(id);
        if (!service) {
            throw new NotFoundError("Service not found");
        }
        return service;
    }

    static async getServicesByPrice(user, minPrice, maxPrice) {

        const query = `SELECT * FROM services WHERE price BETWEEN ? AND ?`;
        const [rows] = await db.execute(query, [minPrice, maxPrice]);

        if (rows.length === 0) {
            throw new NotFoundError("No services found in this price range.");
        }
        return rows;
    }

    static async getServicesByDuration(user, duration) {

        const query = `SELECT * FROM services WHERE duration <= ?`;
        const [rows] = await db.execute(query, [duration]);

        if (rows.length === 0) {
            throw new NotFoundError("No services found within this duration.");
        }
        return rows;
    }

    static async createService(user, data) {
        this._checkAccess(user, ["admin"]);
        return await ServiceRepository.createService(data);
    }

    static async updateService(user, id, data) {
        this._checkAccess(user, ["admin"]);
        const updated = await ServiceRepository.updateService(id, data);
        if (!updated) {
            throw new NotFoundError("Service not found");
        }
        return updated;
    }

    static async deleteService(user, id) {
        this._checkAccess(user, ["admin"]);
        const deleted = await ServiceRepository.deleteService(id);
        if (!deleted) {
            throw new NotFoundError("Service not found");
        }
        return true;
    }

}

module.exports = ServiceService;