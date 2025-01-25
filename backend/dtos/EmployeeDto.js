class EmployeeDto {
    constructor(employee) {
        this.id = employee.id;
        this.name = employee.name;
        this.phone = employee.phone;
        this.specialisation = employee.specialisation;
        this.userId = employee.user_id;
    }
}

module.exports = EmployeeDto;

