class EmployeeServiceDto {
    constructor(employeeService) {
        this.id = employeeService.id;
        this.employeeId = employeeService.employee_id;
        this.serviceId = employeeService.service_id;
    }
}

module.exports = EmployeeServiceDto;