class ServiceDto {
    constructor(service) {
        this.id = service.id;
        this.name = service.name;
        this.price = service.price;
        this.duration = service.duration;
        this.description = service.description;
    }
}

module.exports = ServiceDto;