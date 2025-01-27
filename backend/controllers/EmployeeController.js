const EmployeeService = require("../services/EmployeeService");
const EmployeeDto = require('../dtos/EmployeeDto');


class EmployeeController {

    static async getAll(req, res, next) {
        const { page = 1, limit = 20 } = req.query;

        try {
            const { employees, totalPages } = await EmployeeService.getAllEmployees(req.user, page, limit);

            const employeeDtos = employees.map(employee => new EmployeeDto(employee));

            res.status(200).json({ employees: employeeDtos, totalPages });
        } catch (error) {
            next(error);
        }
    }

    static async getByUserId(req, res, next) {
        try {
            const { userId } = req.params;
            const user = req.user;

            const employee = await EmployeeService.getEmployeeByUserId(user, userId);

            if (!employee) {
                return res.status(404).json({ message: "Employee not found" });
            }

            res.status(200).json(employee);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const employee = await EmployeeService.getEmployeeById(req.user, id);
            res.status(200).json(new EmployeeDto(employee));
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const employee = await EmployeeService.createEmployee(req.user, req.body);
            res.status(201).json(new EmployeeDto(employee));
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const employee = await EmployeeService.updateEmployee(req.user, req.params.id, req.body);
            res.status(200).json(new EmployeeDto(employee));
        } catch (error) {
            next(error);
        }
    }


    static async delete(req, res, next) {
        try {
            await EmployeeService.deleteEmployee(req.user, req.params.id);
            res.status(200).json({ message: "Employee deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = EmployeeController;


