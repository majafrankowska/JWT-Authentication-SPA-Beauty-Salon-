class ClientDto {
    constructor(client) {
        this.id = client.id;
        this.name = client.name;
        this.phone = client.phone;
        this.address = client.address;
        this.userId = client.user_id;
    }
}

module.exports = ClientDto;