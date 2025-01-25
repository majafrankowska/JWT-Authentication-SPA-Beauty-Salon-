class AppointmentDto {
    constructor(appointment) {
        
        this.id = appointment.id;
        this.clientId = appointment.clientId;
        this.employeeId = appointment.employeeId;
        this.serviceId = appointment.serviceId;
        this.date = appointment.date;
        this.notes = appointment.notes;

        this.clientName = appointment.client_name;
        this.clientEmail = appointment.client_email;
        this.employeeName = appointment.employee_name;
        this.serviceName = appointment.service_name;
        this.servicePrice = appointment.service_price;

    }
}

module.exports = AppointmentDto;

// this.clientName = appointment.clientName;
// this.clientEmail = appointment.clientEmail;
// this.employeeName = appointment.employeeName;
// this.employeeEmail = appointment.employeeEmail;
// this.serviceName = appointment.serviceName;
// this.servicePrice = appointment.servicePrice;
// this.serviceDuration = appointment.serviceDuration;
// this.serviceDescription = appointment.serviceDescription;