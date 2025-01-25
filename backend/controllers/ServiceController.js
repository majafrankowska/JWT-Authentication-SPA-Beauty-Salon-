const ServiceService = require("../services/ServiceService");
const ServiceDto = require("../dtos/ServiceDto");

class ServiceController {
    // static async index(req, res, next) {
    //     const { page = 1, limit = 20 } = req.query;

    //     try {
    //         const { services, totalPages } = await ServiceService.getAllServices(req.user, page, limit);
    //         const serviceDtos = services.map((service) => new ServiceDto(service));
    //         res.status(200).json({ services: serviceDtos, totalPages });
    //     } catch (err) {
    //         next(err);
    //     }
    // }

    // static async show(req, res, next) {
    //     try {
    //         const { id } = req.params;
    //         const service = await ServiceService.getServiceById(req.user, id);
    //         if (!service) {
    //             return res.status(404).json({ message: "Service not found" });
    //         }
    //         res.status(200).json(new ServiceDto(service));
    //     } catch (err) {
    //         next(err);
    //     }
    // }

    static async getAll(req, res, next) {
        const { page = 1, limit = 20 } = req.query;

        try {
            const { services, totalPages } = await ServiceService.getAllServices(req.user, page, limit);
            const serviceDtos = services.map((service) => new ServiceDto(service));
            res.status(200).json({ services: serviceDtos, totalPages });
        } catch (err) {
            next(err);
        }
    }

    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const service = await ServiceService.getServiceById(id);
            if (!service) {
                return res.status(404).json({ message: "Service not found" });
            }
            res.status(200).json(new ServiceDto(service));
        } catch (err) {
            next(err);
        }
    }

    static async create(req, res, next) {
        try {
            const newService = await ServiceService.createService(req.user, req.body);
            res.status(201).json(new ServiceDto(newService));
        } catch (err) {
            next(err);
        }
    }

    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const updated = await ServiceService.updateService(req.user, id, req.body);
            if (!updated) {
                return res.status(404).json({ message: "Service not found" });
            }
            res.status(200).json({ message: "Service updated successfully" });
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await ServiceService.deleteService(req.user, id);
            if (!deleted) {
                return res.status(404).json({ message: "Service not found" });
            }
            res.status(200).json({ message: "Service deleted successfully" });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ServiceController;