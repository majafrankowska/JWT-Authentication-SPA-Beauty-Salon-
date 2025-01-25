class Appointment {
    constructor(id, clientId, employeeId, serviceId, date, notes) {
        this.id = id;
        this.clientId = clientId; 
        this.employeeId = employeeId; 
        this.serviceId = serviceId; 
        this.date = date;
        this.notes = notes;
    }
}

module.exports = Appointment;