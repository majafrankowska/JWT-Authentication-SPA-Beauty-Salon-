const EmployeeService = require("../services/EmployeeServiceService");

class EmployeeServiceController {
    static async create(req, res) {
        try {
            const { employeeId, serviceId } = req.body;
            if (!employeeId || !serviceId) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const result = await EmployeeService.assignServiceToEmployee(employeeId, serviceId);
            res.status(201).json({
                message: "Service assigned successfully",
                data: result
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const result = await EmployeeService.getAllEmployeeServices();
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const result = await EmployeeService.getEmployeeServiceById(id);
            if (!result) {
                return res.status(404).json({ message: "Entry not found" });
            }
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await EmployeeService.removeEmployeeService(id);
            res.status(200).json({ message: "Deleted successfully" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = EmployeeServiceController;