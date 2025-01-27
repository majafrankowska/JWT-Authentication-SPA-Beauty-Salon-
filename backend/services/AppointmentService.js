const AppointmentRepository = require("../repositories/AppointmentRepository");
const ClientRepository = require("../repositories/ClientRepository");
const EmployeeRepository = require("../repositories/EmployeeRepository");
const ServiceRepository = require("../repositories/ServiceRepository");
const db = require("../config/db");
const { UnauthorizedError, NotFoundError } = require("../errors/CustomError");
const AppointmentDto = require("../dtos/AppointmentDto");

class AppointmentService {

    static _checkAccess(user, allowedRoles) {
        if (!allowedRoles.includes(user.role)) {
            throw new UnauthorizedError("Access denied.");
        }
    }

    static async getAllAppointments(user, page=1, limit=10) {
        this._checkAccess(user, ["admin", "employee"]);

        const offset = (page - 1) * limit;
        const query = `
        SELECT
         id,
         client_id AS clientId,
         employee_id AS employeeId,
         service_id AS serviceId,
         date,
         notes
        FROM appointments LIMIT ?, ?`;    

        const [rows] = await db.execute(query, [offset, parseInt(limit)]);

        const countQuery = `SELECT COUNT(*) as count FROM appointments`;
        const [countResult] = await db.execute(countQuery);

        return { appointments: rows, totalPages: Math.ceil(countResult[0].count / limit) };
    }

    static async getAppointmentById(user, appointmentId) {
        const appointment = await AppointmentRepository.getAppointmentById(appointmentId);
        if (!appointment) {
            throw new NotFoundError("Appointment not found");
        }

        if (user.role === "client" && appointment.clientId !== user.userId) {
            throw new UnauthorizedError("You can only access your own appointment.");
        }

        return new AppointmentDto(appointment);
    }

    static async getAppointmentsByClient(user, clientId) {
        const client = await ClientRepository.getClientByUserId(user.userId);
        if (!client) {
            throw new NotFoundError("Client profile not found for this user.");
        }

        if (client.id !== clientId) {
            throw new UnauthorizedError("You can only view your own appointments.");
        }

        const appointments = await AppointmentRepository.getAppointmentsByClientId(clientId);
        if (!appointments.length) {
            throw new NotFoundError("No appointments found for this client.");
        }

        return appointments.map(app => new AppointmentDto(app));
    }


    static async getAppointmentsByEmployee(user, employeeId) {
        const employee = await EmployeeRepository.getEmployeeByUserId(user.userId);
        if (!employee) {
            throw new NotFoundError("Employee profile not found for this user.");
        }

        if (employee.id !== employeeId) {
            throw new UnauthorizedError("You can only view your own appointments.");
        }

        const appointments = await AppointmentRepository.getAppointmentsByEmployeeId(employeeId);
        if (!appointments.length) {
            throw new NotFoundError("No appointments found for this employee.");
        }

        return appointments.map(app => new AppointmentDto(app));
    }

    static async createAppointment(user, data) {
        this._checkAccess(user, ["admin", "client"]);

        const { clientId, employeeId, serviceId, date, notes } = data;
        const client = await ClientRepository.getClientById(clientId);
        const employee = await EmployeeRepository.getEmployeeById(employeeId);
        const service = await ServiceRepository.getServiceById(serviceId);

        if (!client || !employee || !service) {
            throw new NotFoundError("Invalid client, employee, or service ID.");
        }

        return await AppointmentRepository.createAppointment(data);
    }

    static async updateAppointment(user, id, data) {
        this._checkAccess(user, ["admin", "client"]);

        if (user.role === "client") {
            const appointment = await AppointmentRepository.getAppointmentById(id);
            if (appointment.clientId !== user.userId) {
                throw new UnauthorizedError("You can only modify your own appointments.");
            }
        }

        const updated = await AppointmentRepository.updateAppointment(id, data);
        if (!updated) {
            throw new NotFoundError("Appointment not found");
        }
        return updated;
    }

    static async deleteAppointment(user, appointmentId, clientId) {
        this._checkAccess(user, ["admin", "client"]);

        console.log("Deleting appointment:", appointmentId);
        console.log("Authenticated user:", user);
        console.log("Client ID from request:", clientId);

        const deleted = await AppointmentRepository.deleteAppointment(appointmentId);
        if (!deleted) {
            throw new NotFoundError("Appointment not found.");
        }

        console.log(`Appointment ${appointmentId} deleted successfully.`);
        return true;
    }

    static async getAppointmentsByUser(userId) {
        if (!userId) {
            throw new Error("User ID is required");
        }

        const query = `
        SELECT 
            id, 
            client_id AS clientId, 
            employee_id AS employeeId, 
            service_id AS serviceId, 
            date, 
            notes 
        FROM appointments 
        WHERE client_id = ? OR employee_id = ?`;

        const [appointments] = await db.execute(query, [userId, userId]);

        if (!appointments.length) {
            throw new NotFoundError("No appointments found for the specified user.");
        }

        return appointments.map(app => new AppointmentDto(app));
    }
}

module.exports = AppointmentService;

