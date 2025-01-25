const ClientService = require("../services/ClientService");
const ClientDto = require('../dtos/ClientDto');

const ClientController = {

    async getAll(req, res, next) {
        const { page = 1, limit = 20 } = req.query;

        try {
            const { clients, totalPages } = await ClientService.getAllClients(req.user, page, limit);

            const clientDtos = clients.map(client => new ClientDto(client));

            res.status(200).json({ clients: clientDtos, totalPages });
        } catch (error) {
            next(error);
        }
    },

    // async getByUserId(req, res, next) {
    //     try {
    //         const client = await ClientService.getClientByUserId(req.params.userId);
    //         if (!client) {
    //             return res.status(404).json({ message: "Client not found" });
    //         }
    //         const clientDto = new ClientDto(client);
    //         res.status(200).json(clientDto);
    //     } catch (error) {
    //         next(error);
    //     }
    // },

    // async getByUserId(req, res, next) {
    //     try {
    //         const { userId } = req.params;
    //         console.log(`Fetching client with userId: ${userId}`);
    //         const client = await ClientService.getClientByUserId(userId);
    //         if (!client) {
    //             return res.status(404).json({ message: "Client not found" });
    //         }
    //         res.status(200).json(client);
    //     } catch (error) {
    //         console.error("Error in getByUserId:", error);
    //         next(error);
    //     }
    // },


    async getByUserId (req, res, next) {
        try {
            const { userId } = req.params;
            const user = req.user;  

            const client = await ClientService.getClientByUserId(user, userId);

            if (!client) {
                return res.status(404).json({ message: "Client not found" });
            }

            res.status(200).json(client);
        } catch (error) {
            next(error);  
        }
    },


    async create(req, res, next) {
        try {
            const client = await ClientService.createClient(req.user, req.body);
            res.status(201).json(client);
        } catch (error) {
            next(error);
        }
    },

    async getById(req, res, next) {
        try {
            const client = await ClientService.getClientById(req.user, req.params.id);
            if (!client) {
                return res.status(404).json({ message: "Client not found" });
            }
            res.status(200).json(client);
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const updatedClient = await ClientService.updateClient(req.user, req.params.id, req.body);
            res.status(200).json(updatedClient);
        } catch (error) {
            next(error);
        }
    },

    

    async delete(req, res, next) {
        try {
            await ClientService.deleteClient(req.user, req.params.id);
            res.status(200).json({ message: "Client deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = ClientController;