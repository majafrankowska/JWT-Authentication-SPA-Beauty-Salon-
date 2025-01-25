const AppointmentService = require("../services/AppointmentService");
const AppointmentDto = require("../dtos/AppointmentDto");

class AppointmentController {

    static async getAll(req, res, next) {
        const { page = 1, limit = 20 } = req.query;

        try {
            const { appointments, totalPages } = await AppointmentService.getAllAppointments(req.user, page, limit);
            const appointmentDtos = appointments.map((appointment) => new AppointmentDto(appointment));
            res.status(200).json({ appointments: appointmentDtos, totalPages });
        } catch (err) {
            next(err);
        }
    }

    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const appointment = await AppointmentService.getAppointmentById(req.user, id);
            if (!appointment) {
                return res.status(404).json({ message: "Appointment not found" });
            }
            res.status(200).json(new AppointmentDto(appointment));
        } catch (err) {
            next(err);
        }
    }

    static async getByClient(req, res, next) {
        try {
            const clientId = parseInt(req.params.clientId);
            console.log("Requesting client appointments for:", clientId);
            console.log("Authenticated user:", req.user);

            const appointments = await AppointmentService.getAppointmentsByClient(req.user, clientId);
            res.status(200).json({ appointments });
        } catch (err) {
            console.error("Error in getByClient:", err.message);
            next(err);
        }
    }


    static async getByEmployee(req, res, next) {
        try {
            const employeeId = parseInt(req.params.employeeId);
            const appointments = await AppointmentService.getAppointmentsByEmployee(req.user, employeeId);
            res.status(200).json({ appointments });
        } catch (err) {
            next(err);
        }
    }


    static async create(req, res, next) {
        try {
            const newAppointment = await AppointmentService.createAppointment(req.user, req.body);
            res.status(201).json(new AppointmentDto(newAppointment));
        } catch (err) {
            next(err);
        }
    }

    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const updated = await AppointmentService.updateAppointment(req.user, id, req.body);
            if (!updated) {
                return res.status(404).json({ message: "Appointment not found" });
            }
            res.status(200).json({ message: "Appointment updated successfully" });
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await AppointmentService.deleteAppointment(req.user, id);
            if (!deleted) {
                return res.status(404).json({ message: "Appointment not found" });
            }
            res.status(200).json({ message: "Appointment deleted successfully" });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = AppointmentController;



// static async index(req, res, next) {
//     const { page = 1, limit = 20 } = req.query;

//     try {
//         const { appointments, totalPages } = await AppointmentService.getAllAppointments(req.user, page, limit);
//         const appointmentDtos = appointments.map((appointment) => new AppointmentDto(appointment));
//         res.status(200).json({ appointments: appointmentDtos, totalPages });
//     } catch (err) {
//         next(err);
//     }
// }

// static async show(req, res, next) {
//     try {
//         const { id } = req.params;
//         const appointment = await AppointmentService.getAppointmentById(req.user, id);
//         if (!appointment) {
//             return res.status(404).json({ message: "Appointment not found" });
//         }
//         res.status(200).json(new AppointmentDto(appointment));
//     } catch (err) {
//         next(err);
//     }
// }