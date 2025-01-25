const EmployeeServiceRepository = require("../repositories/EmployeeServiceRepository");
const { NotFoundError, UnauthorizedError } = require("../errors/CustomError");

class EmployeeServiceService {
    static async getAllEmployeeServices() {
        return await EmployeeServiceRepository.getAll();
    }

    static async getEmployeeServiceById(id) {
        const service = await EmployeeServiceRepository.getById(id);
        if (!service) {
            throw new NotFoundError("Employee service not found.");
        }
        return service;
    }

    static async assignServiceToEmployee(employeeId, serviceId) {
        return await EmployeeServiceRepository.assignServiceToEmployee(employeeId, serviceId);
    }

    static async removeEmployeeService(id) {
        const deleted = await EmployeeServiceRepository.removeService(id);
        if (!deleted) {
            throw new NotFoundError("Employee service not found.");
        }
        return { message: "Employee service deleted successfully." };
    }
}

module.exports = EmployeeServiceService;